import React from "react";
import Footer from "@/components/ui/Footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <main className="legal-page">
        <div className="bg-shape shape-green"></div>
        
        <div className="container">
          <div className="legal-header">
            <div className="icon-wrap">
              <FileText size={32} />
            </div>
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-updated">Last Updated: May 2026</p>
          </div>

          <div className="legal-content-card">
            <section className="legal-section">
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using DollorGrows, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on DollorGrows for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <p>Under this license you may not:</p>
              <ul>
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on DollorGrows;</li>
                <li>Remove any copyright or other proprietary notations from the materials;</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Investments and Earnings</h2>
              <p>
                All investments carry risk. DollorGrows provides investment pools and network marketing matrices. Historical returns or stated percentages are not guarantees of future performance. You acknowledge that you can lose part or all of your deposited capital.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Account Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password, including two-factor authentication. You agree to accept responsibility for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or remove content in our sole discretion if we suspect unauthorized or illegal activity.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Limitations</h2>
              <p>
                In no event shall DollorGrows or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DollorGrows's website, even if DollorGrows or a DollorGrows authorized representative has been notified orally or in writing of the possibility of such damage.
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

        .shape-green {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.5) 0%, transparent 70%);
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
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }

        .legal-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: var(--accent-gradient);
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
          color: #00ff88;
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
