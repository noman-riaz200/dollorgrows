import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Download,
    UserPlus
} from 'lucide-react';
import { useState } from 'react';

export default function AdminUsers() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const users = [
        { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 234 567 890', country: 'USA', joinDate: '2024-01-15', status: 'active', balance: '$12,500', referrals: 24 },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234 567 891', country: 'Canada', joinDate: '2024-02-10', status: 'active', balance: '$9,800', referrals: 18 },
        { id: 3, name: 'Mike Wilson', email: 'mike@example.com', phone: '+1 234 567 892', country: 'UK', joinDate: '2024-02-28', status: 'pending', balance: '$8,200', referrals: 12 },
        { id: 4, name: 'Emma Davis', email: 'emma@example.com', phone: '+1 234 567 893', country: 'Australia', joinDate: '2024-03-05', status: 'active', balance: '$6,500', referrals: 8 },
        { id: 5, name: 'Robert Brown', email: 'robert@example.com', phone: '+1 234 567 894', country: 'Germany', joinDate: '2024-03-12', status: 'suspended', balance: '$5,100', referrals: 6 },
        { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1 234 567 895', country: 'France', joinDate: '2024-03-15', status: 'active', balance: '$4,800', referrals: 5 },
        { id: 7, name: 'David Miller', email: 'david@example.com', phone: '+1 234 567 896', country: 'Spain', joinDate: '2024-03-18', status: 'active', balance: '$3,900', referrals: 3 },
        { id: 8, name: 'Jennifer Lee', email: 'jennifer@example.com', phone: '+1 234 567 897', country: 'Japan', joinDate: '2024-03-20', status: 'pending', balance: '$2,500', referrals: 2 },
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = search === '' || 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Users', value: '1,248', change: '+12%' },
        { label: 'Active Users', value: '1,042', change: '+8%' },
        { label: 'Pending Verification', value: '86', change: '-5%' },
        { label: 'Suspended Users', value: '120', change: '+2%' },
    ];

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage all users, their accounts, and permissions</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </button>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                            <div className={`text-sm font-medium mt-2 ${
                                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {stat.change} from last month
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.phone}</div>
                                            <div className="text-sm text-gray-500">{user.country}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.joinDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : user.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.status === 'active' ? (
                                                    <CheckCircle className="h-3 w-3 mr-1 inline" />
                                                ) : user.status === 'pending' ? (
                                                    <MoreVertical className="h-3 w-3 mr-1 inline" />
                                                ) : (
                                                    <XCircle className="h-3 w-3 mr-1 inline" />
                                                )}
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {user.balance}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.referrals}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 p-1">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 p-1">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900 p-1">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">8</span> of <span className="font-medium">1,248</span> users
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
                                    3
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Bulk Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100">
                            Activate Selected
                        </button>
                        <button className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-medium hover:bg-yellow-100">
                            Mark as Pending
                        </button>
                        <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium hover:bg-red-100">
                            Suspend Selected
                        </button>
                        <button className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-medium hover:bg-blue-100">
                            Send Email
                        </button>
                        <button className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-100">
                            Export Selected
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}