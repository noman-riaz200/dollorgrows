import React from "react";
import Footer from "@/components/ui/Footer";
import { Scale } from "lucide-react";

export default function AMLPage() {
  return (
    <>
      <main className="legal-page">
        <div className="bg-shape shape-purple"></div>
        
        <div className="container">
          <div className="legal-header">
            <div className="icon-wrap">
              <Scale size={32} />
            </div>
            <h1 className="legal-title">Anti-Money Laundering (AML)</h1>
            <p className="legal-updated">Last Updated: May 2026</p>
          </div>

          <div className="legal-content-card">
            <section className="legal-section">
              <h2>1. Policy Statement</h2>
              <p>
                DollorGrows is strongly committed to preventing the use of its operations for money laundering or any activity which facilitates money laundering, or the funding of terrorist or criminal activities. We adhere to strict global AML standards and regulations.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Suspicious Activities</h2>
              <p>
                We continuously monitor user transactions for suspicious behavior. Suspicious activities include, but are not limited to:
              </p>
              <ul>
                <li>Frequent deposits and rapid withdrawals without clear investment purpose.</li>
                <li>Transfers between unverified third parties.</li>
                <li>Attempts to conceal identity or source of funds.</li>
                <li>Transactions involving wallets flagged by global compliance databases.</li>
              </ul>
              <p>
                Any suspicious activity will be investigated and may be reported to relevant law enforcement agencies without prior notice to the user.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Account Freezing</h2>
              <p>
                DollorGrows reserves the right to freeze accounts, halt withdrawals, and block access to funds if an account is under investigation for suspected money laundering, fraud, or violations of this AML policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Compliance Officer</h2>
              <p>
                We have appointed a designated Anti-Money Laundering Compliance Officer (AMLCO) who is responsible for overseeing and ensuring the ongoing compliance of the platform with all relevant AML policies and regulations.
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

        .shape-purple {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%);
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
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }

        .legal-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
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
          color: #8b5cf6;
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
