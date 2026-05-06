"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Award, Target, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface TeamStats {
  totalDownline: number;
  activeDownline: number;
  levelCounts: Record<string, number>;
  conversionRate: number;
}

interface DownlineUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar?: string;
  status: string;
  joinedDate: string;
  lastLogin: string;
  level: number;
  active: boolean;
  activeInvestmentsCount: number;
  walletBalance: number;
  poolWallet: number;
  poolCommission: number;
  conversionCommission: number;
}

export default function TeamsPage() {
  const [stats, setStats] = useState<TeamStats>({
    totalDownline: 0,
    activeDownline: 0,
    levelCounts: {},
    conversionRate: 0,
  });
  const [downline, setDownline] = useState<DownlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [downlineLoading, setDownlineLoading] = useState(true);

  useEffect(() => {
    loadTeamStats();
    loadDownline();
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

  const loadDownline = async () => {
    try {
      const res = await fetch("/api/team/downline");
      const data = await res.json();
      setDownline(data.downline || []);
    } catch (e) {
      console.error("Failed to load downline:", e);
    } finally {
      setDownlineLoading(false);
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

          <GlassCard>
            <h3 className="section-title">Downline Members</h3>
            <p className="section-subtitle">All users in your downline up to Level 5</p>
            {downlineLoading ? (
              <div className="loading-container text-center">
                <div className="loading-spinner" />
                <p className="loading-text">Loading downline members...</p>
              </div>
            ) : downline.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No downline members found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="downline-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Level</th>
                      <th>Active Status</th>
                      <th>Conversion Commission</th>
                      <th>Joined Date</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downline.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="user-avatar" />
                            ) : (
                              <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                            )}
                            <div className="user-info">
                              <p className="user-name">{user.name}</p>
                              <p className="user-email">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`level-badge level-${user.level}`}>
                            {user.level === 1 ? "Direct" : `Level ${user.level}`}
                          </span>
                        </td>
                        <td>
                          <div className="active-status">
                            {user.active ? (
                              <>
                                <CheckCircle className="icon-active" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="icon-inactive" />
                                <span>Inactive</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="commission-cell">
                            <DollarSign className="icon-commission" />
                            <span className="commission-amount">
                              ${user.conversionCommission.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td>
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </td>
                        <td>
                          {user.country}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}
