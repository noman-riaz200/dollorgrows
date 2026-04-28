"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Award, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface TeamStats {
  totalDownline: number;
  activeDownline: number;
  levelCounts: Record<string, number>;
  conversionRate: number;
}

export default function TeamsPage() {
  const [stats, setStats] = useState<TeamStats>({
    totalDownline: 0,
    activeDownline: 0,
    levelCounts: {},
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamStats();
  }, []);

  const loadTeamStats = async () => {
    try {
      const res = await fetch("/api/team/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Failed to load team stats:", e);
    } finally {
      setLoading(false);
    }
  };

  const levelData = [
    { level: 1, label: "Direct", color: "emerald" },
    { level: 2, label: "Level 2", color: "cyan" },
    { level: 3, label: "Level 3", color: "purple" },
    { level: 4, label: "Level 4", color: "amber" },
    { level: 5, label: "Level 5", color: "pink" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
        <p className="text-gray-400">Overview of your team structure and performance.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading team data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <GlassCard neonBorder="cyan" glow="cyan">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-sm text-gray-400">Total Downline</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalDownline}</p>
            </GlassCard>
            <GlassCard neonBorder="green" glow="green">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-sm text-gray-400">Active Members</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.activeDownline}</p>
            </GlassCard>
            <GlassCard neonBorder="purple">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-sm text-gray-400">Conversion</p>
              </div>
              <p className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
            </GlassCard>
            <GlassCard neonBorder="amber">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-sm text-gray-400">Levels Deep</p>
              </div>
              <p className="text-2xl font-bold text-white">5</p>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Level Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {levelData.map((l) => {
                const count = stats.levelCounts[`level_${l.level}`] || 0;
                return (
                  <div
                    key={l.level}
                    className={`p-4 rounded-xl border bg-${l.color}-500/5 border-${l.color}-500/20`}
                  >
                    <p className={`text-sm font-medium text-${l.color}-400 mb-1`}>{l.label}</p>
                    <p className="text-3xl font-bold text-white">{count}</p>
                    <p className="text-xs text-gray-500 mt-1">members</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
