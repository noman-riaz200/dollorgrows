"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { ReactNode } from "react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/referrals", label: "Referral Link", icon: Link2 },
  { href: "/dashboard/team", label: "Referral Team", icon: UserPlus },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
  { href: "/dashboard/commission", label: "Team Commission", icon: Percent },
  { href: "/dashboard/plans", label: "Plans", icon: CreditCard },
  { href: "/dashboard/exchange", label: "Exchange History", icon: ArrowLeftRight },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full glass-strong border-r border-white/[0.08]">
          {/* Logo & mobile close */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center glow-cyan-sm">
                <LayoutDashboard className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                dollor<span className="text-[#00d2ff]">grows</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20"
                      : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-white/[0.06]">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/[0.03] hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

{/* Main Content Wrapper */}
      <div className="lg:ml-64 flex flex-col min-h-[100dvh]">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-white/[0.06] px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search Bar */}
              <div className="relative max-w-md w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 focus:ring-1 focus:ring-[#00d2ff]/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Right: PIN Badge + User Profile */}
            <div className="flex items-center gap-4">
              {/* PIN Secured Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
                <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
                <span className="text-sm font-medium text-[#00ff88]">PIN Secured</span>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center glow-cyan-sm">
                  <span className="text-black font-bold text-sm">
                    {session?.user?.name?.[0]?.toUpperCase() || "M"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="relative z-10 p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

