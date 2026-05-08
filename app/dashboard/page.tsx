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
import styles from "./dashboard.module.css";

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
    <div className={styles.dashboardOverview}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>
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
      <div className={styles.balanceSummary}>
        <div className={styles.balanceHeader}>
          <h2 className={styles.balanceTitle}>Balance Summary</h2>
          <span className="balance-updated">Updated just now</span>
        </div>
        <div className={styles.balanceAmount}>${totalBalance.toLocaleString()}</div>
        <div className={styles.balanceBreakdown}>
          <div className={styles.balanceItem}>
            <span className={styles.balanceLabel}>Total Invested</span>
            <span className={styles.balanceValue}>${stats.totalInvested.toLocaleString()}</span>
          </div>
          <div className={styles.balanceItem}>
            <span className={styles.balanceLabel}>Total Earnings</span>
            <span className={styles.balanceValue}>${stats.totalEarnings.toLocaleString()}</span>
          </div>
          <div className={styles.balanceItem}>
            <span className={styles.balanceLabel}>Daily ROI</span>
            <span className={styles.balanceValue}>{stats.dailyROI.toFixed(2)}%</span>
          </div>
        </div>
        <div className={styles.balanceActions}>
          <Link href="/dashboard/wallet">
            <button className={styles.btnPrimary}>Top Up</button>
          </Link>
        </div>
      </div>

      {/* Main Cards: Balance Wallet, Pool Wallet, Pool Commission */}
      <div className={styles.statsGrid}>
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
      <div className={styles.statsGrid}>
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
      <div className={styles.chartsSection}>
        {/* Matrix Grid */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>
              <Layers size={20} className={styles.chartIcon} />
              BFS Matrix
            </h3>
            <span className={styles.matrixStats}>
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
          <div className={styles.matrixFooter}>
            <div className={styles.matrixBonus}>
              <span className={styles.matrixLabel}>Matrix Bonus Earned</span>
              <span className={styles.matrixValue}>
                ${matrixStats.totalBonusEarned.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartHeader}>Earnings Overview</h3>
          <div className={styles.chartContainer}>
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
      <div className={styles.chartsSection}>
        {/* Pool Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartHeader}>Pool Distribution</h3>
          <div className={styles.pieChartContainer}>
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
              <p className={styles.noData}>No active investments</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activityFeed}>
          <div className={styles.activityHeader}>
            <h3>
              <BarChart3 size={20} className={styles.chartIcon} />
              Recent Activity
            </h3>
            <Link href="/dashboard/wallet" className={styles.viewAllLink}>
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className={styles.activityList}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={styles.activityItem}
                >
                  <div
                    className={`${styles.activityIcon} ${
                      activity.type === "commission" ||
                      activity.type === "referral_bonus"
                        ? styles.deposit
                        : activity.type === "investment"
                        ? styles.investment
                        : styles.transfer
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
                  <div className={styles.activityContent}>
                    <div className={styles.activityTitle}>{activity.description}</div>
                    <div className={styles.activityDescription}>
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`${styles.activityAmount} ${activity.amount > 0 ? styles.positive : styles.negative}`}>
                    {activity.amount > 0 ? "+" : ""}
                    ${activity.amount.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noActivity}>No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
