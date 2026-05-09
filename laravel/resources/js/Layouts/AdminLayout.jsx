import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Shield, 
    Users, 
    BarChart3, 
    Database, 
    DollarSign, 
    Settings, 
    LogOut,
    Home,
    Bell,
    Search
} from 'lucide-react';

export default function AdminLayout({ header, children }) {
    const adminNavItems = [
        { name: 'Dashboard', href: '/admin', icon: Shield, current: true },
        { name: 'Users', href: '/admin/users', icon: Users, current: false },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: false },
        { name: 'Pools', href: '/admin/pools', icon: Database, current: false },
        { name: 'Transactions', href: '/admin/transactions', icon: DollarSign, current: false },
        { name: 'Settings', href: '/admin/settings', icon: Settings, current: false },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Shield className="h-8 w-8 text-blue-600 mr-3" />
                        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="flex h-full">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 py-6 px-4">
                    <nav className="space-y-2">
                        {adminNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    item.current
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Home className="h-5 w-5 mr-3" />
                            Back to User Dashboard
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2 w-full"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Logout
                        </Link>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    {children}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}