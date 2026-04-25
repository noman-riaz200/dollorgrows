"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Search, ChevronRight, ChevronDown, TrendingUp, Award, UserPlus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface TeamMember {
  id: string;
  username: string;
  wallet: string;
  invested: number;
  earnings: number;
  downlineCount: number;
  level: number;
  children?: TeamMember[];
}

interface TeamStats {
  totalDownline: number;
  activeDownline: number;
  levelCounts: Record<string, number>;
  conversionRate: number;
}

export default function TeamPage() {
  const [teamTree, setTeamTree] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats>({
    totalDownline: 0,
    activeDownline: 0,
    levelCounts: {},
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const [treeRes, statsRes] = await Promise.all([
          fetch("/api/team?depth=5"),
          fetch("/api/team/stats"),
        ]);

        const treeData = await treeRes.json();
        const statsData = await statsRes.json();

        setTeamTree(treeData.tree || []);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeamData();
  }, []);

  const toggleNode = useCallback((userId: string) => {
    setExpandedNodes((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(userId)) {
        newExpanded.delete(userId);
      } else {
        newExpanded.add(userId);
      }
      return newExpanded;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Team</h1>
          <p className="text-gray-400">
            Track your downline performance and referral earnings in real-time.
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
            value="Level 1"
            icon={UserPlus}
            accent="green"
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
            />
          </div>
        </div>

        {/* Team Tree */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">Team Hierarchy</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00d2ff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : teamTree.length > 0 ? (
            <div className="space-y-2">
              {teamTree
                .filter((member) =>
                  member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  member.wallet.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((member) => (
                  <TeamTreeNode
                    key={member.id}
                    member={member}
                    expandedNodes={expandedNodes}
                    onToggle={toggleNode}
                    level={0}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No team members yet. Start referring to build your downline!</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

interface TeamTreeNodeProps {
  member: TeamMember;
  expandedNodes: Set<string>;
  onToggle: (userId: string) => void;
  level: number;
}

function TeamTreeNode({ member, expandedNodes, onToggle, level }: TeamTreeNodeProps) {
  const hasChildren = member.children && member.children.length > 0;
  const expanded = expandedNodes.has(member.id);

  return (
    <div>
      <div
        className={`group flex items-center gap-4 p-4 rounded-lg transition-all ${
          level === 0
            ? "bg-gradient-to-r from-[#00d2ff]/10 to-[#00ff88]/10 border border-[#00d2ff]/20"
            : "bg-white/[0.02] hover:bg-white/[0.04] border border-transparent"
        }`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <button
          onClick={() => onToggle(member.id)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] transition-colors"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-[#00d2ff]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center">
          <span className="text-black font-bold text-sm">
            {member.username.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{member.username}</span>
            <span className="text-xs text-gray-500">{member.wallet}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Downline: {member.downlineCount} members
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500">Invested</p>
            <p className="font-semibold text-[#00d2ff]">${member.invested.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="font-semibold text-[#00ff88]">${member.earnings.toLocaleString()}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {member.children!.map((child) => (
            <TeamTreeNode
              key={child.id}
              member={child}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

