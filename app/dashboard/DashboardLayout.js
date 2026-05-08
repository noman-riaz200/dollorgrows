"use client";

import { useState } from "react";
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
  BarChart3,
  UserCog,
  Database,
  Activity,
  Wallet,
  TrendingUp,
  Bell,
  HelpCircle
} from "lucide-react";
import styles from "./layout.module.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/referrals", label: "Referral Link", icon: Link2 },
  { href: "/dashboard/team", label: "Referral Team", icon: UserPlus },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
  { href: "/dashboard/commission", label: "Team Commission", icon: Percent },
  { href: "/dashboard/plans", label: "Plans", icon: CreditCard },
  { href: "/dashboard/exchange", label: "Exchange History", icon: ArrowLeftRight },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNavItems = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/analytics", label: "System Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Admin Settings", icon: Settings },
];

export default function DashboardLayout({ children, isAdmin = false }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const currentNavItems = isAdmin ? adminNavItems : navItems;

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar Overlay for Mobile */}
      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayActive : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logo} onClick={() => setSidebarOpen(false)}>
            <div className={styles.logoIcon}>
              <LayoutDashboard size={20} />
            </div>
            <span>
              dollor<span className={styles.logoAccent}>grows</span>
            </span>
          </Link>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            {currentNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href} className={styles.navItem}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  >
                    <Icon className={styles.navIcon} size={20} />
                    <span className={styles.navLabel}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className={styles.logoutButton}
          >
            <LogOut className={styles.navIcon} size={20} />
            <span className={styles.navLabel}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>

            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.card} style={{ padding: "0.5rem 1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: "0.875rem" }}>PIN Secured</span>
              </div>
            </div>

            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                <span>{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{session?.user?.name || "User"}</span>
                <span className={styles.userEmail}>{session?.user?.email || "user@example.com"}</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}