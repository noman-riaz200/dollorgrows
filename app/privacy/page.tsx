import React from "react";
import Footer from "@/components/ui/Footer";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="legal-page">
        <div className="bg-shape shape-cyan"></div>
        
        <div className="container">
          <div className="legal-header">
            <div className="icon-wrap">
              <ShieldAlert size={32} />
            </div>
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-updated">Last Updated: May 2026</p>
          </div>

          <div className="legal-content-card">
            <section className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to DollorGrows. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. The Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul>
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Financial Data:</strong> includes wallet addresses and transaction history on our platform.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul>
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
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

        .shape-cyan {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.5) 0%, transparent 70%);
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
          background: rgba(0, 210, 255, 0.1);
          color: #00d2ff;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);
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
          color: #00d2ff;
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
