import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/data-fetcher";
import { 
  Wallet, 
  PiggyBank, 
  Percent, 
  Users, 
  TrendingUp,
  DollarSign 
} from "lucide-react";

/**
 * Example server component that fetches live data from MySQL using Prisma
 * This demonstrates how to use the data-fetcher utility in a Next.js server component
 */
export default async function DashboardServerExample() {
  // Get the current session on the server
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Not Authenticated</h2>
        <p>Please sign in to view dashboard data.</p>
      </div>
    );
  }

  try {
    // Fetch live data from MySQL using Prisma
    const dashboardData = await fetchDashboardData(session.user.id);
    const { stats, recentActivity, poolDistribution } = dashboardData;

    const totalBalance = stats.balanceWallet + stats.poolWallet + stats.poolCommission;

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Dashboard Server Component Example
        </h1>
        <p className="text-gray-300 mb-8">
          This component fetches live data directly from MySQL using Prisma on the server.
        </p>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <DollarSign className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-gray-300 text-sm">Total Balance</h3>
                <h2 className="text-4xl font-bold text-white">
                  ${totalBalance.toLocaleString()}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">Live Data</p>
              <p className="text-green-400 text-sm">Updated in real-time</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Balance Wallet"
            value={`$${stats.balanceWallet.toLocaleString()}`}
            icon={Wallet}
            color="cyan"
            change="+2.5%"
          />
          <StatCard
            title="Pool Wallet"
            value={`$${stats.poolWallet.toLocaleString()}`}
            icon={PiggyBank}
            color="green"
            change="+5.1%"
          />
          <StatCard
            title="Pool Commission"
            value={`$${stats.poolCommission.toLocaleString()}`}
            icon={Percent}
            color="blue"
            change="+3.8%"
          />
          <StatCard
            title="Team Size"
            value={stats.teamSize.toString()}
            icon={Users}
            color="purple"
            change={`+${stats.activeReferrals} active`}
          />
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            icon={TrendingUp}
            color="amber"
            change="+12.3%"
          />
          <StatCard
            title="Total Invested"
            value={`$${stats.totalInvested.toLocaleString()}`}
            icon={DollarSign}
            color="emerald"
            change="+8.7%"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{activity.description}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${
                    activity.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {activity.amount > 0 ? '+' : ''}${activity.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>

        {/* Pool Distribution */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Pool Distribution</h3>
          {poolDistribution.length > 0 ? (
            <div className="space-y-4">
              {poolDistribution.map((pool, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-cyan-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-amber-500'
                    }`} />
                    <span className="text-white">{pool.name}</span>
                  </div>
                  <div className="text-white font-bold">
                    ${pool.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No active investments</p>
          )}
        </div>

        {/* Data Source Info */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
          <p className="text-sm text-blue-300">
            <strong>Data Source:</strong> Live MySQL database connected via Prisma ORM.
            This data is fetched server-side and updated in real-time.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h2>
        <p className="text-gray-300">
          Failed to fetch data from the database. Please check your connection.
        </p>
      </div>
    );
  }
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  color: string; 
  change: string; 
}) {
  const colorClasses = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className={`border rounded-2xl p-5 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm opacity-80">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm opacity-80">{title}</p>
    </div>
  );
}