import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.availableBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + pool.durationDays);

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          availableBalance: { decrement: amount },
          totalInvested: { increment: amount },
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

      await tx.walletTransaction.create({
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
  tx: Prisma.TransactionClient,
  userId: string,
  poolId: string,
  amount: number
) {
  const user = await tx.user.findUnique({
    where: { id: userId },
    include: { upliner: true },
  });

  if (!user?.upliner) return;

  let currentUpliner: NonNullable<typeof user.upliner> | null = user.upliner;
  let level = 1;

  while (currentUpliner && level <= 3) {
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
          toUserId: currentUpliner.id,
          amount: commissionAmount,
          level,
          percentage: commissionRate,
          status: "pending",
          description: `Level ${level} commission from referral investment`,
        },
      });

      await tx.user.update({
        where: { id: currentUpliner.id },
        data: {
          availableBalance: { increment: commissionAmount },
          totalEarnings: { increment: commissionAmount },
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: currentUpliner.id,
          type: "commission",
          amount: commissionAmount,
          description: `Level ${level} referral commission`,
          status: "completed",
        },
      });
    }

    const nextUpliner = await tx.user.findUnique({
      where: { id: currentUpliner.referredBy || "" },
    });
    currentUpliner = nextUpliner as typeof currentUpliner;
    level++;
  }
}

async function processMatrixAssignment(
  tx: Prisma.TransactionClient,
  investorId: string,
  poolId: string,
  amount: number,
  investmentId: string
) {
  // Get the investor's referrer
  const investor = await tx.user.findUnique({
    where: { id: investorId },
    select: { referredBy: true },
  });

  if (!investor?.referredBy) return;

  const referrerId = investor.referredBy;

  // Ensure referrer has all 15 matrix slots initialized
  const existingSlots = await tx.matrixSlot.count({
    where: { ownerId: referrerId },
  });

  if (existingSlots < 15) {
    const existingPositions = new Set(
      (await tx.matrixSlot.findMany({
        where: { ownerId: referrerId },
        select: { position: true },
      })).map((s: { position: number }) => s.position)
    );

    const slotsToCreate = [];
    for (let i = 1; i <= 15; i++) {
      if (!existingPositions.has(i)) {
        slotsToCreate.push({
          ownerId: referrerId,
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
      ownerId: referrerId,
      isFilled: false,
    },
    orderBy: { position: "asc" },
  });

  if (!emptySlot) return; // Matrix is full

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
      toUserId: referrerId,
      investmentId,
      poolId,
      amount: bonusAmount,
      bonusPercent: pool.bonusPercent,
      slotPosition: emptySlot.position,
      status: "processed",
    },
  });

  // Credit bonus to referrer
  await tx.user.update({
    where: { id: referrerId },
    data: {
      availableBalance: { increment: bonusAmount },
      totalEarnings: { increment: bonusAmount },
    },
  });

  // Create wallet transaction for referrer
  await tx.walletTransaction.create({
    data: {
      userId: referrerId,
      type: "referral_bonus",
      amount: bonusAmount,
      description: `Matrix bonus (${pool.bonusPercent}%) from slot ${emptySlot.position} - ${pool.name}`,
      status: "completed",
    },
  });
}

