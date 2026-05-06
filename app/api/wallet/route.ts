import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/wallet — enriched wallet overview
export async function GET(request: Request) {
  try {
    console.log("=== Wallet API called ===");
    
    let userId: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      console.log("Session:", !!session, session?.user?.id ? "User ID: " + session.user.id : "No user ID");
      userId = session?.user?.id || null;
    } catch (authError) {
      console.error("Auth session error:", authError);
    }

    let wallet = { balanceWallet: 0, poolWallet: 0, poolCommission: 0 };
    let stats = {
      totalAvailable: 0,
      totalDonated: 0,
      totalWithdrawn: 0,
      totalInPool: 0,
      totalCommission: 0,
    };

    if (userId) {
      try {
        // Ensure wallet exists
        wallet = await prisma.wallet.upsert({
          where: { userId },
          update: {},
          create: {
            userId,
            balanceWallet: 0,
            poolWallet: 0,
            poolCommission: 0,
          },
        });
        console.log("Wallet upserted:", (wallet as any).id || 'no id');
      } catch (walletError) {
        console.error("Wallet upsert error:", walletError);
      }

      try {
        // Total withdrawn (approved/completed only)
        const totalWithdrawnAgg = await prisma.withdrawalRequest.aggregate({
          where: {
            userId,
            status: { in: ["approved", "completed"] },
          },
          _sum: { amount: true },
        });
        stats.totalWithdrawn = Number(totalWithdrawnAgg._sum.amount || 0);
      } catch (wdError) {
        console.error("Withdrawal aggregate error:", wdError);
      }

      try {
        // Total donated (active investments)
        const totalDonatedAgg = await prisma.investment.aggregate({
          where: {
            userId,
            isActive: true,
          },
          _sum: { amount: true },
        });
        stats.totalDonated = Number(totalDonatedAgg._sum.amount || 0);
      } catch (invError) {
        console.error("Investment aggregate error:", invError);
      }
    } else {
      console.log("No user session, returning empty data");
    }

    stats.totalAvailable = Number(wallet.balanceWallet || 0);
    stats.totalInPool = Number(wallet.poolWallet || 0);
    stats.totalCommission = Number(wallet.poolCommission || 0);

    console.log("Returning wallet data:", { wallet, stats });
    
    return NextResponse.json({
      wallet: {
        balanceWallet: Number(wallet.balanceWallet || 0),
        poolWallet: Number(wallet.poolWallet || 0),
        poolCommission: Number(wallet.poolCommission || 0),
      },
      stats,
    });
  } catch (error) {
    console.error("Wallet API top-level error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}

