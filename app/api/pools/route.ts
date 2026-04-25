import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/pools - Get all active investment pools
export async function GET() {
  try {
    const pools = await prisma.pool.findMany({
      where: { isActive: true },
      orderBy: { minimumInvestment: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        minimumInvestment: true,
        maximumInvestment: true,
        dailyReturn: true,
        durationDays: true,
        level1Commission: true,
        level2Commission: true,
        level3Commission: true,
        totalInvested: true,
        totalCapacity: true,
        _count: {
          select: { investments: true },
        },
      },
    });

    return NextResponse.json({ pools });
  } catch (error) {
    console.error("Failed to fetch pools:", error);
    return NextResponse.json(
      { error: "Failed to fetch pools" },
      { status: 500 }
    );
  }
}
