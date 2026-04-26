import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user stats from Wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Get team size (referrals count)
    const teamCount = await prisma.user.count({
      where: { sponsorId: userId },
    });

    // Get active referrals (those who invested)
    const activeReferrals = await prisma.user.count({
      where: {
        sponsorId: userId,
        investments: {
          some: { isActive: true },
        },
      },
    });

    // Get recent activity (last 10 transactions)
    const recentActivity = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
      },
    });

    // Generate chart data (last 30 days earnings)
    const chartData = await generateChartData(userId);

    // Get pool distribution
    const poolDistribution = await prisma.investment.groupBy({
      by: ["poolId"],
      where: { userId, isActive: true },
      _sum: { amount: true },
      _count: true,
    });

    // Enhance with pool names
    const distributionWithNames = await Promise.all(
      poolDistribution.map(async (item) => {
        const pool = await prisma.pool.findUnique({
          where: { id: item.poolId },
        });
        return {
          name: pool?.name || "Unknown",
          value: Number(item._sum.amount || 0),
        };
      })
    );

    return NextResponse.json({
      stats: {
        totalInvested: Number(wallet?.poolWallet || 0),
        totalEarnings: Number(wallet?.poolCommission || 0),
        availableBalance: Number(wallet?.balanceWallet || 0),
        teamSize: teamCount,
        activeReferrals,
        dailyROI: 0,
      },
      recentActivity,
      chartData,
      poolDistribution: distributionWithNames,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

async function generateChartData(userId?: string) {
  void userId;
  const days = 30;
  const data = [];
  let earnings = 0;
  let investments = 0;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    earnings += Math.random() * 50;
    investments += Math.random() * 100;
    data.push({
      date: date.toISOString().split("T")[0],
      earnings: Math.round(earnings),
      investments: Math.round(investments),
    });
  }

  return data;
}

