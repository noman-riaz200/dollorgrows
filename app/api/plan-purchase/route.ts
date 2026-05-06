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

    if (!planId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid plan ID or amount" }, { status: 400 });
    }

    // Fetch wallet and check poolWallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet || wallet.poolWallet < amount) {
      return NextResponse.json(
        { error: "Pool Wallet has insufficient funds. Please deposit funds into your Pool Wallet first." },
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
        data: { poolWallet: { decrement: amount } },
      });

      // Update pool totalInvested
      await tx.pool.update({
        where: { id: defaultPool.id },
        data: { totalInvested: { increment: amount } },
      });

      // Create investment record
      const investment = await tx.investment.create({
        data: {
          userId: session.user.id,
          poolId: defaultPool.id,
          amount,
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
          amount,
          description: `Plan "${planName}" purchase`,
          status: "completed",
        },
      });

      return investment;
    });

    return NextResponse.json({
      success: true,
      message: `Plan "${planName}" selected successfully! Deducted $${amount.toLocaleString()} from Pool Wallet.`,
      investment: result,
    });
  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Failed to process plan purchase" }, { status: 500 });
  }
}

