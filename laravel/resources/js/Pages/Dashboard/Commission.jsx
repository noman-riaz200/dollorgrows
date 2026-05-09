import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';

export default function Commission() {
    const commissions = [
        { id: 1, date: '2024-03-15', member: 'John Smith', level: 'Level 1', amount: '$45.50', status: 'Paid' },
        { id: 2, date: '2024-03-14', member: 'Sarah Johnson', level: 'Level 1', amount: '$32.75', status: 'Paid' },
        { id: 3, date: '2024-03-13', member: 'Mike Wilson', level: 'Level 2', amount: '$18.25', status: 'Pending' },
        { id: 4, date: '2024-03-12', member: 'Emma Davis', level: 'Level 1', amount: '$12.50', status: 'Paid' },
        { id: 5, date: '2024-03-11', member: 'Robert Brown', level: 'Level 3', amount: '$8.75', status: 'Paid' },
    ];

    const commissionStats = [
        { label: 'Total Commission', value: '$1,245.50', change: '+$245.50 this month', icon: DollarSign, color: 'green' },
        { label: 'Pending Commission', value: '$125.00', change: 'Available for withdrawal', icon: Calendar, color: 'yellow' },
        { label: 'This Month', value: '$245.50', change: '+12.5% from last month', icon: TrendingUp, color: 'blue' },
        { label: 'Total Referrals', value: '128', change: '+8 this month', icon: TrendingUp, color: 'purple' },
    ];

    return (
        <DashboardLayout>
            <Head title="Team Commission" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Team Commission</h1>
                        <p className="text-gray-600">Track your commission earnings from your referral team</p>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center">
                        <Download className="h-5 w-5 mr-2" />
                        Export Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {commissionStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className={`p-3 rounded-xl ${stat.color === 'green' ? 'bg-green-100' : stat.color === 'yellow' ? 'bg-yellow-100' : stat.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color === 'green' ? 'text-green-600' : stat.color === 'yellow' ? 'text-yellow-600' : stat.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-gray-500 text-sm">{stat.label}</div>
                                </div>
                            </div>
                            <div className="text-sm text-green-600">{stat.change}</div>
                        </div>
                    ))}
                </div>

                {/* Commission History */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Recent Commission History</h2>
                        <p className="text-gray-600 text-sm">Your commission earnings from the last 30 days</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Team Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {commissions.map((commission) => (
                                    <tr key={commission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {commission.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    {commission.member.charAt(0)}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{commission.member}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {commission.level}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            {commission.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                commission.status === 'Paid' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {commission.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">5</span> of <span className="font-medium">45</span> commission records
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="px-3 py-1 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                                    1
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Commission Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Commission Summary</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Level 1 Commission', amount: '$845.50', percentage: '68%' },
                                { label: 'Level 2 Commission', amount: '$275.75', percentage: '22%' },
                                { label: 'Level 3 Commission', amount: '$124.25', percentage: '10%' },
                                { label: 'Level 4 Commission', amount: '$0.00', percentage: '0%' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                    <div>
                                        <div className="font-medium text-gray-900">{item.label}</div>
                                        <div className="text-sm text-gray-500">{item.percentage} of total</div>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">{item.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Withdrawal Options</h2>
                        <div className="space-y-6">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                <div className="text-lg font-bold text-gray-900 mb-2">Available for Withdrawal</div>
                                <div className="text-3xl font-bold text-green-600 mb-4">$125.00</div>
                                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
                                    Withdraw Now
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>Commissions are paid automatically every Friday. Minimum withdrawal amount is $10.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}