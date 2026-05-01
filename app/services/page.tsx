import React from "react";
import Footer from "@/components/ui/Footer";
import { Layers, Zap, LineChart, Shield, Lock, Wallet } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: <Layers size={32} />,
      title: "BFS Matrix System",
      description: "Our proprietary Breadth-First Search matrix ensures fair and rapid network growth, rewarding active referrers instantly.",
    },
    {
      icon: <LineChart size={32} />,
      title: "High-Yield Investment Pools",
      description: "Access curated investment pools with transparent daily returns ranging from conservative to aggressive growth profiles.",
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Commissions",
      description: "No waiting for payouts. Earn and withdraw your network commissions instantly to your secure digital wallet.",
    },
    {
      icon: <Wallet size={32} />,
      title: "Multi-Wallet Management",
      description: "Easily track and transfer funds between your Balance Wallet, Pool Wallet, and Commission Wallet in one unified dashboard.",
    },
    {
      icon: <Shield size={32} />,
      title: "Risk Mitigation",
      description: "Advanced algorithms and diversified asset allocation protect your core investments against market volatility.",
    },
    {
      icon: <Lock size={32} />,
      title: "Enterprise Security",
      description: "Bank-grade encryption, two-factor authentication, and cold storage protocols keep your assets and data strictly protected.",
    },
  ];

  return (
    <>
      <main className="services-page">
        <div className="bg-shape shape-top"></div>
        
        <section className="services-hero">
          <div className="container text-center">
            <h1 className="hero-title">
              Our <span className="text-glow-green">Services</span>
            </h1>
            <p className="hero-subtitle">
              Comprehensive financial solutions designed to maximize your earning potential through smart investments and network building.
            </p>
          </div>
        </section>

        <section className="services-grid-section">
          <div className="container">
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    {service.icon}
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.description}</p>
                  <div className="service-hover-bar"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="cta-section">
          <div className="container text-center">
            <div className="cta-box">
              <h2>Ready to accelerate your financial growth?</h2>
              <p>Join thousands of investors worldwide and start earning today.</p>
              <a href="/auth/register" className="cta-button">Create Free Account</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .services-page {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
          padding-top: 80px;
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .text-center {
          text-align: center;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          opacity: 0.3;
        }

        .shape-top {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.25) 0%, transparent 70%);
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Hero */
        .services-hero {
          padding: 6rem 0 4rem;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .text-glow-green {
          color: #00ff88;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Services Grid */
        .services-grid-section {
          padding: 2rem 0 6rem;
          position: relative;
          z-index: 1;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .service-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 255, 136, 0.4);
        }

        .service-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 210, 255, 0.1));
          color: #00ff88;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .service-desc {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .service-hover-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 0%;
          background: var(--accent-gradient);
          transition: width 0.4s ease;
        }

        .service-card:hover .service-hover-bar {
          width: 100%;
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 0 8rem;
          position: relative;
          z-index: 1;
        }

        .cta-box {
          background: linear-gradient(to right, rgba(0, 210, 255, 0.05), rgba(0, 255, 136, 0.05));
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: var(--radius-xl);
          padding: 4rem 2rem;
          backdrop-filter: blur(10px);
        }

        .cta-box h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-box p {
          color: var(--text-secondary);
          font-size: 1.15rem;
          margin-bottom: 2.5rem;
        }

        .cta-button {
          display: inline-block;
          background: var(--accent-gradient);
          color: #000;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(0, 255, 136, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 255, 136, 0.4);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .cta-box {
            padding: 3rem 1.5rem;
          }
          .cta-box h2 {
            font-size: 1.75rem;
          }
        }
      `}} />
    </>
  );
}
