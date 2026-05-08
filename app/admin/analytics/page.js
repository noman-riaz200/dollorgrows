"use client";

import { BarChart3, Server, Database, Cpu, HardDrive, Network, Shield, Activity, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import styles from "../admin.module.css";

export default function SystemAnalyticsPage() {
  // System health data
  const systemHealth = [
    { id: 1, component: "Web Server", status: "online", uptime: "99.9%", responseTime: "45ms", icon: Server },
    { id: 2, component: "Database", status: "online", uptime: "99.8%", responseTime: "12ms", icon: Database },
    { id: 3, component: "CPU", status: "degraded", uptime: "95.2%", load: "78%", icon: Cpu },
    { id: 4, component: "Storage", status: "online", uptime: "99.9%", usage: "65%", icon: HardDrive },
    { id: 5, component: "Network", status: "online", uptime: "99.7%", bandwidth: "1.2 Gbps", icon: Network },
    { id: 6, component: "Security", status: "online", uptime: "100%", threats: "0", icon: Shield },
  ];

  // Performance metrics
  const performanceMetrics = [
    { id: 1, metric: "Page Load Time", value: "1.2s", target: "<2s", status: "good", change: "-0.3s" },
    { id: 2, metric: "API Response Time", value: "85ms", target: "<100ms", status: "good", change: "-12ms" },
    { id: 3, metric: "Database Queries", value: "1,245/s", target: "<2,000/s", status: "good", change: "+45/s" },
    { id: 4, metric: "Active Connections", value: "2,458", target: "<5,000", status: "good", change: "+128" },
    { id: 5, metric: "Error Rate", value: "0.12%", target: "<0.5%", status: "warning", change: "+0.02%" },
    { id: 6, metric: "Cache Hit Rate", value: "92%", target: ">90%", status: "good", change: "+2%" },
  ];

  // Recent alerts
  const recentAlerts = [
    { id: 1, type: "warning", message: "High CPU usage detected on server-02", time: "2 hours ago", component: "CPU" },
    { id: 2, type: "info", message: "Database backup completed successfully", time: "4 hours ago", component: "Database" },
    { id: 3, type: "error", message: "Failed login attempts from suspicious IP", time: "6 hours ago", component: "Security" },
    { id: 4, type: "info", message: "System update scheduled for maintenance", time: "1 day ago", component: "System" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "#10b981";
      case "degraded": return "#f59e0b";
      case "offline": return "#ef4444";
      default: return "#64748b";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning": return <AlertTriangle size={16} color="#f59e0b" />;
      case "error": return <XCircle size={16} color="#ef4444" />;
      case "info": return <CheckCircle size={16} color="#3b82f6" />;
      default: return <Activity size={16} color="#64748b" />;
    }
  };

  return (
    <DashboardLayout isAdmin={true}>
      <div className={styles.adminDashboard}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--spacing-xl)" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "var(--primary)" }}>
            System Analytics
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", color: "var(--text-light)", fontSize: "0.875rem" }}>
            <Activity size={16} />
            Last updated: Just now
          </div>
        </div>

        {/* System Overview Stats */}
        <div className={styles.adminStatsGrid}>
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>System Uptime</div>
                <div className={styles.adminStatValue}>99.8%</div>
                <div className={styles.adminStatSubtitle}>30-day average</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.green}`}>
                <Activity size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>Active Users</div>
                <div className={styles.adminStatValue}>2,458</div>
                <div className={styles.adminStatSubtitle}>+128 today</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.blue}`}>
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>API Requests</div>
                <div className={styles.adminStatValue}>45.2K</div>
                <div className={styles.adminStatSubtitle}>Per hour</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.purple}`}>
                <Server size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>Error Rate</div>
                <div className={styles.adminStatValue}>0.12%</div>
                <div className={styles.adminStatSubtitle}>Within threshold</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.orange}`}>
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className={styles.analyticsGrid}>
          {/* Performance Charts */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
                Performance Metrics
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-light)", marginTop: "var(--spacing-xs)" }}>
                Real-time system performance overview
              </p>
            </div>
            <div className={styles.chartPlaceholder}>
              <div style={{ textAlign: "center" }}>
                <BarChart3 size={48} color="var(--border)" style={{ marginBottom: "var(--spacing-md)" }} />
                <div>Performance Chart Visualization</div>
                <div style={{ fontSize: "0.75rem", marginTop: "var(--spacing-xs)" }}>CPU, Memory, Network, Disk I/O</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
                System Health
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-light)", marginTop: "var(--spacing-xs)" }}>
                Component status and uptime
              </p>
            </div>
            <div className={styles.systemHealthList}>
              {systemHealth.map((component) => {
                const Icon = component.icon;
                return (
                  <div key={component.id} className={styles.healthItem}>
                    <div className={styles.healthInfo}>
                      <div className={`${styles.healthIcon} ${styles[component.status]}`}>
                        <Icon size={20} />
                      </div>
                      <div className={styles.healthDetails}>
                        <div className={styles.healthTitle}>{component.component}</div>
                        <div className={styles.healthDescription}>
                          Uptime: {component.uptime} • {
                            component.responseTime ? `Response: ${component.responseTime}` :
                            component.load ? `Load: ${component.load}` :
                            component.usage ? `Usage: ${component.usage}` :
                            component.bandwidth ? `Bandwidth: ${component.bandwidth}` :
                            component.threats ? `Threats: ${component.threats}` : ''
                          }
                        </div>
                      </div>
                    </div>
                    <span className={`${styles.healthStatus} ${styles[component.status]}`}>
                      {component.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Metrics Table */}
        <div className={styles.dataGridContainer} style={{ marginTop: "var(--spacing-xl)" }}>
          <div className={styles.dataGridHeader}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
              Performance Metrics
            </h2>
            <div className={styles.dataGridActions}>
              <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
                Refresh Data
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
                Export Report
              </button>
            </div>
          </div>

          <table className={styles.dataGrid}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current Value</th>
                <th>Target</th>
                <th>Status</th>
                <th>Change</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {performanceMetrics.map((metric) => (
                <tr key={metric.id}>
                  <td style={{ fontWeight: "500" }}>{metric.metric}</td>
                  <td>
                    <span style={{ fontWeight: "600", color: "var(--primary)" }}>{metric.value}</span>
                  </td>
                  <td>{metric.target}</td>
                  <td>
                    <span style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "0.25rem",
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "9999px", 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      backgroundColor: metric.status === "good" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: metric.status === "good" ? "#10b981" : "#f59e0b"
                    }}>
                      {metric.status === "good" ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                      {metric.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: metric.change.startsWith("+") ? "#10b981" : metric.change.startsWith("-") ? "#ef4444" : "var(--text-light)",
                      fontWeight: "500"
                    }}>
                      {metric.change}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      {metric.change.startsWith("+") ? (
                        <>
                          <TrendingUp size={16} color="#10b981" />
                          <span style={{ color: "#10b981", fontSize: "0.75rem" }}>Up</span>
                        </>
                      ) : metric.change.startsWith("-") ? (
                        <>
                          <TrendingUp size={16} color="#ef4444" style={{ transform: "rotate(180deg)" }} />
                          <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>Down</span>
                        </>
                      ) : (
                        <>
                          <Activity size={16} color="#64748b" />
                          <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Stable</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Alerts */}
        <div className={styles.dataGridContainer} style={{ marginTop: "var(--spacing-xl)" }}>
          <div className={styles.dataGridHeader}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
              Recent Alerts & Notifications
            </h2>
            <div className={styles.dataGridActions}>
              <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
                View All Alerts
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
                Acknowledge All
              </button>
            </div>
          </div>

          <div style={{ padding: "var(--spacing-md)" }}>
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  gap: "var(--spacing-md)", 
                  padding: "var(--spacing-md)", 
                  marginBottom: "var(--spacing-sm)",
                  backgroundColor: "var(--background)", 
                  borderRadius: "var(--radius-md)", 
                  border: "1px solid var(--border)",
                  borderLeft: `4px solid ${
                    alert.type === "warning" ? "#f59e0b" :
                    alert.type === "error" ? "#ef4444" :
                    alert.type === "info" ? "#3b82f6" : "#64748b"
                  }`
                }}
              >
                <div style={{ marginTop: "2px" }}>
                  {getAlertIcon(alert.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "500", marginBottom: "var(--spacing-xs)", color: "var(--primary)" }}>
                    {alert.message}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", fontSize: "0.875rem", color: "var(--text-light)" }}>
                    <span>{alert.component}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
                <button 
                  className={`${styles.btn} ${styles.btnSm}`}
                  style={{ 
                    padding: "0.25rem 0.75rem", 
                    fontSize: "0.75rem",
                    backgroundColor: "transparent",
                    border: "1px solid var(--border)"
                  }}
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Charts */}
        <div className={styles.analyticsGrid} style={{ marginTop: "var(--spacing-xl)" }}>
          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
                User Activity
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-light)", marginTop: "var(--spacing-xs)" }}>
                Daily active users over time
              </p>
            </div>
            <div className={styles.chartPlaceholder}>
              <div style={{ textAlign: "center" }}>
                <TrendingUp size={48} color="var(--border)" style={{ marginBottom: "var(--spacing-md)" }} />
                <div>User Activity Chart</div>
                <div style={{ fontSize: "0.75rem", marginTop: "var(--spacing-xs)" }}>Shows daily active users trend</div>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
                Resource Usage
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-light)", marginTop: "var(--spacing-xs)" }}>
                CPU, Memory, Disk, Network
              </p>
            </div>
            <div className={styles.chartPlaceholder}>
              <div style={{ textAlign: "center" }}>
                <Cpu size={48} color="var(--border)" style={{ marginBottom: "var(--spacing-md)" }} />
                <div>Resource Usage Chart</div>
                <div style={{ fontSize: "0.75rem", marginTop: "var(--spacing-xs" }}>
                  Real-time resource monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}