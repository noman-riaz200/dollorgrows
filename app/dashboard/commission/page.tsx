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
    1: "badge mint",
    2: "badge blue",
    3: "badge lavender",
  };

  return (
    <div className="commission-page">
      <div className="page-header">
        <h1>Team Commission</h1>
        <p>View your referral commission earnings across all levels.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid-4">
        <GlassCard neonBorder="mint" glow="mint">
          <div className="card-icon-wrapper">
            <div className="card-icon mint">
              <TrendingUp />
            </div>
            <p className="card-label">Total Earned</p>
          </div>
          <p className="card-value">${stats.totalEarned.toLocaleString()}</p>
        </GlassCard>
        <GlassCard neonBorder="mint">
          <div className="card-icon-wrapper">
            <div className="card-icon mint">
              <Users />
            </div>
            <p className="card-label">Total Referrals</p>
          </div>
          <p className="card-value">{stats.totalCount}</p>
        </GlassCard>
        <GlassCard neonBorder="blue">
          <div className="card-icon-wrapper">
            <div className="card-icon blue">
              <Award />
            </div>
            <p className="card-label">Level 1</p>
          </div>
          <p className="card-value">${stats.level1Total.toLocaleString()}</p>
        </GlassCard>
        <GlassCard neonBorder="lavender">
          <div className="card-icon-wrapper">
            <div className="card-icon lavender">
              <ArrowUpRight />
            </div>
            <p className="card-label">Level 2+3</p>
          </div>
          <p className="card-value">${(stats.level2Total + stats.level3Total).toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Commission Table */}
      <GlassCard>
        <h3 className="section-title">Commission History</h3>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading commissions...</p>
          </div>
        ) : commissions.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Amount</th>
                  <th>From</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className={`badge ${levelColors[c.level] || levelColors[1]}`}>
                        Level {c.level}
                      </span>
                    </td>
                    <td>
                      <span className="amount-positive">+${c.amount.toLocaleString()}</span>
                    </td>
                    <td>{c.fromUser?.name || "Referral"}</td>
                    <td className="description">{c.description || "Commission"}</td>
                    <td className="date">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${c.status === "completed" || c.status === "processed" ? "status-success" : "status-pending"}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <TrendingUp className="empty-icon" />
            <p className="empty-text">No commissions yet. Start referring to earn!</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
