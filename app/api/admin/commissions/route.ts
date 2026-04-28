import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/commissions - Commission report
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commissions = await prisma.commission.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } },
        investment: {
          select: { amount: true, pool: { select: { name: true } } },
        },
      },
    });

    const stats = await prisma.commission.aggregate({
      _sum: { amount: true },
      _count: true,
    });

    const levelStats = await prisma.$queryRaw`
      SELECT level, COUNT(*) as count, SUM(amount) as total
      FROM commissions
      GROUP BY level
      ORDER BY level
    `;

    return NextResponse.json({
      commissions,
      stats: {
        totalAmount: Number(stats._sum.amount || 0),
        totalCount: stats._count,
      },
      levelStats,
    });
  } catch (error) {
    console.error("Admin commissions error:", error);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}

