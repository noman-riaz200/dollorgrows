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
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

const COLORS = ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"] as const;

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

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      const loadData = async () => {
        try {
          const res = await fetch("/api/dashboard/stats");
          const data = await res.json();
          setStats(data.stats);
          setRecentActivity(data.recentActivity || []);
          setChartData(data.chartData || []);
          setPoolDistribution(data.poolDistribution || []);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      };
      loadData();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Fund Grow
            </span>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 text-cyan-400 border border-cyan-500/30"
            >
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/pools"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
            >
              <Wallet className="w-5 h-5" />
              Investment Pools
            </Link>
            <Link
              href="/dashboard/team"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
            >
              <Users className="w-5 h-5" />
              My Team
            </Link>
            <Link
              href="/dashboard/wallet"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
            >
              <Wallet className="w-5 h-5" />
              Wallet
            </Link>
            <Link
              href="/dashboard/referrals"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
            >
              <TrendingUp className="w-5 h-5" />
              Referrals
            </Link>
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold">
                {session?.user?.username?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.username || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session?.user?.walletAddress?.slice(0, 6)}...{session?.user?.walletAddress?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session?.user?.username || "User"}!
          </h1>
          <p className="text-gray-400">
            Here&apos;s an overview of your portfolio and earnings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Invested",
              value: `$${stats.totalInvested.toLocaleString()}`,
              change: "+0%",
              positive: true,
              icon: Wallet,
              color: "cyan",
            },
            {
              label: "Total Earnings",
              value: `$${stats.totalEarnings.toLocaleString()}`,
              change: "+12%",
              positive: true,
              icon: TrendingUp,
              color: "emerald",
            },
            {
              label: "Available Balance",
              value: `$${stats.availableBalance.toLocaleString()}`,
              change: "0%",
              positive: true,
              icon: BarChart3,
              color: "cyan",
            },
            {
              label: "Team Size",
              value: stats.teamSize.toString(),
              change: `+${stats.activeReferrals}`,
              positive: true,
              icon: Users,
              color: "emerald",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    stat.positive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Chart */}
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Earnings Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4" }}
                    name="Earnings"
                  />
                  <Line
                    type="monotone"
                    dataKey="investments"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981" }}
                    name="Investments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pool Distribution */}
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pool Distribution</h3>
            <div className="h-80 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={poolDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {poolDistribution.map((entry: PoolDistItem, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Link
              href="/dashboard/activity"
              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === "commission"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : activity.type === "investment"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-gray-700/50 text-gray-400"
                      }`}
                    >
                      {activity.type === "commission" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : activity.type === "investment" ? (
                        <Wallet className="w-5 h-5" />
                      ) : (
                        <BarChart3 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${activity.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {activity.amount > 0 ? "+" : ""}${activity.amount.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
