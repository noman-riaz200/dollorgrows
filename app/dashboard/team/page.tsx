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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Team</h1>
        <p className="text-gray-400">
          Visualize your referral network and track your team growth.
        </p>
      </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <div className="mb-8 glass rounded-xl p-6 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00d2ff]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#00d2ff]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    Level {teamData.levelNumber}: {teamData.level}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {teamData.progress.current}/{teamData.progress.required}{" "}
                    direct referrals
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00ff88]" />
                <span className="text-sm text-[#00ff88] font-medium">
                  {teamData.progress.remaining > 0
                    ? `Need ${teamData.progress.remaining} more direct referral${
                        teamData.progress.remaining !== 1 ? "s" : ""
                      } to reach next level`
                    : "Max level reached!"}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00d2ff] to-[#00ff88] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* React Flow Graph */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center h-[600px] glass rounded-xl border border-white/[0.08]">
              <div className="w-12 h-12 border-4 border-[#00d2ff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : teamData?.root ? (
            <ReactFlowProvider>
              <TeamFlowGraph
                rootUser={teamData.root}
                children={teamData.tree}
              />
            </ReactFlowProvider>
          ) : (
            <div className="flex items-center justify-center h-[600px] glass rounded-xl border border-white/[0.08]">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">
                  No team members yet. Start referring to build your downline!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

