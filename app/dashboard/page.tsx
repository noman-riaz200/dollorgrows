"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { MatrixGrid } from "@/components/ui/MatrixGrid";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const COLORS = ["#00d2ff", "#00ff88", "#8b5cf6", "#f59e0b", "#ef4444"] as const;

interface DashboardStats {
  totalInvested: number;
  totalEarnings: number;
  availableBalance: number;
  teamSize: number;
  activeReferrals: number;
  dailyROI: number;
}

interface ActivityItem {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface ChartDatum {
  date: string;
  earnings: number;
  investments: number;
}

interface PoolDistItem {
  name: string;
  value: number;
}

interface MatrixSlotData {
  position: number;
  isFilled: boolean;
  filledBy: string | null;
  bonusAmount: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalInvested: 0,
    totalEarnings: 0,
    availableBalance: 0,
    teamSize: 0,
    activeReferrals: 0,
    dailyROI: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<ChartDatum[]>([]);
  const [poolDistribution, setPoolDistribution] = useState<PoolDistItem[]>([]);
  const [matrixSlots, setMatrixSlots] = useState<MatrixSlotData[]>([]);
  const [matrixStats, setMatrixStats] = useState({ filled: 0, total: 15, totalBonusEarned: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      const loadData = async () => {
        try {
          const [dashRes, matrixRes] = await Promise.all([
            fetch("/api/dashboard/stats"),
            fetch("/api/matrix"),
          ]);
          const dashData = await dashRes.json();
          const matrixData = await matrixRes.json();

          setStats(dashData.stats);
          setRecentActivity(dashData.recentActivity || []);
          setChartData(dashData.chartData || []);
          setPoolDistribution(dashData.poolDistribution || []);

          if (matrixData.slots) {
            setMatrixSlots(matrixData.slots);
            setMatrixStats(matrixData.stats);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      };
      loadData();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-16 h-16 border-4 border-[#00d2ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-[#00d2ff]">{session?.user?.name || "User"}</span>!
          </h1>
          <p className="text-gray-400">
            Here&apos;s an overview of your portfolio and earnings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Invested"
            value={`$${stats.totalInvested.toLocaleString()}`}
            change="0%"
            positive={true}
            icon={Wallet}
            accent="cyan"
          />
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            change="12%"
            positive={true}
            icon={TrendingUp}
            accent="green"
          />
          <StatCard
            title="Available Balance"
            value={`$${stats.availableBalance.toLocaleString()}`}
            change="0%"
            positive={true}
            icon={BarChart3}
            accent="cyan"
          />
          <StatCard
            title="Team Size"
            value={stats.teamSize.toString()}
            change={`+${stats.activeReferrals}`}
            positive={true}
            icon={Users}
            accent="green"
          />
        </div>

        {/* Matrix + Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Matrix Grid */}
          <GlassCard className="lg:col-span-1" glow="cyan">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00d2ff]" />
                BFS Matrix
              </h3>
              <span className="text-xs text-[#00ff88] font-medium">
                {matrixStats.filled}/{matrixStats.total} filled
              </span>
            </div>
            <MatrixGrid
              slots={matrixSlots.map((s) => ({
                position: s.position,
                isFilled: s.isFilled,
                filledBy: s.filledBy || undefined,
                bonusAmount: s.bonusAmount,
              }))}
            />
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Matrix Bonus Earned</span>
                <span className="text-[#00ff88] font-bold">
                  ${matrixStats.totalBonusEarned.toLocaleString()}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Earnings Chart */}
          <GlassCard className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">Earnings Overview</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0f",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#00d2ff"
                    strokeWidth={2}
                    dot={{ fill: "#00d2ff", r: 3 }}
                    name="Earnings"
                  />
                  <Line
                    type="monotone"
                    dataKey="investments"
                    stroke="#00ff88"
                    strokeWidth={2}
                    dot={{ fill: "#00ff88", r: 3 }}
                    name="Investments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Pool Distribution + Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Pool Distribution */}
          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Pool Distribution</h3>
            <div className="h-72 flex items-center justify-center">
              {poolDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={poolDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => entry.name}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {poolDistribution.map((entry: PoolDistItem, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0f",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No active investments</p>
              )}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <Link
                href="/dashboard/wallet"
                className="text-[#00d2ff] hover:text-[#00ff88] text-sm flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === "commission" || activity.type === "referral_bonus"
                            ? "bg-[#00ff88]/10 text-[#00ff88]"
                            : activity.type === "investment"
                            ? "bg-[#00d2ff]/10 text-[#00d2ff]"
                            : "bg-white/[0.03] text-gray-400"
                        }`}
                      >
                        {activity.type === "commission" || activity.type === "referral_bonus" ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : activity.type === "investment" ? (
                          <Wallet className="w-5 h-5" />
                        ) : (
                          <BarChart3 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${activity.amount > 0 ? "text-[#00ff88]" : "text-red-400"}`}>
                      {activity.amount > 0 ? "+" : ""}${activity.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

