"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Copy, Check, Users, Layers, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { MatrixGrid } from "@/components/ui/MatrixGrid";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface MatrixSlotData {
  position: number;
  isFilled: boolean;
  filledBy: string | null;
  bonusAmount: number;
}

export default function ReferralsPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [matrixSlots, setMatrixSlots] = useState<MatrixSlotData[]>([]);
  const [matrixStats, setMatrixStats] = useState({ filled: 0, total: 15, totalBonusEarned: 0 });

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signin?ref=${session?.user?.referralCode || "YOURCODE"}`;

  useEffect(() => {
    const loadMatrix = async () => {
      try {
        const res = await fetch("/api/matrix");
        const data = await res.json();
        if (data.slots) {
          setMatrixSlots(data.slots);
          setMatrixStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch matrix:", error);
      }
    };
    if (session) loadMatrix();
  }, [session]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareVia = async (platform: string) => {
    const text = `Join DollorGrows - The future of network marketing and investment! Use my referral link: ${referralLink}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join DollorGrows!")}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Referral Program</h1>
          <p className="text-gray-400">
            Invite friends and earn up to 15% commissions on their investments across 3 levels.
          </p>
        </div>

        {/* Commission Structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { level: "Level 1", percentage: "10-15%", desc: "Direct referrals", color: "#00d2ff" },
            { level: "Level 2", percentage: "5-10%", desc: "Second level", color: "#00ff88" },
            { level: "Level 3", percentage: "3-5%", desc: "Third level", color: "#8b5cf6" },
          ].map((tier) => (
            <GlassCard key={tier.level} className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: tier.color }}>
                {tier.percentage}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{tier.level}</h3>
              <p className="text-gray-400 text-sm">{tier.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Matrix + Referral Link Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Matrix Visualization */}
          <GlassCard glow="cyan">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00d2ff]" />
                Your BFS Matrix
              </h3>
              <span className="text-xs text-[#00ff88] font-medium">
                {matrixStats.filled}/{matrixStats.total} filled
              </span>
            </div>
            <MatrixGrid
              slots={matrixSlots.map((s) => ({
                position: s.position,
                isFilled: s.isFilled,
                filledBy: s.filledBy || undefined,
                bonusAmount: s.bonusAmount,
              }))}
            />
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Bonus Earned</span>
                <span className="text-[#00ff88] font-bold">
                  ${matrixStats.totalBonusEarned.toLocaleString()}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Referral Link Card */}
          <GlassCard glow="green">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d2ff]/20 to-[#00ff88]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#00d2ff]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Referral Link</h2>
                <p className="text-gray-400 text-sm">Share this link to earn commissions</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white font-mono text-sm"
              />
              <NeonButton onClick={copyToClipboard} className="flex items-center gap-2">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy"}
              </NeonButton>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => shareVia("twitter")}
                className="flex-1 py-2 glass rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => shareVia("facebook")}
                className="flex-1 py-2 glass rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Facebook
              </button>
              <button
                onClick={() => shareVia("telegram")}
                className="flex-1 py-2 glass rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Telegram
              </button>
            </div>
          </GlassCard>
        </div>

        {/* How It Works */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">How Referrals Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Share Your Link",
                desc: "Send your unique referral link to friends and followers.",
              },
              {
                step: "2",
                title: "They Register & Invest",
                desc: "Your referrals sign up using your link and make their first investment.",
              },
              {
                step: "3",
                title: "Earn Commissions",
                desc: "Receive instant commissions and matrix bonuses on their investments.",
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="absolute -left-2 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center text-black font-bold text-sm">
                  {step.step}
                </div>
                <div className="pl-8">
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

