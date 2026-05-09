import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Users, 
    DollarSign, 
    TrendingUp, 
    Database,
    Shield,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Activity
} from 'lucide-react';

export default function AdminIndex() {
    const stats = [
        { label: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: 'blue' },
        { label: 'Total Volume', value: '$245,850', change: '+8.5%', icon: DollarSign, color: 'green' },
        { label: 'Active Investments', value: '892', change: '+5.2%', icon: TrendingUp, color: 'purple' },
        { label: 'Total Pools', value: '12', change: '+2', icon: Database, color: 'orange' },
    ];

    const recentActivities = [
        { id: 1, user: 'John Smith', action: 'New Investment', amount: '$500', time: '10 min ago', status: 'success' },
        { id: 2, user: 'Sarah Johnson', action: 'Withdrawal Request', amount: '$250', time: '25 min ago', status: 'pending' },
        { id: 3, user: 'Mike Wilson', action: 'Account Verified', amount: '-', time: '1 hour ago', status: 'success' },
        { id: 4, user: 'Emma Davis', action: 'Commission Paid', amount: '$45.50', time: '2 hours ago', status: 'success' },
        { id: 5, user: 'Robert Brown', action: 'New Registration', amount: '-', time: '3 hours ago', status: 'success' },
    ];

    const topUsers = [
        { id: 1, name: 'John Smith', email: 'john@example.com', investments: '$12,500', referrals: 24, status: 'active' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', investments: '$9,800', referrals: 18, status: 'active' },
        { id: 3, name: 'Mike Wilson', email: 'mike@example.com', investments: '$8,200', referrals: 12, status: 'active' },
        { id: 4, name: 'Emma Davis', email: 'emma@example.com', investments: '$6,500', referrals: 8, status: 'pending' },
        { id: 5, name: 'Robert Brown', email: 'robert@example.com', investments: '$5,100', referrals: 6, status: 'active' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${
                                    stat.color === 'blue' ? 'bg-blue-100' :
                                    stat.color === 'green' ? 'bg-green-100' :
                                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                                }`}>
                                    <stat.icon className={`h-6 w-6 ${
                                        stat.color === 'blue' ? 'text-blue-600' :
                                        stat.color === 'green' ? 'text-green-600' :
                                        stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                                    }`} />
                                </div>
                                <div className={`flex items-center text-sm font-medium ${
                                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change.startsWith('+') ? (
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 mr-1" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg ${
                                            activity.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                                        }`}>
                                            {activity.status === 'success' ? (
                                                <Shield className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <Activity className="h-5 w-5 text-yellow-600" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">{activity.user}</div>
                                            <div className="text-sm text-gray-500">{activity.action}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900">{activity.amount}</div>
                                        <div className="text-sm text-gray-500">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Users */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Top Users</h2>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investments</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {topUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-gray-900">{user.investments}</td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-900">{user.referrals}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors">
                            <BarChart3 className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="font-medium text-blue-700">Generate Report</span>
                        </button>
                        <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors">
                            <Users className="h-5 w-5 text-green-600 mr-3" />
                            <span className="font-medium text-green-700">Add New User</span>
                        </button>
                        <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors">
                            <Database className="h-5 w-5 text-purple-600 mr-3" />
                            <span className="font-medium text-purple-700">Create New Pool</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}