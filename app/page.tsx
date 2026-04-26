import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Layers,
  Globe,
  Lock,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center glow-cyan-sm">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Dollor<span className="text-[#00d2ff]">Grows</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="px-5 py-2 text-[#00d2ff] hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link href="/auth/signin">
              <NeonButton size="sm">Get Started</NeonButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-sm text-gray-300">BFS Matrix System Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-glow-cyan bg-gradient-to-r from-[#00d2ff] via-[#00ff88] to-[#00d2ff] bg-clip-text text-transparent">
              Invest & Network
            </span>
            <br />
            <span className="text-white">Without Limits</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the future of decentralized investment with our BFS Matrix system.
            Earn passive income through 15 investment pools and a 3-level referral
            commission structure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <NeonButton size="lg" className="flex items-center gap-2">
                Start Investing Now
                <ArrowRight className="w-5 h-5" />
              </NeonButton>
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 glass rounded-lg text-white font-semibold transition-all hover:bg-white/[0.06] flex items-center justify-center"
            >
              View Pools
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: "Investment Pools", value: "15", icon: BarChart3 },
            { label: "Referral Levels", value: "3", icon: Users },
            { label: "Daily Returns", value: "1-6%", icon: TrendingUp },
            { label: "Matrix Slots", value: "15", icon: Layers },
          ].map((stat) => (
            <GlassCard key={stat.label} padding="lg" className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#00d2ff]/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-[#00d2ff]" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: "BFS Matrix System",
              desc: "Binary Full Spill matrix ensuring equal growth and maximum earning potential for all members. 15 slots per matrix.",
              icon: Layers,
            },
            {
              title: "15 Investment Pools",
              desc: "Tiered investment opportunities from $50 to $1M with daily returns up to 6%. Pool 1 offers 100% matrix bonus.",
              icon: BarChart3,
            },
            {
              title: "Real-Time Commissions",
              desc: "Instant commission distribution on every referral and investment. 3-level deep referral structure.",
              icon: Zap,
            },
            {
              title: "Team Tree Visualization",
              desc: "Interactive hierarchical view of your downline. Track growth and earnings in real-time.",
              icon: Users,
            },
            {
              title: "BEP20 Wallet Integration",
              desc: "Seamless deposits and withdrawals using any BEP20 token on Binance Smart Chain.",
              icon: Globe,
            },
            {
              title: "Secure & Transparent",
              desc: "Blockchain-verified transactions with automated smart contract operations for trustless execution.",
              icon: Lock,
            },
          ].map((feature) => (
            <GlassCard key={feature.title} hover glow="cyan" className="group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d2ff]/20 to-[#00ff88]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-[#00d2ff]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Pool Bonus Highlight */}
        <GlassCard glow="green" className="mb-20 text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pool 1: <span className="text-[#00ff88]">100% Matrix Bonus</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            The Genesis Pool offers an unprecedented 100% matrix bonus distributed to your
            upline when your referrals fill matrix slots. All other pools provide a solid 30% bonus.
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00ff88] text-glow-green">100%</div>
              <div className="text-sm text-gray-400 mt-1">Pool 1 Bonus</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00d2ff] text-glow-cyan">30%</div>
              <div className="text-sm text-gray-400 mt-1">Pools 2-15 Bonus</div>
            </div>
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">
              Dollor<span className="text-[#00d2ff]">Grows</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 DollorGrows. All rights reserved. Built on Binance Smart Chain.
          </p>
        </div>
      </footer>
    </div>
  );
}

