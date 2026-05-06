import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/team/downline - Get detailed list of downline users up to Level 5
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Step 1: BFS traversal to collect downline users with level
    const queue: { id: string; level: number }[] = [{ id: userId, level: 0 }];
    const visited = new Set<string>();
    const downlineUsers: { id: string; level: number }[] = [];

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;

      if (visited.has(id)) continue;
      visited.add(id);

      if (level > 0) {
        downlineUsers.push({ id, level });
      }

      if (level >= 5) continue;

      const referrals = await prisma.user.findMany({
        where: { sponsorId: id },
        select: { id: true },
      });

      for (const user of referrals) {
        if (!visited.has(user.id)) {
          queue.push({ id: user.id, level: level + 1 });
        }
      }
    }

    // Step 2: Fetch details for each downline user
    const userIds = downlineUsers.map(u => u.id);
    const usersDetails = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        avatar: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        investments: {
          where: { isActive: true },
          select: { id: true },
        },
        wallet: {
          select: {
            balanceWallet: true,
            poolWallet: true,
            poolCommission: true,
          },
        },
      },
    });

    // Step 3: Fetch commissions earned from each downline user
    const commissions = await prisma.commission.findMany({
      where: { toUserId: userId },
      select: {
        fromUserId: true,
        amount: true,
      },
    });

    // Aggregate commission per fromUserId
    const commissionMap: Record<string, number> = {};
    commissions.forEach(c => {
      commissionMap[c.fromUserId] = (commissionMap[c.fromUserId] || 0) + c.amount;
    });

    // Step 4: Combine data
    const downlineList = downlineUsers.map(downline => {
      const details = usersDetails.find(u => u.id === downline.id);
      const commissionEarned = commissionMap[downline.id] || 0;
      const active = details?.investments.length > 0;

      return {
        id: downline.id,
        name: details?.name || "",
        email: details?.email || "",
        phone: details?.phone || "—",
        country: details?.country || "—",
        avatar: details?.avatar,
        status: details?.status || "unknown",
        joinedDate: details?.createdAt.toISOString(),
        lastLogin: details?.lastLogin?.toISOString() || "Never",
        level: downline.level,
        active: active,
        activeInvestmentsCount: details?.investments.length || 0,
        walletBalance: details?.wallet?.balanceWallet || 0,
        poolWallet: details?.wallet?.poolWallet || 0,
        poolCommission: details?.wallet?.poolCommission || 0,
        conversionCommission: commissionEarned,
      };
    });

    // Sort by level then by name
    downlineList.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      downline: downlineList,
      total: downlineList.length,
      levels: {
        1: downlineList.filter(u => u.level === 1).length,
        2: downlineList.filter(u => u.level === 2).length,
        3: downlineList.filter(u => u.level === 3).length,
        4: downlineList.filter(u => u.level === 4).length,
        5: downlineList.filter(u => u.level === 5).length,
      },
    });
  } catch (error) {
    console.error("Downline API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch downline data" },
      { status: 500 }
    );
  }
}