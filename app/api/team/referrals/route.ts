import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/team/referrals - Get detailed list of user's direct referrals
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get current user's direct referrals with detailed information
    const referrals = await prisma.user.findMany({
      where: { sponsorId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        avatar: true,
        referralCode: true,
        createdAt: true,
        lastLogin: true,
        status: true,
        wallet: {
          select: {
            balanceWallet: true,
            poolWallet: true,
            poolCommission: true,
          },
        },
        investments: {
          where: { isActive: true },
          select: {
            id: true,
            amount: true,
            pool: {
              select: {
                name: true,
                dailyReturn: true,
              },
            },
            startDate: true,
            endDate: true,
          },
        },
        _count: {
          select: {
            referrals: true,
            investments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format the response
    const formattedReferrals = referrals.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "—",
      country: user.country || "—",
      avatar: user.avatar,
      referralCode: user.referralCode,
      joinedDate: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString() || "Never",
      status: user.status,
      walletBalance: user.wallet?.balanceWallet || 0,
      poolWallet: user.wallet?.poolWallet || 0,
      poolCommission: user.wallet?.poolCommission || 0,
      totalInvestments: user._count.investments,
      activeInvestments: user.investments.length,
      totalReferrals: user._count.referrals,
      investments: user.investments.map((inv) => ({
        id: inv.id,
        amount: inv.amount,
        poolName: inv.pool.name,
        dailyReturn: inv.pool.dailyReturn,
        startDate: inv.startDate.toISOString(),
        endDate: inv.endDate.toISOString(),
      })),
    }));

    return NextResponse.json({
      referrals: formattedReferrals,
      total: referrals.length,
    });
  } catch (error) {
    console.error("Referrals API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals data" },
      { status: 500 }
    );
  }
}