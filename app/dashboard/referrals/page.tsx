"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Copy, Check, Link2, Gift, User, Phone, Mail, Hash, Share2, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
export default function ReferralsPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dollorgrows.com";
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
        <div className="referrals-header">
          <h1>Referral Link</h1>
          <p>
            Share your unique referral link and earn commissions on every investment made by your referrals.
          </p>
        </div>

        {/* Section 1 & 2 Grid */}
        <div className="referrals-grid">
          {/* Section 1: QR Code + Copy Link */}
          <div className="referral-card glow-blue">
            <div className="referral-card-header">
              <div className="referral-card-icon blue">
                <Link2 />
              </div>
              <div>
                <h2 className="referral-card-title">Your Referral QR Code</h2>
                <p className="referral-card-subtitle">Scan or share your link</p>
              </div>
            </div>

            <div className="qr-container">
              {/* QR Code */}
              <div className="qr-code-wrapper">
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
              <div className="referral-url-container">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="referral-url-input"
                />
                <button onClick={copyToClipboard} className="referral-copy-button">
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="social-share-container">
                <button
                  onClick={() => shareVia("twitter")}
                  className="social-share-button"
                >
                  <MessageSquare />
                  Twitter
                </button>
                <button
                  onClick={() => shareVia("facebook")}
                  className="social-share-button"
                >
                  <ThumbsUp />
                  Facebook
                </button>
                <button
                  onClick={() => shareVia("telegram")}
                  className="social-share-button"
                >
                  <Send />
                  Telegram
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Referral Rewards */}
          <div className="referral-card glow-mint">
            <div className="referral-card-header">
              <div className="referral-card-icon mint">
                <Gift />
              </div>
              <div>
                <h2 className="referral-card-title">Referral Rewards</h2>
                <p className="referral-card-subtitle">Earn bonuses on every referral</p>
              </div>
            </div>

            <div className="reward-cards-container">
              {/* Pool 1 Reward */}
              <div className="reward-card green">
                <div className="reward-card-header">
                  <h3 className="reward-card-title">Pool 1 — Genesis Pool</h3>
                  <span className="reward-card-percentage green">100%</span>
                </div>
                <p className="reward-card-description">
                  Unprecedented <strong>100% matrix bonus</strong> distributed to your upline when your referrals fill matrix slots in the Genesis Pool.
                </p>
              </div>

              {/* Pools 2-15 Reward */}
              <div className="reward-card cyan">
                <div className="reward-card-header">
                  <h3 className="reward-card-title">Pools 2 — 15</h3>
                  <span className="reward-card-percentage cyan">30%</span>
                </div>
                <p className="reward-card-description">
                  All other pools provide a solid <strong>30% bonus</strong> on referral investments, giving you consistent passive income across all tiers.
                </p>
              </div>

              {/* Additional Info */}
              <div className="how-it-works-card">
                <h3 className="how-it-works-title">How It Works</h3>
                <ul className="how-it-works-list">
                  <li>
                    <span className="bullet">•</span>
                    Share your referral link with friends and followers
                  </li>
                  <li>
                    <span className="bullet">•</span>
                    They sign up using your link and invest in pools
                  </li>
                  <li>
                    <span className="bullet green">•</span>
                    You earn instant bonuses based on the pool they join
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: My Referral Details Table */}
        <div className="referral-details-card">
          <div className="referral-details-header">
            <div className="referral-details-icon">
              <User />
            </div>
            <h2 className="referral-details-title">My Referral Details</h2>
          </div>

          <div className="table-container">
            <table className="referral-details-table">
              <thead>
                <tr>
                  <th>
                    <div>
                      <User />
                      Name
                    </div>
                  </th>
                  <th>
                    <div>
                      <Phone />
                      Phone
                    </div>
                  </th>
                  <th>
                    <div>
                      <Mail />
                      Email
                    </div>
                  </th>
                  <th>
                    <div>
                      <Hash />
                      Referral Code
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="user-info-container">
                      <div className="user-avatar">
                        <span className="user-avatar-initial">
                          {userDetails.name[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="user-name">{userDetails.name}</span>
                    </div>
                  </td>
                  <td className="user-phone">{userDetails.phone}</td>
                  <td className="user-email">{userDetails.email}</td>
                  <td>
                    <span className="referral-code-badge">
                      {userDetails.referralCode}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

