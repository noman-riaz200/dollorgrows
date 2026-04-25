"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Shield,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface AdminUser {
  id: string;
  username?: string;
  email?: string;
  walletAddress?: string;
  totalInvested: number;
  totalEarnings: number;
  availableBalance: number;
  createdAt: string;
  _count: {
    investments: number;
    downliners: number;
  };
}

interface AdminPool {
  id: string;
  name: string;
  description?: string;
  minimumInvestment: number;
  maximumInvestment?: number;
  dailyReturn: number;
  durationDays: number;
  isActive: boolean;
  totalInvested: number;
  totalCapacity?: number;
  _count: {
    investments: number;
  };
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("pools");
  const [pools, setPools] = useState<AdminPool[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalVolume: 0,
    activePools: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [poolsRes, usersRes] = await Promise.all([
          fetch("/api/admin/pools"),
          fetch("/api/admin/users"),
        ]);

        const poolsData = await poolsRes.json();
        const usersData = await usersRes.json();

        setPools(poolsData.pools || []);
        setUsers(usersData.users || []);
        setStats({
          totalUsers: usersData.count || 0,
          totalInvestments: usersData.totalInvestments || 0,
          totalVolume: usersData.totalVolume || 0,
          activePools: poolsData.count || 0,
        });
      } catch (error) {
        console.error("Admin fetch error:", error);
      }
    };
    loadData();
  }, []);

  // Simple auth check - in production use proper role-based auth
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-gray-500">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400">Manage pools, users, and system settings</p>
          </div>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "cyan" },
          { label: "Active Pools", value: stats.activePools, icon: BarChart3, color: "emerald" },
          { label: "Total Investments", value: stats.totalInvestments, color: "purple" },
          { label: "Total Volume", value: `$${stats.totalVolume.toLocaleString()}`, color: "amber" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                {stat.icon && <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
        {["pools", "users", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pools Management */}
      {activeTab === "pools" && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Investment Pools</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Pool
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Min/Max</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Daily Return</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Invested</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pools.map((pool) => (
                  <tr key={pool.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{pool.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{pool.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        ${pool.minimumInvestment.toLocaleString()} -{" "}
                        {pool.maximumInvestment ? `$${pool.maximumInvestment.toLocaleString()}` : "∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-bold">{pool.dailyReturn}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">${Number(pool.totalInvested).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pool.isActive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {pool.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === "users" && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Wallet</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Invested</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Earnings</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {user.walletAddress?.slice(0, 10)}...
                      </code>
                    </td>
                    <td className="px-6 py-4 text-gray-300">${Number(user.totalInvested).toLocaleString()}</td>
                    <td className="px-6 py-4 text-emerald-400">${Number(user.totalEarnings).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>
          <div className="space-y-6">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Level 1 Commission Rate
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  defaultValue="10"
                  className="w-32 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                />
                <span className="text-gray-400">% (5-20%)</span>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform Fee
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  defaultValue="2"
                  className="w-32 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                />
                <span className="text-gray-400">%</span>
              </div>
            </div>
            <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
