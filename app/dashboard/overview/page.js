"use client";

import { TrendingUp, TrendingDown, DollarSign, Users, Activity, CreditCard, ArrowUpRight, ArrowDownRight, Calendar, Clock } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import styles from "../dashboard.module.css";

export default function OverviewPage() {
  // Sample data for stats cards
  const stats = [
    {
      title: "Total Balance",
      value: "$12,458.75",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      iconClass: styles.primary
    },
    {
      title: "Active Users",
      value: "1,248",
      change: "+8.2%",
      isPositive: true,
      icon: Users,
      iconClass: styles.success
    },
    {
      title: "Monthly Revenue",
      value: "$8,452.30",
      change: "-3.1%",
      isPositive: false,
      icon: CreditCard,
      iconClass: styles.warning
    },
    {
      title: "System Uptime",
      value: "99.8%",
      change: "+0.2%",
      isPositive: true,
      icon: Activity,
      iconClass: styles.info
    }
  ];

  // Sample transactions data
  const transactions = [
    { id: 1, type: "deposit", description: "Wallet Deposit", amount: "$1,250.00", date: "2024-03-15", status: "Completed" },
    { id: 2, type: "withdrawal", description: "Bank Transfer", amount: "$500.00", date: "2024-03-14", status: "Pending" },
    { id: 3, type: "transfer", description: "Peer Transfer", amount: "$250.00", date: "2024-03-13", status: "Completed" },
    { id: 4, type: "deposit", description: "Crypto Deposit", amount: "$3,750.00", date: "2024-03-12", status: "Completed" },
    { id: 5, type: "withdrawal", description: "Withdrawal Request", amount: "$1,000.00", date: "2024-03-11", status: "Processing" }
  ];

  // Sample activities data
  const activities = [
    {
      id: 1,
      title: "New user registration",
      description: "John Doe joined the platform",
      time: "2 hours ago",
      icon: Users,
      iconClass: styles.success
    },
    {
      id: 2,
      title: "System maintenance",
      description: "Scheduled maintenance completed",
      time: "5 hours ago",
      icon: Activity,
      iconClass: styles.warning
    },
    {
      id: 3,
      title: "Feature update",
      description: "New dashboard features deployed",
      time: "1 day ago",
      icon: TrendingUp,
      iconClass: styles.info
    },
    {
      id: 4,
      title: "Security alert",
      description: "Unusual login detected",
      time: "2 days ago",
      icon: CreditCard,
      iconClass: styles.warning
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.dashboardOverview}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "var(--spacing-xl)", color: "var(--primary)" }}>
          Dashboard Overview
        </h1>
        
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div>
                    <div className={styles.statTitle}>{stat.title}</div>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={`${styles.statChange} ${stat.isPositive ? styles.positive : styles.negative}`}>
                      {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {stat.change}
                    </div>
                  </div>
                  <div className={`${styles.statIcon} ${stat.iconClass}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Recent Transactions */}
          <div className={styles.recentTransactions}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Transactions</h2>
              <a href="/dashboard/exchange" className={styles.viewAll}>
                View All
              </a>
            </div>
            
            <table className={styles.transactionsTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className={styles.transactionType}>
                        <span className={`${styles.typeBadge} ${styles[transaction.type]}`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td>{transaction.description}</td>
                    <td className={styles.transactionAmount}>{transaction.amount}</td>
                    <td className={styles.transactionDate}>{transaction.date}</td>
                    <td>
                      <span className={`${styles.typeBadge} ${transaction.status === 'Completed' ? styles.success : styles.warning}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activities */}
          <div className={styles.recentTransactions}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Activities</h2>
              <Clock size={18} />
            </div>
            
            <div className={styles.activitiesList}>
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${activity.iconClass}`}>
                      <Icon size={20} />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>{activity.title}</div>
                      <div className={styles.activityDescription}>{activity.description}</div>
                      <div className={styles.activityTime}>{activity.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className={styles.statsGrid} style={{ marginTop: "var(--spacing-xl)" }}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>Active Plans</div>
                <div className={styles.statValue}>3</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  <ArrowUpRight size={16} />
                  +1 this month
                </div>
              </div>
              <div className={`${styles.statIcon} ${styles.info}`}>
                <CreditCard size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>Referral Count</div>
                <div className={styles.statValue}>42</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  <ArrowUpRight size={16} />
                  +5 this week
                </div>
              </div>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <Users size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>Commission Earned</div>
                <div className={styles.statValue}>$1,245.50</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  <ArrowUpRight size={16} />
                  +$245.50
                </div>
              </div>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}