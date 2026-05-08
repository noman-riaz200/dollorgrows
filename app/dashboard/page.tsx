"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  PiggyBank,
  Percent,
  Users,
  UserCheck,
  Clock,
  User,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Layers,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { StatCard } from "@/components/ui/StatCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { MatrixGrid } from "@/components/ui/MatrixGrid";
import "./dashboard.css";

const COLORS = ["#00d2ff", "#00ff88", "#8b5cf6", "#f59e0b", "#ef4444"] as const;

interface DashboardStats {
  totalInvested: number;
  totalEarnings: number;
  availableBalance: number;
  balanceWallet: number;
  poolWallet: number;
  poolCommission: number;
  teamSize: number;
  activeReferrals: number;
  pendingUsers: number;
  sponsorName: string;
  totalWithdrawal: number;
  totalExchange: number;
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
    balanceWallet: 0,
    poolWallet: 0,
    poolCommission: 0,
    teamSize: 0,
    activeReferrals: 0,
    pendingUsers: 0,
    sponsorName: "—",
    totalWithdrawal: 0,
    totalExchange: 0,
    dailyROI: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<ChartDatum[]>([]);
  const [poolDistribution, setPoolDistribution] = useState<PoolDistItem[]>([]);
  const [matrixSlots, setMatrixSlots] = useState<MatrixSlotData[]>([]);
  const [matrixStats, setMatrixStats] = useState({ filled: 0, total: 15, totalBonusEarned: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          const [dashRes, matrixRes] = await Promise.all([
            fetch("/api/dashboard/stats"),
            fetch("/api/matrix"),
          ]);
          const dashData = await dashRes.json();
          const matrixData = await matrixRes.json();

          setStats((prev) => ({ ...prev, ...dashData.stats }));
          setRecentActivity(dashData.recentActivity || []);
          setChartData(dashData.chartData || []);
          setPoolDistribution(dashData.poolDistribution || []);

          if (matrixData.slots) {
            setMatrixSlots(matrixData.slots);
            setMatrixStats(matrixData.stats);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const totalBalance =
    stats.balanceWallet + stats.poolWallet + stats.poolCommission;

  if (status === "loading" || isLoading) {
    return (
      <div className="dashboard-loading skeleton-container">
        <div className="skeleton-header" />
        <div className="skeleton-card-large" />
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
        <div className="skeleton-chart" />
        <div className="skeleton-chart" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>
          Welcome back,{" "}
          <span className="user-highlight">
            {session?.user?.name || "User"}
          </span>
          !
        </h1>
        <p>
          Here's an overview of your portfolio and earnings.
        </p>
      </div>

      {/* Total Balance Card */}
      <div className="total-balance-card">
        <div className="balance-content">
          <div className="balance-left">
            <div className="balance-icon">
              <DollarSign size={32} />
            </div>
            <div className="balance-text">
              <h3>Total Balance</h3>
              <h2>${totalBalance.toLocaleString()}</h2>
            </div>
          </div>
          <div className="balance-actions">
            <Link href="/dashboard/wallet">
              <button className="btn-primary">Top Up</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Cards: Balance Wallet, Pool Wallet, Pool Commission */}
      <div className="stats-grid">
        <StatCard
          title="Balance Wallet"
          value={`$${stats.balanceWallet.toLocaleString()}`}
          icon={Wallet}
          accent="blue"
          neonBorder="cyan"
        />
        <StatCard
          title="Pool Wallet"
          value={`$${stats.poolWallet.toLocaleString()}`}
          icon={PiggyBank}
          accent="mint"
          neonBorder="green"
        />
        <StatCard
          title="Pool Commission"
          value={`$${stats.poolCommission.toLocaleString()}`}
          icon={Percent}
          accent="blue"
          neonBorder="cyan"
        />
      </div>

      {/* Secondary Cards: 6 cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Referrals"
          value={stats.teamSize.toString()}
          icon={Users}
          accent="mint"
          neonBorder="green"
        />
        <StatCard
          title="Active Users"
          value={stats.activeReferrals.toString()}
          icon={UserCheck}
          accent="blue"
          neonBorder="cyan"
        />
        <StatCard
          title="Pending Users"
          value={stats.pendingUsers.toString()}
          icon={Clock}
          accent="mint"
          neonBorder="green"
        />
        <StatCard
          title="Sponsor Name"
          value={stats.sponsorName}
          icon={User}
          accent="blue"
          neonBorder="cyan"
        />
        <StatCard
          title="Withdrawal"
          value={`$${stats.totalWithdrawal.toLocaleString()}`}
          icon={ArrowDownLeft}
          accent="mint"
          neonBorder="green"
        />
        <StatCard
          title="Exchange"
          value={`$${stats.totalExchange.toLocaleString()}`}
          icon={ArrowLeftRight}
          accent="blue"
          neonBorder="cyan"
        />
      </div>

      {/* Matrix + Charts Row */}
      <div className="charts-section">
        {/* Matrix Grid */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <Layers size={20} className="chart-icon" />
              BFS Matrix
            </h3>
            <span className="matrix-stats">
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
          <div className="matrix-footer">
            <div className="matrix-bonus">
              <span className="matrix-label">Matrix Bonus Earned</span>
              <span className="matrix-value">
                ${matrixStats.totalBonusEarned.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="chart-card">
          <h3 className="chart-header">Earnings Overview</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} aspect={1.5}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
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
        </div>
      </div>

      {/* Pool Distribution + Activity */}
      <div className="charts-section">
        {/* Pool Distribution */}
        <div className="chart-card">
          <h3 className="chart-header">Pool Distribution</h3>
          <div className="pie-chart-container">
            {poolDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} aspect={1}>
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
                    {poolDistribution.map(
                      (entry: PoolDistItem, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
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
              <p className="no-data">No active investments</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-feed">
          <div className="activity-header">
            <h3>
              <BarChart3 size={20} className="chart-icon" />
              Recent Activity
            </h3>
            <Link href="/dashboard/wallet" className="view-all-link">
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item"
                >
                  <div
                    className={`activity-icon ${
                      activity.type === "commission" ||
                      activity.type === "referral_bonus"
                        ? "deposit"
                        : activity.type === "investment"
                        ? "investment"
                        : "transfer"
                    }`}
                  >
                    {activity.type === "commission" ||
                    activity.type === "referral_bonus" ? (
                      <TrendingUp size={18} />
                    ) : activity.type === "investment" ? (
                      <Wallet size={18} />
                    ) : (
                      <BarChart3 size={18} />
                    )}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.description}</div>
                    <div className="activity-description">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`activity-amount ${activity.amount > 0 ? "positive" : "negative"}`}>
                    {activity.amount > 0 ? "+" : ""}
                    ${activity.amount.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
