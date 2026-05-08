import { prisma } from "./prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Get the current authenticated user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

/**
 * Dashboard Data Fetcher
 * Fetches all data needed for the dashboard page
 */
export async function fetchDashboardData(userId: string) {
  // Run all independent queries in parallel
  const [
    wallet,
    teamCount,
    activeReferrals,
    recentActivity,
    poolDistribution,
    userWithSponsor,
    pendingUsers,
    totalWithdrawal,
    totalExchange,
  ] = await Promise.all([
    // 1. Get user wallet
    prisma.wallet.findUnique({
      where: { userId },
    }),
    
    // 2. Get team size (referrals count)
    prisma.user.count({
      where: { sponsorId: userId },
    }),
    
    // 3. Get active referrals (those who invested)
    prisma.user.count({
      where: {
        sponsorId: userId,
        investments: {
          some: { isActive: true },
        },
      },
    }),
    
    // 4. Get recent activity (last 10 transactions)
    prisma.transaction.findMany({
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
    }),
    
    // 5. Get pool distribution with pool names in a single query
    prisma.investment.groupBy({
      by: ["poolId"],
      where: { userId, isActive: true },
      _sum: { amount: true },
      _count: true,
    }).then(async (distribution) => {
      // Get all pool IDs
      const poolIds = distribution.map(item => item.poolId).filter(Boolean);
      if (poolIds.length === 0) return [];
      
      // Fetch all pools in a single query
      const pools = await prisma.pool.findMany({
        where: { id: { in: poolIds } },
        select: { id: true, name: true },
      });
      
      // Create a map for quick lookup
      const poolMap = new Map(pools.map(p => [p.id, p.name]));
      
      return distribution.map(item => ({
        name: poolMap.get(item.poolId) || "Unknown",
        value: Number(item._sum.amount || 0),
      }));
    }),
    
    // 6. Get sponsor name
    prisma.user.findUnique({
      where: { id: userId },
      include: { sponsor: { select: { name: true } } },
    }),
    
    // 7. Get pending users (referrals with no active investments)
    prisma.user.count({
      where: {
        sponsorId: userId,
        investments: {
          none: { isActive: true },
        },
      },
    }),
    
    // 8. Get total withdrawal amount
    prisma.withdrawalRequest.aggregate({
      where: {
        userId,
        status: { in: ["approved", "completed"] },
      },
      _sum: { amount: true },
    }),
    
    // 9. Get total exchange amount
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "exchange",
        status: { in: ["confirmed", "completed"] },
      },
      _sum: { amount: true },
    }),
  ]);

  // Generate chart data (last 30 days) - this is mock data, can run in parallel too
  const chartData = await generateChartData(userId);

  return {
    stats: {
      totalInvested: Number(wallet?.poolWallet || 0),
      totalEarnings: Number(wallet?.poolCommission || 0),
      availableBalance: Number(wallet?.balanceWallet || 0),
      balanceWallet: Number(wallet?.balanceWallet || 0),
      poolWallet: Number(wallet?.poolWallet || 0),
      poolCommission: Number(wallet?.poolCommission || 0),
      teamSize: teamCount,
      activeReferrals,
      pendingUsers,
      sponsorName: userWithSponsor?.sponsor?.name || "—",
      totalWithdrawal: Number(totalWithdrawal._sum.amount || 0),
      totalExchange: Number(totalExchange._sum.amount || 0),
      dailyROI: 0, // This could be calculated based on investments
    },
    recentActivity,
    chartData,
    poolDistribution,
  };
}

/**
 * Referral Link Data Fetcher
 * Fetches user data needed for the referral link page
 */
export async function fetchReferralLinkData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      referralCode: true,
      avatar: true,
    },
  });

  return {
    user: {
      name: user?.name || "—",
      email: user?.email || "—",
      phone: user?.phone || "—",
      referralCode: user?.referralCode || "YOURCODE",
      avatar: user?.avatar || null,
    },
  };
}

/**
 * Team Data Fetcher
 * Fetches team tree structure and statistics
 */
export async function fetchTeamData(userId: string, depth: number = 3) {
  // Get direct referrals (level 1)
  const directReferrals = await prisma.user.findMany({
    where: { sponsorId: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      avatar: true,
    },
  });

  // Build tree recursively
  const buildTree = async (parentId: string, currentDepth: number): Promise<any[]> => {
    if (currentDepth >= depth) return [];

    const children = await prisma.user.findMany({
      where: { sponsorId: parentId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        avatar: true,
      },
    });

    const childrenWithDescendants = await Promise.all(
      children.map(async (child) => ({
        ...child,
        children: await buildTree(child.id, currentDepth + 1),
      }))
    );

    return childrenWithDescendants;
  };

  const tree = await buildTree(userId, 1);

  // Get team statistics
  const totalDownline = await countTotalDownline(userId);
  const activeDownline = await countActiveDownline(userId);
  
  // Count by level
  const levelCounts = await countDownlineByLevel(userId, 5);

  return {
    root: {
      id: userId,
      name: "You",
      email: "",
      createdAt: new Date().toISOString(),
      downlineCount: totalDownline,
    },
    tree,
    total: totalDownline,
    directReferrals: directReferrals.length,
    level: getLevelBasedOnReferrals(directReferrals.length),
    levelNumber: Math.min(Math.floor(directReferrals.length / 5) + 1, 5),
    nextLevelRequirement: (Math.floor(directReferrals.length / 5) + 1) * 5,
    progress: {
      current: directReferrals.length,
      required: (Math.floor(directReferrals.length / 5) + 1) * 5,
      remaining: Math.max(0, (Math.floor(directReferrals.length / 5) + 1) * 5 - directReferrals.length),
    },
    stats: {
      totalDownline,
      activeDownline,
      levelCounts,
      conversionRate: totalDownline > 0 ? Math.round((activeDownline / totalDownline) * 100) : 0,
    },
  };
}

