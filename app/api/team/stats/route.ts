import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/team/stats - Get team statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let totalDownline = 0;
    let activeDownline = 0;
    const levelCounts: Record<string, number> = {};

    // BFS traversal
    const queue: { id: string; level: number }[] = [
      { id: session.user.id, level: 0 },
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;

      if (visited.has(id)) continue;
      visited.add(id);

      if (level > 0) {
        totalDownline++;
        levelCounts[`level_${level}`] = (levelCounts[`level_${level}`] || 0) + 1;
      }

      if (level >= 5) continue;

      const referrals = await prisma.user.findMany({
        where: { sponsorId: id },
        select: {
          id: true,
          investments: {
            where: { isActive: true },
            select: { id: true },
          },
        },
      });

      for (const user of referrals) {
        if (!visited.has(user.id)) {
          queue.push({ id: user.id, level: level + 1 });
          if (user.investments.length > 0) {
            activeDownline++;
          }
        }
      }
    }

    return NextResponse.json({
      totalDownline,
      activeDownline,
      levelCounts,
      conversionRate: totalDownline > 0 ? (activeDownline / totalDownline) * 100 : 0,
    });
  } catch (error) {
    console.error("Team stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team stats" },
      { status: 500 }
    );
  }
}

