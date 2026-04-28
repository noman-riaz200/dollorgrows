import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/profit/claim - Claim daily profit for an active investment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { investmentId } = body;

    if (!investmentId) {
      return NextResponse.json({ error: "Missing investment ID" }, { status: 400 });
    }

    const investment = await prisma.investment.findFirst({
      where: {
        id: investmentId,
        userId,
        isActive: true,
        status: "active",
      },
      include: { pool: true },
    });

    if (!investment) {
      return NextResponse.json({ error: "Investment not found or inactive" }, { status: 404 });
    }

    const now = new Date();
    const lastClaim = investment.lastClaimDate || investment.startDate;
    const daysSinceLastClaim = Math.floor(
      (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastClaim < 1) {
      return NextResponse.json(
        { error: "You can only claim once per day" },
        { status: 400 }
      );
    }

    // Calculate daily profit
    const dailyProfit = (investment.amount * investment.pool.dailyReturn) / 100;
    const daysToClaim = Math.min(daysSinceLastClaim, 7); // Max 7 days back-claim
    const totalProfit = dailyProfit * daysToClaim;

    await prisma.$transaction(async (tx) => {
      // Credit profit to balance
      await tx.wallet.update({
        where: { userId },
        data: {
          balanceWallet: { increment: totalProfit },
          poolCommission: { increment: totalProfit },
        },
      });

      // Update investment last claim
      await tx.investment.update({
        where: { id: investmentId },
        data: {
          lastClaimDate: now,
          totalClaimed: { increment: totalProfit },
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: "commission",
          amount: totalProfit,
          status: "confirmed",
          description: `Daily profit from ${investment.pool.name} (${daysToClaim} day(s))`,
        },
      });

      // Create daily profit record
      await tx.dailyProfit.create({
        data: {
          userId,
          investmentId,
          amount: totalProfit,
          profitDate: now,
          isClaimed: true,
          claimedAt: now,
        },
      });
    });

    return NextResponse.json({
      success: true,
      profit: totalProfit,
      daysClaimed: daysToClaim,
      dailyRate: investment.pool.dailyReturn,
    });
  } catch (error) {
    console.error("Profit claim error:", error);
    return NextResponse.json({ error: "Failed to claim profit" }, { status: 500 });
  }
}