/**
 * Commission Data Fetcher
 * Fetches commission history and statistics
 */
export async function fetchCommissionData(userId: string) {
  const commissions = await prisma.commission.findMany({
    where: { toUserId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: {
        select: {
          name: true,
          email: true,
        },
      },
      investment: {
        select: {
          amount: true,
          pool: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Calculate totals
  const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
  const level1Total = commissions.filter(c => c.level === 1).reduce((sum, c) => sum + c.amount, 0);
  const level2Total = commissions.filter(c => c.level === 2).reduce((sum, c) => sum + c.amount, 0);
  const level3Total = commissions.filter(c => c.level === 3).reduce((sum, c) => sum + c.amount, 0);

  return {
    commissions,
    stats: {
      totalEarned,
      level1Total,
      level2Total,
      level3Total,
      totalCount: commissions.length,
    },
  };
}

/**
 * Exchange History Data Fetcher
 * Fetches transaction history for exchange, deposit, and withdrawal
 */
export async function fetchExchangeHistory(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: { in: ["exchange", "deposit", "withdrawal"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      amount: true,
      status: true,
      description: true,
      createdAt: true,
      txHash: true,
      network: true,
    },
  });

  return { transactions };
}

/**
 * Settings Data Fetcher
 * Fetches user profile data for settings page
 */
export async function fetchUserSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      country: true,
      phoneCode: true,
      avatar: true,
      securityPin: true,
    },
  });

  return {
    user: {
      ...user,
      hasPin: !!user?.securityPin,
      // Don't expose the actual PIN
      securityPin: undefined,
    },
  };
}

/**
 * Plans Data Fetcher
 * Fetches investment plans and user's current investments
 */
export async function fetchPlansData(userId: string) {
  const [plans, userInvestments] = await Promise.all([
    // Get all active pools
    prisma.pool.findMany({
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
        totalCapacity: true,
        totalInvested: true,
        level1Commission: true,
        level2Commission: true,
        level3Commission: true,
        bonusPercent: true,
      },
    }),
    // Get user's active investments
    prisma.investment.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        pool: {
          select: {
            name: true,
            dailyReturn: true,
          },
        },
      },
    }),
  ]);

  return {
    plans: plans.map((plan, index) => ({
      id: index + 1,
      name: plan.name,
      price: plan.minimumInvestment,
      returnAmount: plan.minimumInvestment * (1 + plan.dailyReturn * plan.durationDays / 100),
      returnPercent: plan.dailyReturn * plan.durationDays,
      ...plan,
    })),
    userInvestments,
  };
}

// Helper functions

async function generateChartData(userId?: string): Promise<any[]> {
  // This is a simplified version - in production, you would fetch actual data
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

async function countTotalDownline(userId: string): Promise<number> {
  // Count all users in the downline (recursive)
  const countRecursive = async (id: string): Promise<number> => {
    const direct = await prisma.user.findMany({
      where: { sponsorId: id },
      select: { id: true },
    });

    let total = direct.length;
    for (const child of direct) {
      total += await countRecursive(child.id);
    }
    return total;
  };

  return await countRecursive(userId);
}

async function countActiveDownline(userId: string): Promise<number> {
  // Count downline users with active investments
  const getDownlineIds = async (id: string): Promise<string[]> => {
    const direct = await prisma.user.findMany({
      where: { sponsorId: id },
      select: { id: true },
    });

    let ids = direct.map(d => d.id);
    for (const child of direct) {
      const childIds = await getDownlineIds(child.id);
      ids = ids.concat(childIds);
    }
    return ids;
  };

  const downlineIds = await getDownlineIds(userId);
  
  if (downlineIds.length === 0) return 0;

  const activeCount = await prisma.user.count({
    where: {
      id: { in: downlineIds },
      investments: {
        some: { isActive: true },
      },
    },
  });

  return activeCount;
}

async function countDownlineByLevel(userId: string, maxLevel: number = 5): Promise<Record<string, number>> {
  const levelCounts: Record<string, number> = {};
  
  for (let level = 1; level <= maxLevel; level++) {
    const count = await countDownlineAtLevel(userId, level);
    levelCounts[`level_${level}`] = count;
  }
  
  return levelCounts;
}

async function countDownlineAtLevel(userId: string, targetLevel: number, currentLevel: number = 1): Promise<number> {
  if (currentLevel === targetLevel) {
    // Count direct referrals at this level
    return await prisma.user.count({
      where: { sponsorId: userId },
    });
  }

  // Get direct referrals and recursively count their downline
  const directReferrals = await prisma.user.findMany({
    where: { sponsorId: userId },
    select: { id: true },
  });

  let total = 0;
  for (const referral of directReferrals) {
    total += await countDownlineAtLevel(referral.id, targetLevel, currentLevel + 1);
  }

  return total;
}

function getLevelBasedOnReferrals(count: number): string {
  if (count >= 20) return "Diamond";
  if (count >= 15) return "Platinum";
  if (count >= 10) return "Gold";
  if (count >= 5) return "Silver";
  return "Bronze";
}