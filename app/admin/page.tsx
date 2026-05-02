"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, RefreshCw, Check, X, ArrowDownLeft, ArrowUpRight, Users, Database } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState("pools");
  const [pools, setPools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [stats, setStats] = useState({ u: 0, i: 0, v: 0, p: 0 });

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const load = useCallback(async () => {
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch("/api/admin/pools"),
        fetch("/api/admin/users"),
        fetch("/api/admin/deposits"),
        fetch("/api/admin/withdrawals")
      ]);
      const [d1, d2, d3, d4] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json()]);
      setPools(d1.pools || []);
      setUsers(d2.users || []);
      setDeposits(d3.deposits || []);
      setWithdrawals(d4.withdrawals || []);
      setStats({
        u: d2.count || 0,
        i: d2.totalInvestments || 0,
        v: d2.totalVolume || 0,
        p: d1.count || 0
      });
    } catch (e) {
      console.error("Failed to load admin data:", e);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      load();
    }
  }, [session, load]);

  const block = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    await fetch(`/api/admin/users/${id}/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    setUsers(p => p.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const approveDeposit = async (id: string, action: string) => {
    await fetch("/api/admin/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: id, action })
    });
    setDeposits(p => p.map(d => d.id === id ? { ...d, status: action === "approve" ? "confirmed" : "rejected" } : d));
  };

  const approveWithdrawal = async (id: string, action: string) => {
    await fetch("/api/admin/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ withdrawalId: id, action })
    });
    setWithdrawals(p => p.map(w => w.id === id ? { ...w, status: action === "approve" ? "approved" : "rejected" } : w));
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const classes: Record<string, string> = {
      confirmed: "badge-success",
      approved: "badge-success",
      active: "badge-success",
      pending: "badge-warning",
      rejected: "badge-danger",
      blocked: "badge-danger",
      inactive: "badge-muted"
    };
    return <span className={`status-badge ${classes[status] || "badge-muted"}`}>{status}</span>;
  };

  if (status === "loading") {
    return (
      <div className="admin-loading">
        <RefreshCw className="spin-icon" size={32} />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  const tabs = [
    { key: "pools", label: "Pools", icon: <Database size={18} /> },
    { key: "deposits", label: "Deposits", icon: <ArrowDownLeft size={18} />, count: deposits.filter(d => d.status === "pending").length },
    { key: "withdrawals", label: "Withdrawals", icon: <ArrowUpRight size={18} />, count: withdrawals.filter(w => w.status === "pending").length },
    { key: "users", label: "Users", icon: <Users size={18} /> }
  ];

  return (
    <main className="admin-page">
      <div className="admin-container">
        
        {/* Header */}
        <header className="admin-header">
          <div className="header-title-group">
            <div className="admin-icon-wrap">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="admin-title">Admin Dashboard</h1>
              <p className="admin-subtitle">Manage pools, users, deposits, and withdrawals</p>
            </div>
          </div>
          <button onClick={load} className="refresh-btn">
            <RefreshCw size={16} /> Refresh Data
          </button>
        </header>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <p className="stat-value">{stats.u}</p>
            <p className="stat-label">Total Users</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{stats.p}</p>
            <p className="stat-label">Active Pools</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{stats.i}</p>
            <p className="stat-label">Total Investments</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">${stats.v.toLocaleString()}</p>
            <p className="stat-label">Total Volume</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`tab-btn ${tab === t.key ? "active" : ""}`}
            >
              {t.icon}
              {t.label}
              {(t.count || 0) > 0 && <span className="tab-badge">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="admin-content-card">
          
          {/* POOLS TAB */}
          {tab === "pools" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Min/Max</th>
                    <th>Daily</th>
                    <th>Duration</th>
                    <th>Invested</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pools.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="fw-bold text-white">{p.name}</div>
                        <div className="text-muted text-sm">{p.description}</div>
                      </td>
                      <td>${p.minimumInvestment} / {p.maximumInvestment || "∞"}</td>
                      <td className="text-success fw-bold">{p.dailyReturn}%</td>
                      <td>{p.durationDays}d</td>
                      <td>${Number(p.totalInvested).toLocaleString()}</td>
                      <td><StatusBadge status={p.isActive ? "active" : "inactive"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DEPOSITS TAB */}
          {tab === "deposits" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Network</th>
                    <th>TxID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map(d => (
                    <tr key={d.id}>
                      <td>
                        <div className="fw-bold text-white">{d.user?.name}</div>
                        <div className="text-muted text-sm">{d.user?.email}</div>
                      </td>
                      <td className="text-success fw-bold">${d.amount}</td>
                      <td className="text-uppercase">{d.network || "-"}</td>
                      <td><code className="hash-code">{d.txHash ? d.txHash.slice(0, 12) + "..." : "-"}</code></td>
                      <td className="text-muted text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={d.status} /></td>
                      <td>
                        {d.status === "pending" && (
                          <div className="action-buttons">
                            <button onClick={() => approveDeposit(d.id, "approve")} className="btn-icon btn-approve" title="Approve"><Check size={16} /></button>
                            <button onClick={() => approveDeposit(d.id, "reject")} className="btn-icon btn-reject" title="Reject"><X size={16} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* WITHDRAWALS TAB */}
          {tab === "withdrawals" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Wallet</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(w => (
                    <tr key={w.id}>
                      <td>
                        <div className="fw-bold text-white">{w.user?.name}</div>
                        <div className="text-muted text-sm">{w.user?.email}</div>
                      </td>
                      <td className="text-warning fw-bold">${w.amount}</td>
                      <td><code className="hash-code">{w.walletAddress ? w.walletAddress.slice(0, 10) + "..." : ""}</code></td>
                      <td className="text-muted text-sm">{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={w.status} /></td>
                      <td>
                        {w.status === "pending" && (
                          <div className="action-buttons">
                            <button onClick={() => approveWithdrawal(w.id, "approve")} className="btn-icon btn-approve" title="Approve"><Check size={16} /></button>
                            <button onClick={() => approveWithdrawal(w.id, "reject")} className="btn-icon btn-reject" title="Reject"><X size={16} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* USERS TAB */}
          {tab === "users" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Balance</th>
                    <th>Invested</th>
                    <th>Refs</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="fw-bold text-white">{u.name}</div>
                            <div className="text-muted text-sm">{u.referralCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted text-sm">{u.email}</td>
                      <td>${Number(u.wallet?.balanceWallet || 0).toLocaleString()}</td>
                      <td className="text-success fw-bold">${Number(u.wallet?.poolWallet || 0).toLocaleString()}</td>
                      <td>{u._count?.referrals || 0}</td>
                      <td className="text-muted text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td><StatusBadge status={u.status} /></td>
                      <td>
                        {u.role !== "admin" && (
                          <button
                            onClick={() => block(u.id, u.status)}
                            className={`block-btn ${u.status === "blocked" ? "unblock" : "block"}`}
                          >
                            {u.status === "blocked" ? "Unblock" : "Block"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-page {
          min-height: 100vh;
          background-color: var(--bg-primary, #0a0a0a);
          color: var(--text-primary, #ffffff);
          padding: 100px 1.5rem 3rem;
          font-family: var(--font-inter), sans-serif;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-primary);
          color: var(--text-secondary);
          gap: 1rem;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
          color: #00d2ff;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* Header */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-icon-wrap {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.2));
          color: #d946ef;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
        }

        .admin-subtitle {
          color: var(--text-secondary, #a1a1aa);
          font-size: 0.9rem;
          margin: 0;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary, #171717);
          color: var(--text-primary);
          border: 1px solid var(--border-medium, #262626);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          background: #262626;
        }

        /* Stats Grid */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--bg-secondary, #171717);
          border: 1px solid var(--border-medium, #262626);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }

        .stat-label {
          color: var(--text-secondary, #a1a1aa);
          font-size: 0.9rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Tabs */
        .admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-medium, #262626);
          padding-bottom: 1rem;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          color: var(--text-secondary, #a1a1aa);
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #fff;
          background: var(--bg-secondary, #171717);
        }

        .tab-btn.active {
          background: rgba(0, 210, 255, 0.1);
          color: #00d2ff;
          border: 1px solid rgba(0, 210, 255, 0.2);
        }

        .tab-badge {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.1rem 0.5rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Content Card & Table */
        .admin-content-card {
          background: var(--bg-secondary, #171717);
          border: 1px solid var(--border-medium, #262626);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          padding: 1rem 1.5rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary, #a1a1aa);
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border-medium, #262626);
        }

        .admin-table td {
          padding: 1rem 1.5rem;
          vertical-align: middle;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #d4d4d8;
        }

        .admin-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        /* Typography & Utilities */
        .fw-bold { font-weight: 600; }
        .text-white { color: #fff; }
        .text-muted { color: #a1a1aa; }
        .text-sm { font-size: 0.85rem; }
        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-uppercase { text-transform: uppercase; }

        .hash-code {
          background: #262626;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #a1a1aa;
        }

        /* Badges */
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .badge-muted { background: rgba(161, 161, 170, 0.15); color: #a1a1aa; }

        /* Actions */
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-approve {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }
        .btn-approve:hover { background: rgba(16, 185, 129, 0.2); }

        .btn-reject {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }
        .btn-reject:hover { background: rgba(239, 68, 68, 0.2); }

        /* User Avatar */
        .user-info-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00d2ff, #00ff88);
          color: #000;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .block-btn {
          border: none;
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .block-btn.block {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }
        .block-btn.block:hover { background: rgba(239, 68, 68, 0.2); }

        .block-btn.unblock {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }
        .block-btn.unblock:hover { background: rgba(16, 185, 129, 0.2); }
      `}} />
    </main>
  );
}