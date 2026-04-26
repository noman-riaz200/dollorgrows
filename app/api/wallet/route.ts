import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/wallet — enriched wallet overview
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    const totalWithdrawnAgg = await prisma.withdrawalRequest.aggregate({
      where: {
        userId,
        status: { in: ["approved", "completed"] },
      },
      _sum: { amount: true },
    });

    const totalDonatedAgg = await prisma.investment.aggregate({
      where: {
        userId,
        isActive: true,
      },
      _sum: { amount: true },
    });

    return NextResponse.json({
      wallet: {
        balanceWallet: Number(wallet?.balanceWallet || 0),
        poolWallet: Number(wallet?.poolWallet || 0),
        poolCommission: Number(wallet?.poolCommission || 0),
      },
      stats: {
        totalAvailable: Number(wallet?.balanceWallet || 0),
        totalDonated: Number(totalDonatedAgg._sum.amount || 0),
        totalWithdrawn: Number(totalWithdrawnAgg._sum.amount || 0),
        totalInPool: Number(wallet?.poolWallet || 0),
        totalCommission: Number(wallet?.poolCommission || 0),
      },
    });
  } catch (error) {
    console.error("Wallet API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}

