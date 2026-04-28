const fs = require('fs');

const content = `"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, RefreshCw, Check, X, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pools");
  const [pools, setPools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalInvestments: 0, totalVolume: 0, activePools: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    else if (status === "authenticated" && session?.user?.role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    try {
      const [poolsRes, usersRes, depositsRes, withdrawalsRes] = await Promise.all([
        fetch("/api/admin/pools"), fetch("/api/admin/users"),
        fetch("/api/admin/deposits"), fetch("/api/admin/withdrawals"),
      ]);
      const poolsData = await poolsRes.json();
      const usersData = await usersRes.json();
      const depositsData = await depositsRes.json();
      const withdrawalsData = await withdrawalsRes.json();
      setPools(poolsData.pools || []);
      setUsers(usersData.users || []);
      setDeposits(depositsData.deposits || []);
      setWithdrawals(withdrawalsData.withdrawals || []);
      setStats({ totalUsers: usersData.count || 0, totalInvestments: usersData.totalInvestments || 0, totalVolume: usersData.totalVolume || 0, activePools: poolsData.count || 0 });
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "admin") fetchData();
  }, [session, fetchData]);

  const handleBlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    await fetch(\`/api/admin/users/\${userId}/block\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
  };

  const handleDeposit = async (txId: string, action: string) => {
    await fetch("/api/admin/deposits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactionId: txId, action }) });
    setDeposits((prev) => prev.map((d) => (d.id === txId ? { ...d, status: action === "approve" ? "confirmed" : "rejected" } : d)));
  };

  const handleWithdrawal = async (id: string, action: string) => {
    await fetch("/api/admin/withdrawals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ withdrawalId: id, action }) });
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: action === "approve" ? "approved" : "rejected" } : w)));
  };

  const Badge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = { confirmed: "bg-emerald-500/20 text-emerald-400", approved: "bg-emerald-500/20 text-emerald-400", active: "bg-emerald-500/20 text-emerald-400", pending: "bg-amber-500/20 text-amber-400", rejected: "bg-red-500/20 text-red-400", blocked: "bg-red-500/20 text-red-400", inactive: "bg-gray-500/20 text-gray-400" };
    return <span className={\`px-2 py-1 rounded-full text-xs font-medium \${colors[status] || "bg-gray-500/20 text-gray-400"}\`}>{status}</span>;
  };

  const tabs = [
    { key: "pools", label: "Pools" },
    { key: "deposits", label: "Deposits", count: deposits.filter((d: any) => d.status === "pending").length },
    { key: "withdrawals", label: "Withdrawals", count: withdrawals.filter((w: any) => w.status === "pending").length },
    { key: "users", label: "Users" },
  ];

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-500">Loading...</div>;

  return (
    <div className="p-4 lg:p-8 bg-gray-950 min-h-screen">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Manage pools, users, deposits, withdrawals</p>
          </div>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ label: "Total Users", value: stats.totalUsers }, { label: "Active Pools", value: stats.activePools }, { label: "Investments", value: stats.totalInvestments }, { label: "Volume", value: \`$\${stats.totalVolume.toLocaleString()}\` }].map((s) => (
          <div key={s.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 lg:p-6">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={\`px-4 py-2 rounded-lg font-medium transition-all capitalize text-sm flex items-center gap-2 \${activeTab === t.key ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}\`}>
            {t.label}
            {(t.count || 0) > 0 && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {activeTab === "pools" && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-800"><h2 className="text-xl font-bold text-white">Investment Pools ({pools.length})</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-800">{["Name", "Min/Max", "Daily", "Duration", "Invested", "Status"].map((h) => <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {pools.map((pool: any) => (
                  <tr key={pool.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 lg:px-6 py-3"><p className="font-semibold text-white">{pool.name}</p><p className="text-xs text-gray-500">{pool.description}</p></td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300">${pool.minimumInvestment} / {pool.maximumInvestment || "\u221e"}</td>
                    <td className="px-4 lg:px-6 py-3 text-emerald-400 font-bold">{pool.dailyReturn}%</td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300">{pool.durationDays}d</td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300">${Number(pool.totalInvested).toLocaleString()}</td>
                    <td className="px-4 lg:px-6 py-3"><Badge status={pool.isActive ? "active" : "inactive"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "deposits" && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-800"><h2 className="text-xl font-bold text-white flex items-center gap-2"><ArrowDownLeft className="w-5 h-5 text-emerald-400" />Deposit Requests</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-800">{["User", "Amount", "Network", "TxID", "Date", "Status", "Actions"].map((h) => <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {deposits.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 lg:px-6 py-3"><p className="text-white font-medium">{d.user?.name}</p><p className="text-xs text-gray-500">{d.user?.email}</p></td>
                    <td className="px-4 lg:px-6 py-3 text-emerald-400 font-bold">${d.amount}</td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300 uppercase">{d.network || "-"}</td>
                    <td className="px-4 lg:px-6 py-3"><code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{d.txHash ? d.txHash.slice(0, 12) + "..." : "-"}</code></td>
                    <td className="px-4 lg:px-6 py-3 text-gray-500 text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 lg:px-6 py-3"><Badge status={d.status} /></td>
                    <td className="px-4 lg:px-6 py-3">
                      {d.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleDeposit(d.id, "approve")} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleDeposit(d.id, "reject")} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "withdrawals" && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-800"><h2 className="text-xl font-bold text-white flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-amber-400" />Withdrawal Requests</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-800">{["User", "Amount", "Wallet", "Date", "Status", "Actions"].map((h) => <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {withdrawals.map((w: any) => (
                  <tr key={w.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 lg:px-6 py-3"><p className="text-white font-medium">{w.user?.name}</p><p className="text-xs text-gray-500">{w.user?.email}</p></td>
                    <td className="px-4 lg:px-6 py-3 text-amber-400 font-bold">${w.amount}</td>
                    <td className="px-4 lg:px-6 py-3"><code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{w.walletAddress ? w.walletAddress.slice(0, 10) + "..." + w.walletAddress.slice(-6) : "-"}</code></td>
                    <td className="px-4 lg:px-6 py-3 text-gray-500 text-xs">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 lg:px-6 py-3"><Badge status={w.status} /></td>
                    <td className="px-4 lg:px-6 py-3">
                      {w.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleWithdrawal(w.id, "approve")} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleWithdrawal(w.id, "reject")} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-800"><h2 className="text-xl font-bold text-white">User Management ({users.length})</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-800">{["User", "Email", "Balance", "Invested", "Referrals", "Joined", "Status", "Actions"].map((h) => <th key={h} className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 lg:px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase() || "U"}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.referralCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300 text-xs">{user.email}</td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300">${Number(user.wallet?.balanceWallet || 0).toLocaleString()}</td>
                    <td className="px-4 lg:px-6 py-3 text-emerald-400">${Number(user.wallet?.poolWallet || 0).toLocaleString()}</td>
                    <td className="px-4 lg:px-6 py-3 text-gray-300">{user._count?.referrals || 0}</td>
                    <td className="px-4 lg:px-6 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 lg:px-6 py-3"><Badge status={user.status} /></td>
                    <td className="px-4 lg:px-6 py-3">
                      {user.role !== "admin" && (
                        <button onClick={() => handleBlock(user.id, user.status)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${user.status === "blocked" ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}>
                          {user.status === "blocked" ? "Unblock" : "Block"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}`;

fs.writeFileSync('app/admin/page.tsx', content, 'utf8');
console.log('Admin page written successfully');

