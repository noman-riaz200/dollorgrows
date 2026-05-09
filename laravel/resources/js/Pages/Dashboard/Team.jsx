import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Users, UserPlus, TrendingUp, Award } from 'lucide-react';

export default function Team() {
    const teamMembers = [
        { id: 1, name: 'John Smith', email: 'john@example.com', joinDate: '2024-01-15', status: 'Active', level: 'Level 1', investment: '$2,500' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', joinDate: '2024-02-20', status: 'Active', level: 'Level 1', investment: '$1,800' },
        { id: 3, name: 'Mike Wilson', email: 'mike@example.com', joinDate: '2024-03-05', status: 'Active', level: 'Level 2', investment: '$3,200' },
        { id: 4, name: 'Emma Davis', email: 'emma@example.com', joinDate: '2024-03-12', status: 'Pending', level: 'Level 1', investment: '$500' },
        { id: 5, name: 'Robert Brown', email: 'robert@example.com', joinDate: '2024-03-18', status: 'Active', level: 'Level 3', investment: '$4,500' },
    ];

    const teamStats = [
        { label: 'Total Team Members', value: '128', icon: Users, color: 'blue', change: '+8 this month' },
        { label: 'Active Members', value: '89', icon: UserPlus, color: 'green', change: '+5 this month' },
        { label: 'Total Team Investment', value: '$45,200', icon: TrendingUp, color: 'purple', change: '+$2,400' },
        { label: 'Team Commission', value: '$1,245', icon: Award, color: 'orange', change: '+$245 this month' },
    ];

    return (
        <DashboardLayout>
            <Head title="Referral Team" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Referral Team</h1>
                    <p className="text-gray-600">Manage and track your referral team members and their performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className={`p-3 rounded-xl ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
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

                {/* Team Members Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                        <p className="text-gray-600 text-sm">Your direct referrals and their details</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Investment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teamMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                    <div className="text-sm text-gray-500">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {member.joinDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                member.status === 'Active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {member.level}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {member.investment}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                            <button className="text-green-600 hover:text-green-900">Message</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">5</span> of <span className="font-medium">128</span> team members
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

                {/* Team Structure */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Team Structure</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-gray-900">Level 1 (Direct)</div>
                                    <div className="text-sm text-gray-500">Your direct referrals</div>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">5 members</div>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-gray-900">Level 2</div>
                                    <div className="text-sm text-gray-500">Referrals of your referrals</div>
                                </div>
                                <div className="text-2xl font-bold text-purple-600">18 members</div>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-gray-900">Level 3</div>
                                    <div className="text-sm text-gray-500">Third-level referrals</div>
                                </div>
                                <div className="text-2xl font-bold text-green-600">42 members</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Team Performance</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">This Month's Growth</span>
                                    <span className="text-sm font-bold text-green-600">+12.5%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Active Rate</span>
                                    <span className="text-sm font-bold text-blue-600">69.5%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '69.5%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Commission Rate</span>
                                    <span className="text-sm font-bold text-purple-600">8.2%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}