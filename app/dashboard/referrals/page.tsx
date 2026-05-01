"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Copy, Check, Link2, Gift, User, Phone, Mail, Hash, Share2, Twitter, Facebook, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
export default function ReferralsPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://dollorgrows.com";
  const referralCode = session?.user?.referralCode || "YOURCODE";
  const referralLink = `${baseUrl}/auth/register?ref=${referralCode}`;

  const userDetails = {
    name: session?.user?.name || "—",
    phone: session?.user?.phone || "—",
    email: session?.user?.email || "—",
    referralCode: referralCode,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareVia = (platform: string) => {
    const text = `Join DollorGrows - The future of network marketing and investment! Use my referral link: ${referralLink}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join DollorGrows!")}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div>
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Referral Link</h1>
          <p className="text-gray-400">
            Share your unique referral link and earn commissions on every investment made by your referrals.
          </p>
        </div>

        {/* Section 1 & 2 Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Section 1: QR Code + Copy Link */}
          <GlassCard glow="cyan" neonBorder="cyan" className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d2ff]/20 to-[#00ff88]/20 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-[#00d2ff]" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">Your Referral QR Code</h2>
                <p className="text-gray-400 text-sm">Scan or share your link</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-white rounded-xl mb-6">
              <QRCodeSVG
                value={referralLink}
                size={200}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/favicon.ico",
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
            </div>

            {/* Referral URL */}
            <div className="w-full flex gap-3 mb-4">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white font-mono text-sm"
              />
              <NeonButton onClick={copyToClipboard} className="flex items-center gap-2 shrink-0">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Link"}
              </NeonButton>
            </div>

            {/* Social Share Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => shareVia("twitter")}
                className="flex-1 py-2.5 glass rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button
                onClick={() => shareVia("facebook")}
                className="flex-1 py-2.5 glass rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => shareVia("telegram")}
                className="flex-1 py-2.5 glass rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Telegram
              </button>
            </div>
          </GlassCard>

          {/* Section 2: Referral Rewards */}
          <GlassCard glow="green" neonBorder="green">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00d2ff]/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Referral Rewards</h2>
                <p className="text-gray-400 text-sm">Earn bonuses on every referral</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Pool 1 Reward */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#00ff88]/10 to-transparent border border-[#00ff88]/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Pool 1 — Genesis Pool</h3>
                  <span className="text-2xl font-bold text-[#00ff88]">100%</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Unprecedented <span className="text-[#00ff88] font-semibold">100% matrix bonus</span> distributed to your upline when your referrals fill matrix slots in the Genesis Pool.
                </p>
              </div>

              {/* Pools 2-15 Reward */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#00d2ff]/10 to-transparent border border-[#00d2ff]/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Pools 2 — 15</h3>
                  <span className="text-2xl font-bold text-[#00d2ff]">30%</span>
                </div>
                <p className="text-gray-400 text-sm">
                  All other pools provide a solid <span className="text-[#00d2ff] font-semibold">30% bonus</span> on referral investments, giving you consistent passive income across all tiers.
                </p>
              </div>

              {/* Additional Info */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white mb-2">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-0.5">•</span>
                    Share your referral link with friends and followers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00d2ff] mt-0.5">•</span>
                    They sign up using your link and invest in pools
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00ff88] mt-0.5">•</span>
                    You earn instant bonuses based on the pool they join
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Section 3: My Referral Details Table */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d2ff]/20 to-[#00ff88]/20 flex items-center justify-center">
              <User className="w-5 h-5 text-[#00d2ff]" />
            </div>
            <h2 className="text-xl font-bold text-white">My Referral Details</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Referral Code
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center">
                        <span className="text-black font-bold text-xs">
                          {userDetails.name[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-white font-medium">{userDetails.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{userDetails.phone}</td>
                  <td className="py-4 px-4 text-gray-300">{userDetails.email}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/20 text-[#00d2ff] font-mono text-sm font-semibold">
                      {userDetails.referralCode}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
  );
}

