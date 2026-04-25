"use client";

import { useEffect, useState } from "react";
import { Users, Search, ChevronRight, ChevronDown } from "lucide-react";

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

export default function TeamPage() {
  const [teamTree, setTeamTree] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState({
    totalDownline: 0,
    activeDownline: 0,
    levelCounts: {} as Record<string, number>,
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

  const toggleNode = (userId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedNodes(newExpanded);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Team</h1>
        <p className="text-gray-400">
          Track your downline performance and referral earnings in real-time.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Downline",
            value: stats.totalDownline.toString(),
            icon: Users,
            color: "cyan",
          },
          {
            label: "Active Members",
            value: stats.activeDownline.toString(),
            icon: TrendingUp,
            color: "emerald",
          },
          {
            label: "Conversion Rate",
            value: `${stats.conversionRate.toFixed(1)}%`,
            icon: Award,
            color: "amber",
          },
          {
            label: "Your Level",
            value: "Level 1",
            icon: UserPlus,
            color: "purple",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by username or wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Team Tree Visualization */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Team Hierarchy</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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
                  expanded={expandedNodes.has(member.id)}
                  onToggle={() => toggleNode(member.id)}
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
      </div>
    </div>
  );
}

interface TeamTreeNodeProps {
  member: TeamMember;
  expanded: boolean;
  onToggle: () => void;
  level: number;
}

function TeamTreeNode({ member, expanded, onToggle, level }: TeamTreeNodeProps) {
  const hasChildren = member.children && member.children.length > 0;

  return (
    <div>
      <div
        className={`group flex items-center gap-4 p-4 rounded-lg transition-all ${
          level === 0
            ? "bg-gradient-to-r from-cyan-900/30 to-emerald-900/30 border border-cyan-800/50"
            : "bg-gray-800/30 hover:bg-gray-800/60 border border-transparent"
        }`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={onToggle}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {member.username.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{member.username}</span>
            <span className="text-xs text-gray-500">{member.wallet}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Downline: {member.downlineCount} members
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500">Invested</p>
            <p className="font-semibold text-cyan-400">${member.invested.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="font-semibold text-emerald-400">${member.earnings.toLocaleString()}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {member.children!.map((child) => (
            <TeamTreeNode
              key={child.id}
              member={child}
              expanded={expandedNodes.has(child.id)}
              onToggle={() => toggleNode(child.id)}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
