import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { 
    DollarSign, 
    TrendingUp, 
    Users, 
    CreditCard,
    BarChart3,
    Wallet,
    Clock,
    Shield
} from 'lucide-react';

export default function Dashboard() {
    const stats = [
        { label: 'Total Balance', value: '$12,450.75', icon: DollarSign, color: 'from-blue-500 to-cyan-500', change: '+12.5%' },
        { label: 'Daily Profit', value: '$245.30', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+5.2%' },
        { label: 'Active Investments', value: '4', icon: CreditCard, color: 'from-purple-500 to-pink-500', change: '+1' },
        { label: 'Referral Team', value: '128', icon: Users, color: 'from-orange-500 to-red-500', change: '+8' },
    ];

    const recentActivities = [
        { id: 1, type: 'Deposit', amount: '$1,000.00', date: '2 hours ago', status: 'Completed' },
        { id: 2, type: 'Investment', amount: '$500.00', date: '1 day ago', status: 'Active' },
        { id: 3, type: 'Withdrawal', amount: '$250.00', date: '2 days ago', status: 'Processing' },
        { id: 4, type: 'Commission', amount: '$45.50', date: '3 days ago', status: 'Received' },
        { id: 5, type: 'Referral Bonus', amount: '$25.00', date: '1 week ago', status: 'Received' },
    ];

    const investmentPlans = [
        { name: 'Starter Plan', amount: '$500', return: '10% daily', duration: '30 days', status: 'Active' },
        { name: 'Growth Plan', amount: '$2,000', return: '15% daily', duration: '60 days', status: 'Active' },
        { name: 'Premium Plan', amount: '$5,000', return: '20% daily', duration: '90 days', status: 'Completed' },
    ];

    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Welcome back, Investor!</h1>
                            <p className="text-blue-100">Here's what's happening with your investments today.</p>
                        </div>
                        <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                            Make a Deposit
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg ${
                                            activity.type === 'Deposit' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'Investment' ? 'bg-purple-100 text-purple-600' :
                                            activity.type === 'Withdrawal' ? 'bg-red-100 text-red-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {activity.type === 'Deposit' ? <Wallet className="h-5 w-5" /> :
                                             activity.type === 'Investment' ? <CreditCard className="h-5 w-5" /> :
                                             activity.type === 'Withdrawal' ? <DollarSign className="h-5 w-5" /> :
                                             <TrendingUp className="h-5 w-5" />}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">{activity.type}</div>
                                            <div className="text-sm text-gray-500">{activity.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">{activity.amount}</div>
                                        <div className={`text-sm font-medium ${
                                            activity.status === 'Completed' || activity.status === 'Received' ? 'text-green-600' :
                                            activity.status === 'Processing' ? 'text-yellow-600' :
                                            'text-blue-600'
                                        }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Investment Plans */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Active Investments</h2>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Invest More
                            </button>
                        </div>
                        <div className="space-y-4">
                            {investmentPlans.map((plan, index) => (
                                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="font-semibold text-gray-900">{plan.name}</div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            plan.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {plan.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500">Amount</div>
                                            <div className="font-medium">{plan.amount}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Daily Return</div>
                                            <div className="font-medium text-green-600">{plan.return}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Duration</div>
                                            <div className="font-medium">{plan.duration}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                            <DollarSign className="h-8 w-8 mb-2" />
                            <span className="font-medium">Deposit</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                            <Wallet className="h-8 w-8 mb-2" />
                            <span className="font-medium">Withdraw</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                            <CreditCard className="h-8 w-8 mb-2" />
                            <span className="font-medium">Invest</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                            <Users className="h-8 w-8 mb-2" />
                            <span className="font-medium">Referrals</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
