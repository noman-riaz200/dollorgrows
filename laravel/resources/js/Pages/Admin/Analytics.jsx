import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown,
    DollarSign,
    Users,
    Calendar,
    Download,
    Filter,
    PieChart,
    LineChart
} from 'lucide-react';

export default function AdminAnalytics() {
    const revenueData = [
        { month: 'Jan', revenue: 12500, investments: 8500 },
        { month: 'Feb', revenue: 18900, investments: 12000 },
        { month: 'Mar', revenue: 21500, investments: 14500 },
        { month: 'Apr', revenue: 24800, investments: 16800 },
        { month: 'May', revenue: 27500, investments: 19200 },
        { month: 'Jun', revenue: 31200, investments: 22500 },
    ];

    const userGrowthData = [
        { month: 'Jan', users: 850, new: 120 },
        { month: 'Feb', users: 1020, new: 170 },
        { month: 'Mar', users: 1240, new: 220 },
        { month: 'Apr', users: 1450, new: 210 },
        { month: 'May', users: 1680, new: 230 },
        { month: 'Jun', users: 1950, new: 270 },
    ];

    const topCountries = [
        { country: 'United States', users: 420, revenue: '$45,200' },
        { country: 'United Kingdom', users: 280, revenue: '$28,500' },
        { country: 'Canada', users: 195, revenue: '$21,800' },
        { country: 'Australia', users: 168, revenue: '$18,200' },
        { country: 'Germany', users: 142, revenue: '$15,600' },
    ];

    const kpiStats = [
        { label: 'Total Revenue', value: '$156,400', change: '+18.5%', icon: DollarSign, color: 'green' },
        { label: 'Active Users', value: '1,950', change: '+12.2%', icon: Users, color: 'blue' },
        { label: 'Avg. Investment', value: '$2,450', change: '+5.8%', icon: TrendingUp, color: 'purple' },
        { label: 'Conversion Rate', value: '8.2%', change: '+1.4%', icon: PieChart, color: 'orange' },
    ];

    return (
        <AdminLayout>
            <Head title="Analytics Dashboard" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600">Comprehensive analytics and insights about your platform</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last 6 Months
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* KPI Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${
                                    stat.color === 'green' ? 'bg-green-100' :
                                    stat.color === 'blue' ? 'bg-blue-100' :
                                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                                }`}>
                                    <stat.icon className={`h-6 w-6 ${
                                        stat.color === 'green' ? 'text-green-600' :
                                        stat.color === 'blue' ? 'text-blue-600' :
                                        stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                                    }`} />
                                </div>
                                <div className={`flex items-center text-sm font-medium ${
                                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change.startsWith('+') ? (
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 mr-1" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Revenue & Investments</h2>
                                <p className="text-gray-600">Monthly revenue and investment trends</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Revenue</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Investments</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {revenueData.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-16 text-sm text-gray-500">{item.month}</div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex items-center">
                                            <div 
                                                className="h-8 bg-blue-500 rounded-l" 
                                                style={{ width: `${(item.revenue / 35000) * 100}%` }}
                                            ></div>
                                            <div 
                                                className="h-8 bg-green-500 rounded-r" 
                                                style={{ width: `${(item.investments / 35000) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>${item.revenue.toLocaleString()}</span>
                                            <span>${item.investments.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Growth Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
                                <p className="text-gray-600">Total users and new registrations</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 bg-purple-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Total Users</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="h-3 w-3 bg-pink-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">New Users</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {userGrowthData.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-16 text-sm text-gray-500">{item.month}</div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex items-center">
                                            <div 
                                                className="h-8 bg-purple-500 rounded-l" 
                                                style={{ width: `${(item.users / 2500) * 100}%` }}
                                            ></div>
                                            <div 
                                                className="h-8 bg-pink-500 rounded-r" 
                                                style={{ width: `${(item.new / 300) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>{item.users.toLocaleString()} users</span>
                                            <span>+{item.new} new</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Countries & Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Countries */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Countries</h2>
                        <div className="space-y-4">
                            {topCountries.map((country, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-lg font-bold text-blue-600">
                                                {country.country.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">{country.country}</div>
                                            <div className="text-sm text-gray-500">{country.users} users</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">{country.revenue}</div>
                                        <div className="text-sm text-green-600">+12.5% growth</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">User Retention</span>
                                    <span className="text-sm font-bold text-gray-900">78.5%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '78.5%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Investment Completion</span>
                                    <span className="text-sm font-bold text-gray-900">92.3%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '92.3%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Withdrawal Success</span>
                                    <span className="text-sm font-bold text-gray-900">96.8%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '96.8%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                                    <span className="text-sm font-bold text-gray-900">4.7/5.0</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Insights & Recommendations</h2>
                            <p className="text-gray-600 mt-2">Based on your analytics data, here are some recommendations:</p>
                        </div>
                        <BarChart3 className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="text-sm font-medium text-blue-700 mb-2">📈 Growth Opportunity</div>
                            <p className="text-sm text-gray-600">User acquisition from Germany increased by 24%. Consider targeted marketing campaigns.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="text-sm font-medium text-green-700 mb-2">💰 Revenue Boost</div>
                            <p className="text-sm text-gray-600">Weekend investments are 18% higher. Consider promoting weekend-only bonuses.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="text-sm font-medium text-purple-700 mb-2">👥 User Engagement</div>
                            <p className="text-sm text-gray-600">Active users spend 32 minutes on average. Consider adding more interactive features.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}