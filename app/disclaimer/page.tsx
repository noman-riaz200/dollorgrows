import React from "react";
import Footer from "@/components/ui/Footer";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <>
      <main className="legal-page">
        <div className="bg-shape shape-orange"></div>
        
        <div className="container">
          <div className="legal-header">
            <div className="icon-wrap">
              <AlertTriangle size={32} />
            </div>
            <h1 className="legal-title">Risk Disclaimer</h1>
            <p className="legal-updated">Last Updated: May 2026</p>
          </div>

          <div className="legal-content-card">
            <section className="legal-section">
              <h2>1. High Risk Investment</h2>
              <p>
                Trading and investing in cryptocurrency and our investment pools involves a high degree of risk and may not be suitable for all investors. The high degree of leverage and market volatility can work against you as well as for you. Before deciding to invest, you should carefully consider your investment objectives, level of experience, and risk appetite.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. No Guarantees</h2>
              <p>
                DollorGrows makes no guarantees or representations regarding the future performance of your investments. Past performance is not indicative of future results. Any earnings, yield percentages, or returns stated on our website or promotional materials are estimates based on historical data and projected algorithms, and should not be construed as guaranteed returns.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Loss of Capital</h2>
              <p>
                There is a possibility that you may sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with cryptocurrency investing and network marketing matrices.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Information Accuracy</h2>
              <p>
                The information provided on this platform is for educational and informational purposes only and should not be considered financial advice. DollorGrows does not guarantee the accuracy, completeness, or timeliness of the information. Always consult with a qualified financial advisor before making investment decisions.
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

        .shape-orange {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%);
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
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
        }

        .legal-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
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
