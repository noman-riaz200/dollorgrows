"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  Users,
  Wallet,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/pools", label: "Pools", icon: Layers },
  { href: "/dashboard/team", label: "My Team", icon: Users },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/referrals", label: "Referrals", icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
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
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Dollor<span className="text-[#00d2ff]">Grows</span>
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
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

          {/* User Profile */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center">
                <span className="text-black font-bold text-sm">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email
                    ? session.user.email
                    : "No email"}
                </p>
              </div>
            </div>
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

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-4 p-4 glass border-b border-white/[0.06]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Dollor<span className="text-[#00d2ff]">Grows</span>
            </span>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

