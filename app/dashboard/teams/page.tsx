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
    { level: 1, label: "Direct", color: "green" },
    { level: 2, label: "Level 2", color: "cyan" },
    { level: 3, label: "Level 3", color: "purple" },
    { level: 4, label: "Level 4", color: "amber" },
    { level: 5, label: "Level 5", color: "pink" },
  ];

  return (
    <div className="teams-page">
      <div className="page-header">
        <h1>Teams</h1>
        <p>Overview of your team structure and performance.</p>
      </div>

      {loading ? (
        <div className="loading-container text-center">
          <div className="loading-spinner" />
          <p className="loading-text">Loading team data...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid-4">
            <GlassCard neonBorder="blue" glow="blue">
              <div className="card-icon-wrapper">
                <div className="card-icon blue">
                  <Users />
                </div>
                <p className="card-label">Total Downline</p>
              </div>
              <p className="card-value">{stats.totalDownline}</p>
            </GlassCard>
            <GlassCard neonBorder="mint" glow="mint">
              <div className="card-icon-wrapper">
                <div className="card-icon mint">
                  <TrendingUp />
                </div>
                <p className="card-label">Active Members</p>
              </div>
              <p className="card-value">{stats.activeDownline}</p>
            </GlassCard>
            <GlassCard neonBorder="lavender">
              <div className="card-icon-wrapper">
                <div className="card-icon lavender">
                  <Award />
                </div>
                <p className="card-label">Conversion</p>
              </div>
              <p className="card-value">{stats.conversionRate.toFixed(1)}%</p>
            </GlassCard>
            <GlassCard neonBorder="none">
              <div className="card-icon-wrapper">
                <div className="card-icon amber">
                  <Target />
                </div>
                <p className="card-label">Levels Deep</p>
              </div>
              <p className="card-value">5</p>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="section-title">Level Breakdown</h3>
            <div className="level-breakdown-grid">
              {levelData.map((l) => {
                const count = stats.levelCounts[`level_${l.level}`] || 0;
                return (
                  <div
                    key={l.level}
                    className={`level-breakdown-item ${l.color}`}
                  >
                    <p className="level-label">{l.label}</p>
                    <p className="level-count">{count}</p>
                    <p className="level-subtitle">members</p>
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
