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
  CreditCard,
  LineChart as LineChartIcon,
  Activity,
} from "lucide-react";

// Import our vanilla CSS
import "./dashboard.css";

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

export default function DashboardVanillaTest() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalInvested: 2500,
    totalEarnings: 1250,
    availableBalance: 3750,
    balanceWallet: 1500,
    poolWallet: 1200,
    poolCommission: 1050,
    teamSize: 42,
    activeReferrals: 28,
    pendingUsers: 14,
    sponsorName: "John Smith",
    totalWithdrawal: 500,
    totalExchange: 750,
    dailyROI: 2.5,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    { id: "1", type: "commission", amount: 250, description: "Referral Commission", createdAt: "2024-01-15" },
    { id: "2", type: "investment", amount: 1000, description: "Plan Investment", createdAt: "2024-01-14" },
    { id: "3", type: "withdrawal", amount: -500, description: "Withdrawal Processed", createdAt: "2024-01-13" },
    { id: "4", type: "bonus", amount: 150, description: "Weekly Bonus", createdAt: "2024-01-12" },
    { id: "5", type: "exchange", amount: 300, description: "Currency Exchange", createdAt: "2024-01-11" },
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-16 h-16 border-4 border-[#00d2ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalBalance = stats.balanceWallet + stats.poolWallet + stats.poolCommission;

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Welcome back, <span style={{color: '#6366f1'}}>{session?.user?.name || "User"}</span>!</h1>
        <p>Here's an overview of your portfolio and earnings with our new vanilla CSS design.</p>
      </div>

      {/* Total Balance Card */}
      <div className="total-balance-card">
        <div className="balance-content">
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
            <div className="balance-icon">
              <DollarSign size={32} />
            </div>
            <div>
              <h3 className="balance-text">Total Balance</h3>
              <h2 className="balance-amount">${totalBalance.toLocaleString()}</h2>
            </div>
          </div>
          <div className="balance-actions">
            <Link href="/dashboard/wallet">
              <button className="btn-primary">Top Up Balance</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card cyan">
          <div className="stat-header">
            <h4 className="stat-title">Balance Wallet</h4>
            <div className="stat-icon cyan">
              <Wallet size={20} />
            </div>
          </div>
          <div className="stat-value">${stats.balanceWallet.toLocaleString()}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +12.5%
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <h4 className="stat-title">Pool Wallet</h4>
            <div className="stat-icon green">
              <PiggyBank size={20} />
            </div>
          </div>
          <div className="stat-value">${stats.poolWallet.toLocaleString()}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +8.3%
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <h4 className="stat-title">Pool Commission</h4>
            <div className="stat-icon purple">
              <Percent size={20} />
            </div>
          </div>
          <div className="stat-value">${stats.poolCommission.toLocaleString()}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +15.2%
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-header">
            <h4 className="stat-title">Total Referrals</h4>
            <div className="stat-icon orange">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.teamSize}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +5 this week
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3><LineChartIcon className="chart-icon" size={20} /> Earnings Overview</h3>
            <span style={{color: '#10b981', fontWeight: '600'}}>+24% this month</span>
          </div>
          <div className="chart-container">
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              padding: '1rem'
            }}>
              {[40, 60, 80, 100, 80, 90, 70].map((height, idx) => (
                <div key={idx} style={{
                  width: '30px',
                  height: `${height}%`,
                  background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '6px'
                }} />
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3><Activity className="chart-icon" size={20} /> Portfolio Distribution</h3>
            <span style={{color: '#8b5cf6', fontWeight: '600'}}>Balanced</span>
          </div>
          <div className="chart-container">
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'conic-gradient(#6366f1 0% 40%, #10b981 40% 70%, #8b5cf6 70% 100%)'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        <div className="activity-header">
          <h3><BarChart3 className="chart-icon" size={20} /> Recent Activity</h3>
          <Link href="/dashboard/exchange" style={{color: '#6366f1', textDecoration: 'none', fontWeight: '600'}}>
            View All
          </Link>
        </div>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.type === 'commission' || activity.type === 'bonus' ? 'deposit' : 
                activity.type === 'withdrawal' ? 'withdrawal' : 
                activity.type === 'investment' ? 'investment' : 'transfer'}`}>
                {activity.type === 'commission' || activity.type === 'bonus' ? <TrendingUp size={18} /> :
                 activity.type === 'investment' ? <CreditCard size={18} /> :
                 activity.type === 'withdrawal' ? <ArrowDownLeft size={18} /> :
                 <ArrowLeftRight size={18} />}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.description}</div>
                <div className="activity-description">
                  {new Date(activity.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className={`activity-amount ${activity.amount > 0 ? 'positive' : 'negative'}`}>
                {activity.amount > 0 ? '+' : ''}${activity.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link href="/dashboard/wallet" className="action-button">
          <div className="action-icon wallet">
            <Wallet size={24} />
          </div>
          <span>Wallet</span>
        </Link>
        
        <Link href="/dashboard/plans" className="action-button">
          <div className="action-icon invest">
            <CreditCard size={24} />
          </div>
          <span>Invest</span>
        </Link>
        
        <Link href="/dashboard/exchange" className="action-button">
          <div className="action-icon transfer">
            <ArrowLeftRight size={24} />
          </div>
          <span>Transfer</span>
        </Link>
        
        <Link href="/dashboard/team" className="action-button">
          <div className="action-icon history">
            <Users size={24} />
          </div>
          <span>Team</span>
        </Link>
      </div>

      {/* Info Section */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <h3 style={{fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem'}}>
          Vanilla CSS Dashboard
        </h3>
        <p style={{color: '#64748b', marginBottom: '1rem'}}>
          This dashboard uses pure vanilla CSS with no frameworks. The design features:
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginTop: '1rem'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Glassmorphism Effects</span>
          <span style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Responsive Design</span>
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Smooth Animations</span>
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>Modern Grid Layout</span>
        </div>
      </div>
    </div>
  );
}