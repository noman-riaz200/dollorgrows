import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, amount } = body;

    // Validate input
    if (!planId || planId < 1 || planId > 15) {
      return NextResponse.json({ error: "Invalid plan ID. Please select a valid plan." }, { status: 400 });
    }
    const planAmount = Number(amount);
    if (!planAmount || planAmount <= 0 || isNaN(planAmount)) {
      return NextResponse.json({ error: "Invalid plan amount" }, { status: 400 });
    }

    // Fetch wallet and check poolWallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found. Please contact support." },
        { status: 404 }
      );
    }

    const walletBalance = Number(wallet.poolWallet);
    if (walletBalance < planAmount) {
      return NextResponse.json(
        {
          error: "Insufficient pool balance",
          details: `Required: $${planAmount.toFixed(2)}, Available: $${walletBalance.toFixed(2)}`
        },
        { status: 400 }
      );
    }

    // Find first active pool as default for plan investment
    const defaultPool = await prisma.pool.findFirst({
      where: { isActive: true },
    });

    if (!defaultPool) {
      return NextResponse.json({ error: "No active pools available" }, { status: 404 });
    }

    const planNames = [
      "", "Grower", "Builder", "Starter", "Accelerator", "Booster",
      "Catalyst", "Visionary", "Pioneer", "Navigator", "Innovator",
      "Champion", "Elite", "Titan", "Legend", "Supreme"
    ];
    const planName = planNames[planId] || `Plan ${planId}`;

    // Atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from poolWallet only
      await tx.wallet.update({
        where: { userId: session.user.id },
        data: { poolWallet: { decrement: planAmount } },
      });

      // Update pool totalInvested
      await tx.pool.update({
        where: { id: defaultPool.id },
        data: { totalInvested: { increment: planAmount } },
      });

      // Create investment record
      const investment = await tx.investment.create({
        data: {
          userId: session.user.id,
          poolId: defaultPool.id,
          amount: planAmount,
          startDate: new Date(),
          endDate: new Date(Date.now() + defaultPool.durationDays * 24 * 60 * 60 * 1000),
          isActive: true,
          status: "active",
        },
      });

      // Log transaction
      await tx.transaction.create({
        data: {
          userId: session.user.id,
          type: "plan_purchase",
          amount: planAmount,
          description: `Plan "${planName}" purchase`,
          status: "completed",
        },
      });

      return investment;
    });

    return NextResponse.json({
      success: true,
      message: `Plan "${planName}" selected successfully! Deducted $${planAmount.toLocaleString()} from Pool Wallet.`,
      investment: result,
    });
  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Failed to process plan purchase" }, { status: 500 });
  }
}

