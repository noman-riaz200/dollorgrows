import React from "react";
import Footer from "@/components/ui/Footer";
import { UserCheck } from "lucide-react";

export default function KYCPage() {
  return (
    <>
      <main className="legal-page">
        <div className="bg-shape shape-blue"></div>
        
        <div className="container">
          <div className="legal-header">
            <div className="icon-wrap">
              <UserCheck size={32} />
            </div>
            <h1 className="legal-title">Know Your Customer (KYC)</h1>
            <p className="legal-updated">Last Updated: May 2026</p>
          </div>

          <div className="legal-content-card">
            <section className="legal-section">
              <h2>1. Overview</h2>
              <p>
                To ensure a safe and compliant investment environment, DollorGrows enforces a strict Know Your Customer (KYC) protocol. This procedure helps us verify the identity of our users, prevent fraud, and comply with international anti-money laundering regulations.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Verification Tiers</h2>
              <p>
                Our platform operates on a tiered verification system. Your ability to deposit, invest, and withdraw funds is limited based on your KYC tier:
              </p>
              <ul>
                <li><strong>Tier 1 (Unverified):</strong> Basic email and phone verification. Access to the dashboard but deposits and withdrawals are restricted.</li>
                <li><strong>Tier 2 (Basic Identity):</strong> Requires submission of a government-issued ID. Enables standard deposits and withdrawals up to specific daily limits.</li>
                <li><strong>Tier 3 (Full Verification):</strong> Requires Proof of Address and a selfie verification. Unlocks unlimited deposits and highest withdrawal limits.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Required Documents</h2>
              <p>
                When prompted, you may need to provide high-quality, unedited photos or scans of the following documents:
              </p>
              <ul>
                <li>A valid, government-issued Passport, National ID card, or Driver's License.</li>
                <li>A recent utility bill or bank statement (issued within the last 3 months) showing your full name and residential address.</li>
                <li>A live selfie, potentially holding your ID and a note with today's date and "DollorGrows".</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Privacy of Documents</h2>
              <p>
                All documents submitted for KYC purposes are encrypted and stored securely offline. They are processed strictly for verification and compliance purposes and are never shared with unauthorized third parties. For more details, please refer to our Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .legal-page {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
          padding: 100px 0 80px;
          position: relative;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          opacity: 0.15;
        }

        .shape-blue {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%);
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
        }

        .legal-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .icon-wrap {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .legal-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #3b82f6, #00d2ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .legal-updated {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .legal-content-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 3rem 4rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .legal-section {
          margin-bottom: 3rem;
        }

        .legal-section:last-child {
          margin-bottom: 0;
        }

        .legal-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #fff;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.75rem;
        }

        .legal-section p {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }

        .legal-section ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .legal-section li {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
          position: relative;
        }

        .legal-section li::marker {
          color: #3b82f6;
        }

        .legal-section strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .legal-content-card {
            padding: 2rem 1.5rem;
          }
          .legal-title {
            font-size: 2rem;
          }
        }
      `}} />
    </>
  );
}
