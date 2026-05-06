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
  User,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  Hash,
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

interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar: string | null;
  referralCode: string;
  joinedDate: string;
  lastLogin: string;
  status: string;
  walletBalance: number;
  poolWallet: number;
  poolCommission: number;
  totalInvestments: number;
  activeInvestments: number;
  totalReferrals: number;
  investments: Array<{
    id: string;
    amount: number;
    poolName: string;
    dailyReturn: number;
    startDate: string;
    endDate: string;
  }>;
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
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const [treeRes, statsRes, referralsRes] = await Promise.all([
          fetch("/api/team?depth=3"),
          fetch("/api/team/stats"),
          fetch("/api/team/referrals"),
        ]);

        const treeData = await treeRes.json();
        const statsData = await statsRes.json();
        const referralsData = await referralsRes.json();

        setTeamData(treeData);
        setStats(statsData);
        setReferrals(referralsData.referrals || []);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
        setReferralsLoading(false);
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

      {/* Referrals List Section */}
      <div className="glass-card cyan-glow mb-8">
        <div className="referral-details-header">
          <div className="referral-details-icon">
            <User />
          </div>
          <h2 className="referral-details-title">My Referrals</h2>
          <span className="referral-count-badge">{referrals.length} direct referrals</span>
        </div>

        {referralsLoading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : referrals.length > 0 ? (
          <div className="table-container">
            <table className="referral-details-table">
              <thead>
                <tr>
                  <th>
                    <div>
                      <User />
                      Name
                    </div>
                  </th>
                  <th>
                    <div>
                      <Mail />
                      Email
                    </div>
                  </th>
                  <th>
                    <div>
                      <Phone />
                      Phone
                    </div>
                  </th>
                  <th>
                    <div>
                      <Globe />
                      Country
                    </div>
                  </th>
                  <th>
                    <div>
                      <Calendar />
                      Joined
                    </div>
                  </th>
                  <th>
                    <div>
                      <DollarSign />
                      Investments
                    </div>
                  </th>
                  <th>
                    <div>
                      <Hash />
                      Referrals
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id}>
                    <td>
                      <div className="user-info-container">
                        <div className="user-avatar">
                          <span className="user-avatar-initial">
                            {ref.name[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="user-name">{ref.name}</span>
                      </div>
                    </td>
                    <td className="user-email">{ref.email}</td>
                    <td className="user-phone">{ref.phone}</td>
                    <td className="user-country">{ref.country}</td>
                    <td className="user-joined">
                      {new Date(ref.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="user-investments">
                      <span className="investment-badge">
                        {ref.activeInvestments} active
                      </span>
                    </td>
                    <td className="user-referrals">
                      <span className="referral-count">
                        {ref.totalReferrals}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Users />
            </div>
            <p className="empty-text">
              No referrals yet. Share your referral link to start building your team!
            </p>
          </div>
        )}
      </div>

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

