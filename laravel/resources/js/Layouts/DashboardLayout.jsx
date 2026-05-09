import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Link2,
    UserPlus,
    Users,
    Percent,
    CreditCard,
    ArrowLeftRight,
    Settings,
    Search,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/referrals', label: 'Referral Link', icon: Link2 },
    { href: '/dashboard/team', label: 'Referral Team', icon: UserPlus },
    { href: '/dashboard/teams', label: 'Teams', icon: Users },
    { href: '/dashboard/commission', label: 'Team Commission', icon: Percent },
    { href: '/dashboard/plans', label: 'Plans', icon: CreditCard },
    { href: '/dashboard/exchange', label: 'Exchange History', icon: ArrowLeftRight },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }) {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const user = props.auth?.user || { name: 'User', email: 'user@example.com' };

    const handleLogout = (e) => {
        e.preventDefault();
        // Inertia will handle the logout via POST request
        // For now, we'll just redirect
        window.location.href = '/logout';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-3"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                                <LayoutDashboard className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold">
                                dollor<span className="text-blue-400">grows</span>
                            </span>
                        </Link>
                        <button 
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = url === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Topbar */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <button 
                                    className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu className="h-6 w-6" />
                                </button>

                                <div className="ml-4 flex-1 max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-sm font-medium text-gray-900">{user.name || 'User'}</div>
                                        <div className="text-xs text-gray-500">{user.email || 'user@example.com'}</div>
                                    </div>
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}