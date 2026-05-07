import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/investments - Fetch user investments
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
      include: {
        pool: {
          select: { name: true, dailyReturn: true, durationDays: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ investments });
  } catch (error) {
    console.error("Failed to fetch investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

// POST /api/investments - Create a new investment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { poolId, amount } = body;

    if (!poolId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid pool ID or amount" },
        { status: 400 }
      );
    }

    const pool = await prisma.pool.findUnique({
      where: { id: poolId },
    });

    if (!pool || !pool.isActive) {
      return NextResponse.json(
        { error: "Pool not found or inactive" },
        { status: 404 }
      );
    }

    if (amount < pool.minimumInvestment) {
      return NextResponse.json(
        { error: `Minimum investment is $${pool.minimumInvestment}` },
        { status: 400 }
      );
    }

    if (pool.maximumInvestment && amount > pool.maximumInvestment) {
      return NextResponse.json(
        { error: `Maximum investment is $${pool.maximumInvestment}` },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet || wallet.poolWallet < amount) {
      return NextResponse.json(
        { error: "Pool Wallet has insufficient funds. Please deposit funds into your Pool Wallet first." },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + pool.durationDays);

    const result = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId: session.user.id },
        data: {
          poolWallet: { decrement: amount },
        },
      });

      await tx.pool.update({
        where: { id: poolId },
        data: { totalInvested: { increment: amount } },
      });

      const investment = await tx.investment.create({
        data: {
          userId: session.user.id,
          poolId,
          amount,
          startDate,
          endDate,
          isActive: true,
          status: "active",
        },
      });

      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "investment",
          amount,
          description: `Investment in ${pool.name}`,
          status: "completed",
        },
      });

      // Process referral commissions (3 levels)
      await processReferralCommissions(tx, session.user.id, poolId, amount);

      // Process BFS Matrix slot assignment + bonus
      await processMatrixAssignment(tx, session.user.id, poolId, amount, investment.id);

      return investment;
    });

    return NextResponse.json({
      success: true,
      investment: result,
    });
  } catch (error) {
    console.error("Investment error:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}

async function processReferralCommissions(
  tx: any,
  userId: string,
  poolId: string,
  amount: number
) {
  const user = await tx.user.findUnique({
    where: { id: userId },
    include: { sponsor: true },
  });

  if (!user?.sponsor) return;

  let currentSponsor: NonNullable<typeof user.sponsor> | null = user.sponsor;
  let level = 1;

  while (currentSponsor && level <= 3) {
    const pool = await tx.pool.findUnique({
      where: { id: poolId },
    });

    if (!pool) break;

    let commissionRate = 0;
    switch (level) {
      case 1:
        commissionRate = pool.level1Commission;
        break;
      case 2:
        commissionRate = pool.level2Commission;
        break;
      case 3:
        commissionRate = pool.level3Commission;
        break;
    }

    const commissionAmount = (amount * commissionRate) / 100;

    if (commissionAmount > 0) {
      await tx.commission.create({
        data: {
          fromUserId: userId,
          toUserId: currentSponsor.id,
          amount: commissionAmount,
          level,
          percentage: commissionRate,
          status: "pending",
          description: `Level ${level} commission from referral investment`,
        },
      });

      await tx.wallet.update({
        where: { userId: currentSponsor.id },
        data: {
          balanceWallet: { increment: commissionAmount },
          poolCommission: { increment: commissionAmount },
        },
      });

      await tx.transaction.create({
        data: {
          userId: currentSponsor.id,
          type: "commission",
          amount: commissionAmount,
          description: `Level ${level} referral commission`,
          status: "completed",
        },
      });
    }

    const nextSponsor = await tx.user.findUnique({
      where: { id: currentSponsor.sponsorId || "" },
    });
    currentSponsor = nextSponsor as typeof currentSponsor;
    level++;
  }
}

async function processMatrixAssignment(
  tx: any,
  investorId: string,
  poolId: string,
  amount: number,
  investmentId: string
) {
  // Get the investor's sponsor
  const investor = await tx.user.findUnique({
    where: { id: investorId },
    select: { sponsorId: true },
  });

  if (!investor?.sponsorId) return;

  const sponsorId = investor.sponsorId;

  // Ensure sponsor has all 15 matrix slots initialized
  const existingSlots = await tx.matrixSlot.count({
    where: { ownerId: sponsorId },
  });

  if (existingSlots < 15) {
    const existingPositions = new Set(
      (await tx.matrixSlot.findMany({
        where: { ownerId: sponsorId },
        select: { position: true },
      })).map((s: { position: number }) => s.position)
    );

    const slotsToCreate = [];
    for (let i = 1; i <= 15; i++) {
      if (!existingPositions.has(i)) {
        slotsToCreate.push({
          ownerId: sponsorId,
          position: i,
          isFilled: false,
          bonusAmount: 0,
        });
      }
    }

    if (slotsToCreate.length > 0) {
      await tx.matrixSlot.createMany({
        data: slotsToCreate,
        skipDuplicates: true,
      });
    }
  }

  // Find first empty slot (BFS order: 1-15)
  const emptySlot = await tx.matrixSlot.findFirst({
    where: {
      ownerId: sponsorId,
      isFilled: false,
    },
    orderBy: { position: "asc" },
  });

  if (!emptySlot) return;

  // Get pool bonus percent
  const pool = await tx.pool.findUnique({
    where: { id: poolId },
    select: { bonusPercent: true, name: true },
  });

  if (!pool) return;

  const bonusAmount = (amount * pool.bonusPercent) / 100;

  // Fill the slot
  await tx.matrixSlot.update({
    where: { id: emptySlot.id },
    data: {
      filledById: investorId,
      isFilled: true,
      filledAt: new Date(),
      bonusAmount,
    },
  });

  // Create matrix bonus record
  await tx.matrixBonus.create({
    data: {
      fromUserId: investorId,
      toUserId: sponsorId,
      investmentId,
      poolId,
      amount: bonusAmount,
      bonusPercent: pool.bonusPercent,
      slotPosition: emptySlot.position,
      status: "processed",
    },
  });

  // Credit bonus to sponsor
  await tx.wallet.update({
    where: { userId: sponsorId },
    data: {
      balanceWallet: { increment: bonusAmount },
      poolCommission: { increment: bonusAmount },
    },
  });

  // Create transaction for sponsor
  await tx.transaction.create({
    data: {
      userId: sponsorId,
      type: "referral_bonus",
      amount: bonusAmount,
      description: `Matrix bonus (${pool.bonusPercent}%) from slot ${emptySlot.position} - ${pool.name}`,
      status: "completed",
    },
  });
}

