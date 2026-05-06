import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/team/commission-summary - Get commission earned per referred user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all commissions where the current user is the receiver (toUserId)
    const commissions = await prisma.commission.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        investment: {
          select: { amount: true, pool: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Aggregate by fromUserId
    const aggregated: Record<
      string,
      {
        fromUser: { id: string; name: string; email: string };
        totalCommission: number;
        levelBreakdown: Record<number, number>;
        commissionCount: number;
        lastCommissionDate: string;
      }
    > = {};

    commissions.forEach((c) => {
      const key = c.fromUserId;
      if (!aggregated[key]) {
        aggregated[key] = {
          fromUser: c.fromUser,
          totalCommission: 0,
          levelBreakdown: { 1: 0, 2: 0, 3: 0 },
          commissionCount: 0,
          lastCommissionDate: c.createdAt.toISOString(),
        };
      }
      aggregated[key].totalCommission += c.amount;
      aggregated[key].levelBreakdown[c.level] =
        (aggregated[key].levelBreakdown[c.level] || 0) + c.amount;
      aggregated[key].commissionCount += 1;
      if (c.createdAt > new Date(aggregated[key].lastCommissionDate)) {
        aggregated[key].lastCommissionDate = c.createdAt.toISOString();
      }
    });

    const summary = Object.values(aggregated).map((item) => ({
      ...item,
      levelBreakdown: item.levelBreakdown,
    }));

    // Also compute total commission earned from all referred users
    const totalCommission = summary.reduce((sum, item) => sum + item.totalCommission, 0);

    return NextResponse.json({
      summary,
      totalCommission,
      totalReferredUsers: summary.length,
    });
  } catch (error) {
    console.error("Commission summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch commission summary" },
      { status: 500 }
    );
  }
}