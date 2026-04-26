import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/matrix - Get current user's matrix slots
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slots = await prisma.matrixSlot.findMany({
      where: { ownerId: session.user.id },
      orderBy: { position: "asc" },
    });

    // Ensure all 15 positions exist
    const existingPositions = new Set(slots.map((s) => s.position));
    const missingPositions = [];
    for (let i = 1; i <= 15; i++) {
      if (!existingPositions.has(i)) {
        missingPositions.push(i);
      }
    }

    if (missingPositions.length > 0) {
      await prisma.matrixSlot.createMany({
        data: missingPositions.map((pos) => ({
          ownerId: session.user.id,
          position: pos,
          isFilled: false,
          bonusAmount: 0,
        })),
        skipDuplicates: true,
      });
    }

    // Re-fetch after creating missing slots
    const allSlots = await prisma.matrixSlot.findMany({
      where: { ownerId: session.user.id },
      orderBy: { position: "asc" },
    });

    // Get matrix bonus stats
    const totalBonusEarned = await prisma.matrixBonus.aggregate({
      where: { toUserId: session.user.id },
      _sum: { amount: true },
    });

    const totalBonusPaid = await prisma.matrixBonus.aggregate({
      where: { fromUserId: session.user.id },
      _sum: { amount: true },
    });

    // Fetch user details for filled slots
    const filledByIds = allSlots.filter((s) => s.filledById).map((s) => s.filledById!);
    const filledUsers = filledByIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: filledByIds } },
          select: { id: true, name: true, email: true },
        })
      : [];
    const userMap = new Map(filledUsers.map((u) => [u.id, u]));

    return NextResponse.json({
      slots: allSlots.map((s) => {
        const filledUser = s.filledById ? userMap.get(s.filledById) : null;
        return {
          position: s.position,
          isFilled: s.isFilled,
          filledBy: filledUser?.name || null,
          filledByEmail: filledUser?.email
            ? `${filledUser.email.slice(0, 3)}...${filledUser.email.slice(-10)}`
            : null,
          bonusAmount: Number(s.bonusAmount),
          filledAt: s.filledAt,
        };
      }),
      stats: {
        filled: allSlots.filter((s) => s.isFilled).length,
        total: 15,
        totalBonusEarned: Number(totalBonusEarned._sum.amount || 0),
        totalBonusPaid: Number(totalBonusPaid._sum.amount || 0),
      },
    });
  } catch (error) {
    console.error("Matrix API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matrix data" },
      { status: 500 }
    );
  }
}

// POST /api/matrix/assign - Assign a user to the next available slot (called internally)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { investorId, referrerId, poolId, amount } = body;

    if (!investorId || !referrerId || !poolId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the referrer's first empty slot (BFS order: 1-15)
    const emptySlot = await prisma.matrixSlot.findFirst({
      where: {
        ownerId: referrerId,
        isFilled: false,
      },
      orderBy: { position: "asc" },
    });

    if (!emptySlot) {
      return NextResponse.json(
        { error: "Matrix is full" },
        { status: 400 }
      );
    }

    // Get pool bonus percent
    const pool = await prisma.pool.findUnique({
      where: { id: poolId },
      select: { bonusPercent: true, name: true },
    });

    if (!pool) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    const bonusAmount = (amount * pool.bonusPercent) / 100;

    // Execute matrix assignment and bonus distribution in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Fill the slot
      const updatedSlot = await tx.matrixSlot.update({
        where: { id: emptySlot.id },
        data: {
          filledById: investorId,
          isFilled: true,
          filledAt: new Date(),
          bonusAmount,
        },
      });

      // Create matrix bonus record
      const matrixBonus = await tx.matrixBonus.create({
        data: {
          fromUserId: investorId,
          toUserId: referrerId,
          investmentId: "",
          poolId,
          amount: bonusAmount,
          bonusPercent: pool.bonusPercent,
          slotPosition: emptySlot.position,
          status: "processed",
        },
      });

      // Credit bonus to referrer
      await tx.wallet.update({
        where: { userId: referrerId },
        data: {
          balanceWallet: { increment: bonusAmount },
          poolCommission: { increment: bonusAmount },
        },
      });

      // Create transaction for referrer
      await tx.transaction.create({
        data: {
          userId: referrerId,
          type: "referral_bonus",
          amount: bonusAmount,
          description: `Matrix bonus (${pool.bonusPercent}%) from slot ${emptySlot.position} - ${pool.name}`,
          status: "completed",
        },
      });

      return { slot: updatedSlot, bonus: matrixBonus };
    });

    return NextResponse.json({
      success: true,
      position: emptySlot.position,
      bonusAmount,
      bonusPercent: pool.bonusPercent,
      data: result,
    });
  } catch (error) {
    console.error("Matrix assignment error:", error);
    return NextResponse.json(
      { error: "Failed to assign matrix slot" },
      { status: 500 }
    );
  }
}

