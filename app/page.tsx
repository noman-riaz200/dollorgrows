import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, Users, TrendingUp, Zap, Shield } from "lucide-react";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Fund Grow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="px-6 py-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-medium transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Network Marketing
            </span>
            <br />
            <span className="text-white">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Join the future of decentralized investment with our BFS Matrix system.
            Earn passive income through 15 investment pools and a 3-level referral
            commission structure on the BSC network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 neon-cyan"
            >
              Start Investing Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pools"
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-white rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
            >
              View Investment Pools
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: "Investment Pools", value: "15", icon: BarChart3, color: "cyan" },
            { label: "Referral Levels", value: "3", icon: Users, color: "emerald" },
            { label: "Daily Returns", value: "1-6%", icon: TrendingUp, color: "cyan" },
            { label: "Blockchain", value: "BSC", icon: Zap, color: "emerald" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "BFS Matrix System",
              desc: "Binary Full Spill matrix ensuring equal growth and maximum earning potential for all members.",
              color: "cyan",
            },
            {
              title: "15 Investment Pools",
              desc: "Tiered investment opportunities from $50 to $1M with daily returns up to 6%.",
              color: "emerald",
            },
            {
              title: "Real-Time Commissions",
              desc: "Instant commission distribution to your BEP20 wallet on every referral and investment.",
              color: "cyan",
            },
            {
              title: "Team Tree Visualization",
              desc: "Interactive hierarchical view of your downline, track growth and earnings in real-time.",
              color: "emerald",
            },
            {
              title: "BEP20 Wallet Integration",
              desc: "Seamless deposits and withdrawals using any BEP20 token on Binance Smart Chain.",
              color: "cyan",
            },
            {
              title: "Secure & Transparent",
              desc: "Blockchain-verified transactions with smart contract automation for trustless operations.",
              color: "emerald",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`} />
              <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Shield className={`w-7 h-7 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>© 2024 Fund Grow Online. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built on Binance Smart Chain • BEP20 Token Compatible
          </p>
        </div>
      </footer>
    </div>
  );
}
