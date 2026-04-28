"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Award, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Commission {
  id: string;
  amount: number;
  level: number;
  percentage: number;
  status: string;
  description: string | null;
  createdAt: string;
  fromUser: { name: string; email: string } | null;
}

interface CommissionStats {
  totalEarned: number;
  level1Total: number;
  level2Total: number;
  level3Total: number;
  totalCount: number;
}

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<CommissionStats>({
    totalEarned: 0,
    level1Total: 0,
    level2Total: 0,
    level3Total: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      const res = await fetch("/api/admin/commissions");
      if (!res.ok) {
        // Fallback - commissions might not be accessible to non-admin, use transactions
        const txRes = await fetch("/api/wallet/deposit");
        const txData = await txRes.json();
        const txCommissions = (txData.transactions || []).filter(
          (t: any) => t.type === "commission" || t.type === "referral_bonus"
        );
        const mapped = txCommissions.map((t: any) => ({
          id: t.id,
          amount: Math.abs(t.amount),
          level: t.description?.includes("Level 1") ? 1 : t.description?.includes("Level 2") ? 2 : t.description?.includes("Level 3") ? 3 : 1,
          percentage: 0,
          status: t.status,
          description: t.description,
          createdAt: t.createdAt,
          fromUser: null,
        }));
        setCommissions(mapped);
        setStats({
          totalEarned: mapped.reduce((s: number, c: Commission) => s + c.amount, 0),
          level1Total: mapped.filter((c: Commission) => c.level === 1).reduce((s: number, c: Commission) => s + c.amount, 0),
          level2Total: mapped.filter((c: Commission) => c.level === 2).reduce((s: number, c: Commission) => s + c.amount, 0),
          level3Total: mapped.filter((c: Commission) => c.level === 3).reduce((s: number, c: Commission) => s + c.amount, 0),
          totalCount: mapped.length,
        });
        setLoading(false);
        return;
      }
      const data = await res.json();
      const userCommissions = (data.commissions || []).filter((c: any) => c.toUserId || true);

      const levelTotals = { 1: 0, 2: 0, 3: 0 };
      userCommissions.forEach((c: any) => {
        if (c.level >= 1 && c.level <= 3) levelTotals[c.level as keyof typeof levelTotals] += c.amount;
      });

      setCommissions(userCommissions);
      setStats({
        totalEarned: Number(data.stats?.totalAmount || 0),
        level1Total: levelTotals[1],
        level2Total: levelTotals[2],
        level3Total: levelTotals[3],
        totalCount: data.stats?.totalCount || 0,
      });
    } catch (e) {
      console.error("Failed to load commissions:", e);
    } finally {
      setLoading(false);
    }
  };

  const levelColors: Record<number, string> = {
    1: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    2: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    3: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Team Commission</h1>
        <p className="text-gray-400">View your referral commission earnings across all levels.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <GlassCard neonBorder="green" glow="green">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm text-gray-400">Total Earned</p>
          </div>
          <p className="text-2xl font-bold text-white">${stats.totalEarned.toLocaleString()}</p>
        </GlassCard>
        <GlassCard neonBorder="green">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm text-gray-400">Total Referrals</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalCount}</p>
        </GlassCard>
        <GlassCard neonBorder="cyan">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm text-gray-400">Level 1</p>
          </div>
          <p className="text-2xl font-bold text-white">${stats.level1Total.toLocaleString()}</p>
        </GlassCard>
        <GlassCard neonBorder="purple">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-gray-400">Level 2+3</p>
          </div>
          <p className="text-2xl font-bold text-white">${(stats.level2Total + stats.level3Total).toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Commission Table */}
      <GlassCard>
        <h3 className="text-lg font-bold text-white mb-4">Commission History</h3>
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading commissions...</p>
          </div>
        ) : commissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Level</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">From</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${levelColors[c.level] || levelColors[1]}`}>
                        Level {c.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-bold">+${c.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{c.fromUser?.name || "Referral"}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{c.description || "Commission"}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "completed" || c.status === "processed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <TrendingUp className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No commissions yet. Start referring to earn!</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
