import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        createdAt: true,
        wallet: {
          select: {
            balanceWallet: true,
            poolWallet: true,
            poolCommission: true,
          },
        },
        _count: {
          select: {
            investments: true,
            referrals: true,
          },
        },
      },
      take: 100,
    });

    const totalUsers = await prisma.user.count();
    const totalInvestments = await prisma.investment.count();
    const totalVolume = await prisma.investment.aggregate({
      _sum: { amount: true },
    });

    return NextResponse.json({
      users,
      count: totalUsers,
      totalInvestments,
      totalVolume: totalVolume._sum.amount || 0,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

