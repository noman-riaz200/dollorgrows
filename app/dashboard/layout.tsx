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
import "./dashboard.css";
import "./plans.css";

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
    <div className="dashboard-layout">
      <AnimatedBackground />

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link
            href="/dashboard"
            className="sidebar-logo"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="logo-icon">
              <LayoutDashboard />
            </div>
            <span className="logo-text">
              dollor<span>grows</span>
            </span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="logout-btn"
          >
            <LogOut className="nav-icon" />
            <span className="nav-label">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>

            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="topbar-right">
            <div className="pin-badge">
              <ShieldCheck />
              <span>PIN Secured</span>
            </div>

            <div className="user-profile">
              <div className="user-avatar">
                <span>{session?.user?.name?.[0]?.toUpperCase() || "M"}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{session?.user?.name || "User"}</span>
                <span className="user-email">{session?.user?.email || "user@example.com"}</span>
              </div>
              <ChevronDown className="user-dropdown" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}

