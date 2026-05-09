import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Users, Network, TrendingUp, Award } from 'lucide-react';

export default function Teams() {
    return (
        <DashboardLayout>
            <Head title="Teams Network" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Teams Network</h1>
                    <p className="text-gray-600">View your team network structure and performance across all levels</p>
                </div>

                {/* Network Overview */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Network Overview</h2>
                            <p className="text-blue-100">Your complete team structure across all levels</p>
                        </div>
                        <Network className="h-12 w-12 opacity-80" />
                    </div>
                </div>

                {/* Team Levels */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { level: 'Level 1', members: '5', commission: '$245.50', color: 'blue' },
                        { level: 'Level 2', members: '18', commission: '$512.75', color: 'purple' },
                        { level: 'Level 3', members: '42', commission: '$387.25', color: 'green' },
                        { level: 'Level 4', members: '63', commission: '$100.50', color: 'orange' },
                    ].map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center mb-4">
                                <div className={`p-3 rounded-xl ${item.color === 'blue' ? 'bg-blue-100' : item.color === 'purple' ? 'bg-purple-100' : item.color === 'green' ? 'bg-green-100' : 'bg-orange-100'}`}>
                                    <Users className={`h-6 w-6 ${item.color === 'blue' ? 'text-blue-600' : item.color === 'purple' ? 'text-purple-600' : item.color === 'green' ? 'text-green-600' : 'text-orange-600'}`} />
                                </div>
                                <div className="ml-4">
                                    <div className="text-2xl font-bold text-gray-900">{item.members}</div>
                                    <div className="text-gray-500 text-sm">Members</div>
                                </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">{item.level}</div>
                            <div className="text-sm text-gray-500 mt-2">Total Commission: <span className="font-semibold text-green-600">{item.commission}</span></div>
                        </div>
                    ))}
                </div>

                {/* Network Visualization Placeholder */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Team Network Structure</h2>
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Team network visualization will be displayed here</p>
                            <p className="text-gray-400 text-sm mt-2">Showing hierarchical structure of your referral network</p>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Team Performance</h2>
                        <div className="space-y-6">
                            {[
                                { label: 'Total Team Investment', value: '$45,200', progress: 75, color: 'blue' },
                                { label: 'Active Members Rate', value: '69.5%', progress: 69.5, color: 'green' },
                                { label: 'Monthly Growth', value: '+12.5%', progress: 82, color: 'purple' },
                                { label: 'Commission Rate', value: '8.2%', progress: 82, color: 'orange' },
                            ].map((metric, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                                        <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${metric.color === 'blue' ? 'bg-blue-600' : metric.color === 'green' ? 'bg-green-600' : metric.color === 'purple' ? 'bg-purple-600' : 'bg-orange-600'}`}
                                            style={{ width: `${metric.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                                    <span className="font-medium text-gray-900">View All Members</span>
                                </div>
                                <span className="text-blue-600">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                                <div className="flex items-center">
                                    <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                                    <span className="font-medium text-gray-900">Generate Report</span>
                                </div>
                                <span className="text-purple-600">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                <div className="flex items-center">
                                    <Award className="h-5 w-5 text-green-600 mr-3" />
                                    <span className="font-medium text-gray-900">Commission Summary</span>
                                </div>
                                <span className="text-green-600">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                                <div className="flex items-center">
                                    <Network className="h-5 w-5 text-orange-600 mr-3" />
                                    <span className="font-medium text-gray-900">Network Analysis</span>
                                </div>
                                <span className="text-orange-600">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}