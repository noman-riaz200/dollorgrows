import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/team - Get user's downline tree
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const depth = parseInt(searchParams.get("depth") || "3");
    const userId = session.user.id;

    // Get user's immediate downliners
    const downliners = await prisma.user.findMany({
      where: { referredBy: userId },
      include: {
        _count: {
          select: { downliners: true },
        },
      },
    });

    // Build tree recursively
    const tree = await buildTeamTree(userId, depth);

    return NextResponse.json({ tree, total: downliners.length });
  } catch (error) {
    console.error("Team API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team data" },
      { status: 500 }
    );
  }
}

async function buildTeamTree(userId: string, maxDepth: number, currentDepth: number = 0) {
  if (currentDepth >= maxDepth) return null;

  const users = await prisma.user.findMany({
    where: { referredBy: userId },
    select: {
      id: true,
      username: true,
      walletAddress: true,
      totalInvested: true,
      totalEarnings: true,
      createdAt: true,
      _count: {
        select: { downliners: true },
      },
    },
  });

  if (users.length === 0) return null;

  const childrenPromises = users.map(async (user) => {
    const children = await buildTeamTree(user.id, maxDepth, currentDepth + 1);
    return {
      user: {
        id: user.id,
        username: user.username,
        wallet: user.walletAddress.slice(0, 6) + "..." + user.walletAddress.slice(-4),
        invested: Number(user.totalInvested),
        earnings: Number(user.totalEarnings),
        downlineCount: user._count.downliners,
      },
      children,
    };
  });

  const children = await Promise.all(childrenPromises);

  return children.filter(Boolean);
}

// GET /api/team/stats - Get team statistics
export async function GET_STATS() {
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

      const downliners = await prisma.user.findMany({
        where: { referredBy: id },
        select: {
          id: true,
          investments: {
            where: { isActive: true },
            select: { id: true },
          },
        },
      });

      for (const user of downliners) {
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
