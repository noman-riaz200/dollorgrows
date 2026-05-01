"use client";

import { useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Users,
  TrendingUp,
  Award,
  UserPlus,
  Target,
  Zap,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import TeamFlowGraph from "@/components/team/TeamFlowGraph";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  downlineCount: number;
  children?: TeamMember[] | null;
}

interface TeamStats {
  totalDownline: number;
  activeDownline: number;
  levelCounts: Record<string, number>;
  conversionRate: number;
}

interface TeamData {
  root: TeamMember;
  tree: TeamMember[] | null;
  total: number;
  directReferrals: number;
  level: string;
  levelNumber: number;
  nextLevelRequirement: number;
  progress: {
    current: number;
    required: number;
    remaining: number;
  };
}

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [stats, setStats] = useState<TeamStats>({
    totalDownline: 0,
    activeDownline: 0,
    levelCounts: {},
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const [treeRes, statsRes] = await Promise.all([
          fetch("/api/team?depth=3"),
          fetch("/api/team/stats"),
        ]);

        const treeData = await treeRes.json();
        const statsData = await statsRes.json();

        setTeamData(treeData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeamData();
  }, []);

  const progressPercent = teamData
    ? Math.min(
        100,
        (teamData.progress.current / teamData.progress.required) * 100
      )
    : 0;

  return (
    <div className="team-page">
      {/* Header */}
      <div className="page-header">
        <h1>My Team</h1>
        <p>
          Visualize your referral network and track your team growth.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid-4">
        <StatCard
          title="Total Downline"
          value={stats.totalDownline.toString()}
          icon={Users}
          accent="cyan"
        />
        <StatCard
          title="Active Members"
          value={stats.activeDownline.toString()}
          icon={TrendingUp}
          accent="green"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          icon={Award}
          accent="cyan"
        />
        <StatCard
          title="Your Level"
          value={teamData?.level || "Bronze"}
          icon={UserPlus}
          accent="green"
        />
      </div>

      {/* Progress Bar Section */}
      {teamData && (
        <div className="glass-card cyan-glow mb-8">
          <div className="progress-header">
            <div className="progress-title">
              <div className="progress-icon">
                <Target />
              </div>
              <div>
                <h3>Level {teamData.levelNumber}: {teamData.level}</h3>
                <p className="progress-subtitle">
                  {teamData.progress.current}/{teamData.progress.required}{" "}
                  direct referrals
                </p>
              </div>
            </div>
            <div className="progress-status">
              <Zap className="status-icon" />
              <span className="status-text">
                {teamData.progress.remaining > 0
                  ? `Need ${teamData.progress.remaining} more direct referral${
                      teamData.progress.remaining !== 1 ? "s" : ""
                    } to reach next level`
                  : "Max level reached!"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* React Flow Graph */}
      <div className="team-graph-section">
        {loading ? (
          <div className="glass-card loading-container">
            <div className="loading-spinner" />
          </div>
        ) : teamData?.root ? (
          <ReactFlowProvider>
            <TeamFlowGraph
              rootUser={teamData.root}
              children={teamData.tree}
            />
          </ReactFlowProvider>
        ) : (
          <div className="glass-card empty-state">
            <div className="empty-icon">
              <Users />
            </div>
            <p className="empty-text">
              No team members yet. Start referring to build your downline!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

