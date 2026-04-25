"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Copy, Check, Users } from "lucide-react";

export default function ReferralsPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [referralLink] = useState(
    `${typeof window !== "undefined" ? window.location.origin : ""}/auth/signin?ref=${session?.user?.referralCode || "YOURCODE"}`
  );

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
    const text = `Join Fund Grow Online - The future of network marketing and investment! Use my referral link: ${referralLink}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join Fund Grow Online!")}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Referral Program</h1>
        <p className="text-gray-400">
          Invite friends and earn up to 15% commissions on their investments across 3 levels.
        </p>
      </div>

      {/* Commission Structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            level: "Level 1",
            percentage: "10-15%",
            description: "Direct referrals - you invite them",
            color: "cyan",
          },
          {
            level: "Level 2",
            percentage: "5-10%",
            description: "Second level - their referrals",
            color: "emerald",
          },
          {
            level: "Level 3",
            percentage: "3-5%",
            description: "Third level - deep downline",
            color: "purple",
          },
        ].map((tier) => (
          <div
            key={tier.level}
            className={`bg-gradient-to-br from-${tier.color}-900/30 to-gray-900/60 border border-${tier.color}-800/50 rounded-xl p-6`}
          >
            <div className={`text-4xl font-bold text-${tier.color}-400 mb-2`}>
              {tier.percentage}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{tier.level}</h3>
            <p className="text-gray-400 text-sm">{tier.description}</p>
          </div>
        ))}
      </div>

      {/* Referral Link Card */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Referral Link</h2>
            <p className="text-gray-400">Share this link to earn commissions</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => shareVia("twitter")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            Share on Twitter
          </button>
          <button
            onClick={() => shareVia("facebook")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            Share on Facebook
          </button>
          <button
            onClick={() => shareVia("telegram")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            Share on Telegram
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-8">
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
              desc: "Receive instant commissions on their investments and their referrals.",
            },
          ].map((step) => (
            <div key={step.step} className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                {step.step}
              </div>
              <div className="pl-6">
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
