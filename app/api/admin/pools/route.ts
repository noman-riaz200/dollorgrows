import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/pools
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, check for admin role
    const pools = await prisma.pool.findMany({
      orderBy: { minimumInvestment: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        minimumInvestment: true,
        maximumInvestment: true,
        dailyReturn: true,
        durationDays: true,
        isActive: true,
        totalInvested: true,
        totalCapacity: true,
        _count: {
          select: { investments: true },
        },
      },
    });

    return NextResponse.json({ pools, count: pools.length });
  } catch (error) {
    console.error("Admin pools error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pools" },
      { status: 500 }
    );
  }
}
