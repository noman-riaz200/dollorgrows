"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, RefreshCw, Check, X, ArrowDownLeft, ArrowUpRight, Users, Database, DollarSign, TrendingUp, BarChart3, Wallet, LogOut, Settings as SettingsIcon } from "lucide-react";
import "./AdminDashboard.css";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState("pools");
  const [pools, setPools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [stats, setStats] = useState({ u: 0, i: 0, v: 0, p: 0 });
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsLoading, setSettingsLoading] = useState(false);

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
      const [r1, r2, r3, r4, r5] = await Promise.all([
        fetch("/api/admin/pools"),
        fetch("/api/admin/users"),
        fetch("/api/admin/deposits"),
        fetch("/api/admin/withdrawals"),
        fetch("/api/admin/settings")
      ]);
      const [d1, d2, d3, d4, d5] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json(), r5.json()]);
      setPools(d1.pools || []);
      setUsers(d2.users || []);
      setDeposits(d3.deposits || []);
      setWithdrawals(d4.withdrawals || []);
      setSettings(d5.settings || {});
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

  const updateSetting = async (key: string, value: string) => {
    setSettingsLoading(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Failed to update setting:", error);
    } finally {
      setSettingsLoading(false);
    }
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
    { key: "users", label: "Users", icon: <Users size={18} /> },
    { key: "settings", label: "Settings", icon: <SettingsIcon size={18} /> }
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
          <div className="header-actions">
            <button onClick={load} className="refresh-btn">
              <RefreshCw size={16} /> Refresh Data
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="logout-btn"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Users size={24} />
            </div>
            <p className="stat-value">{stats.u}</p>
            <p className="stat-label">Total Users</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Database size={24} />
            </div>
            <p className="stat-value">{stats.p}</p>
            <p className="stat-label">Active Pools</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <TrendingUp size={24} />
            </div>
            <p className="stat-value">{stats.i}</p>
            <p className="stat-label">Total Investments</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <BarChart3 size={24} />
            </div>
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

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <div className="settings-tab">
              <h3 className="settings-title">Platform Settings</h3>
              <p className="settings-subtitle">Configure deposit addresses and other platform settings</p>
              
              <div className="settings-grid">
                <div className="setting-card">
                  <h4>USDT Deposit Addresses</h4>
                  <p className="setting-description">Addresses where users will send USDT deposits</p>
                  
                  <div className="setting-field">
                    <label>TRC20 Address</label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={settings.usdt_trc20_address || ""}
                        onChange={(e) => setSettings(prev => ({ ...prev, usdt_trc20_address: e.target.value }))}
                        placeholder="T... (TRC20 wallet address)"
                      />
                      <button
                        onClick={() => updateSetting("usdt_trc20_address", settings.usdt_trc20_address || "")}
                        disabled={settingsLoading}
                        className="save-btn"
                      >
                        {settingsLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="setting-field">
                    <label>ERC20 Address</label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={settings.usdt_erc20_address || ""}
                        onChange={(e) => setSettings(prev => ({ ...prev, usdt_erc20_address: e.target.value }))}
                        placeholder="0x... (ERC20 wallet address)"
                      />
                      <button
                        onClick={() => updateSetting("usdt_erc20_address", settings.usdt_erc20_address || "")}
                        disabled={settingsLoading}
                        className="save-btn"
                      >
                        {settingsLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="setting-card">
                  <h4>Other Settings</h4>
                  <p className="setting-description">Platform fee, minimum withdrawal, etc.</p>
                  
                  <div className="setting-field">
                    <label>Platform Fee (%)</label>
                    <div className="input-group">
                      <input
                        type="number"
                        value={settings.platform_fee_percent || "2"}
                        onChange={(e) => setSettings(prev => ({ ...prev, platform_fee_percent: e.target.value }))}
                        placeholder="2"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <button
                        onClick={() => updateSetting("platform_fee_percent", settings.platform_fee_percent || "2")}
                        disabled={settingsLoading}
                        className="save-btn"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="setting-field">
                    <label>Minimum Withdrawal ($)</label>
                    <div className="input-group">
                      <input
                        type="number"
                        value={settings.min_withdrawal || "10"}
                        onChange={(e) => setSettings(prev => ({ ...prev, min_withdrawal: e.target.value }))}
                        placeholder="10"
                        step="1"
                        min="1"
                      />
                      <button
                        onClick={() => updateSetting("min_withdrawal", settings.min_withdrawal || "10")}
                        disabled={settingsLoading}
                        className="save-btn"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="setting-field">
                    <label>Maintenance Mode</label>
                    <div className="input-group">
                      <select
                        value={settings.maintenance_mode || "false"}
                        onChange={(e) => setSettings(prev => ({ ...prev, maintenance_mode: e.target.value }))}
                      >
                        <option value="false">Disabled</option>
                        <option value="true">Enabled</option>
                      </select>
                      <button
                        onClick={() => updateSetting("maintenance_mode", settings.maintenance_mode || "false")}
                        disabled={settingsLoading}
                        className="save-btn"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="settings-note">
                <p><strong>Note:</strong> Changes are saved individually. Click "Save" after editing each field.</p>
              </div>
            </div>
          )}

       </div>
     </div>

   </main>
 );
}