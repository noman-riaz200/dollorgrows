import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/team - Get user's downline tree with root user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const depth = parseInt(searchParams.get("depth") || "3");
    const userId = session.user.id;

    // Get current user (root)
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        referralCode: true,
        _count: {
          select: { referrals: true },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's immediate referrals
    const referrals = await prisma.user.findMany({
      where: { sponsorId: userId },
      include: {
        _count: {
          select: { referrals: true },
        },
      },
    });

    // Build tree recursively
    const tree = await buildTeamTree(userId, depth);

    // Calculate level based on direct referrals
    const directReferrals = currentUser._count.referrals;
    const level = calculateLevel(directReferrals);
    const nextLevelRequirement = getNextLevelRequirement(directReferrals);

    return NextResponse.json({
      root: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        createdAt: currentUser.createdAt.toISOString(),
        referralCode: currentUser.referralCode,
        downlineCount: directReferrals,
      },
      tree,
      total: referrals.length,
      directReferrals,
      level: level.name,
      levelNumber: level.number,
      nextLevelRequirement,
      progress: {
        current: directReferrals,
        required: nextLevelRequirement,
        remaining: Math.max(0, nextLevelRequirement - directReferrals),
      },
    });
  } catch (error) {
    console.error("Team API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team data" },
      { status: 500 }
    );
  }
}

function calculateLevel(directReferrals: number): { name: string; number: number } {
  if (directReferrals >= 100) return { name: "Diamond", number: 5 };
  if (directReferrals >= 50) return { name: "Platinum", number: 4 };
  if (directReferrals >= 20) return { name: "Gold", number: 3 };
  if (directReferrals >= 5) return { name: "Silver", number: 2 };
  return { name: "Bronze", number: 1 };
}

function getNextLevelRequirement(directReferrals: number): number {
  if (directReferrals >= 100) return 100; // Max level
  if (directReferrals >= 50) return 100;
  if (directReferrals >= 20) return 50;
  if (directReferrals >= 5) return 20;
  return 3; // Bronze -> Silver requires 3 direct referrals
}

interface TeamNode {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  downlineCount: number;
  children: TeamNode[] | null;
}

async function buildTeamTree(
  userId: string,
  maxDepth: number,
  currentDepth: number = 0
): Promise<TeamNode[] | null> {
  if (currentDepth >= maxDepth) return null;

  const users = await prisma.user.findMany({
    where: { sponsorId: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      wallet: {
        select: {
          poolWallet: true,
          poolCommission: true,
        },
      },
      _count: {
        select: { referrals: true },
      },
    },
  });

  if (users.length === 0) return null;

  const childrenPromises: Promise<TeamNode>[] = users.map(async (user) => {
    const childNodes = await buildTeamTree(user.id, maxDepth, currentDepth + 1);
    return {
      id: user.id,
      name: user.name,
      email: user.email.slice(0, 3) + "..." + user.email.slice(-10),
      createdAt: user.createdAt.toISOString(),
      downlineCount: user._count.referrals,
      children: childNodes,
    };
  });

  const children = await Promise.all(childrenPromises);

  return children.filter(Boolean) as TeamNode[];
}


