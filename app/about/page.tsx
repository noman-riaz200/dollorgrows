import React from "react";
import Footer from "@/components/ui/Footer";
import { Users, TrendingUp, ShieldCheck, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="bg-shape shape-left"></div>
          <div className="bg-shape shape-right"></div>
          <div className="container">
            <h1 className="hero-title">
              About <span className="text-glow-cyan">DollorGrows</span>
            </h1>
            <p className="hero-subtitle">
              Empowering global investors with cutting-edge network marketing
              and transparent, high-yield investment pools.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section container">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              At DollorGrows, our mission is to democratize wealth creation. We believe that financial freedom shouldn't be limited to the privileged few. By combining the power of network marketing with strategic investment pools, we provide a reliable, scalable, and secure pathway for everyone to grow their capital.
            </p>
            <p className="section-text">
              We leverage advanced analytics, secure blockchain principles, and a dedicated team of financial experts to ensure that every dollar you invest works tirelessly for your future.
            </p>
          </div>
          <div className="mission-image">
            <div className="image-placeholder glow-cyan-sm">
              <TrendingUp size={64} className="mission-icon" />
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="values-section bg-secondary">
          <div className="container">
            <h2 className="section-title text-center">Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <ShieldCheck size={32} />
                </div>
                <h3>Transparency & Trust</h3>
                <p>We operate with complete openness, ensuring your funds are secure and returns are always clearly reported.</p>
              </div>
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <Users size={32} />
                </div>
                <h3>Community First</h3>
                <p>Our network marketing approach ensures that as the platform grows, our community members reap the highest rewards.</p>
              </div>
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <Globe size={32} />
                </div>
                <h3>Global Reach</h3>
                <p>No matter where you are in the world, DollorGrows provides accessible financial tools to help you succeed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .about-page {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          overflow-x: hidden;
          padding-top: 80px; /* Offset for navbar */
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Abstract Background Shapes */
        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.4;
        }

        .shape-left {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.3) 0%, transparent 70%);
          top: -100px;
          left: -150px;
        }

        .shape-right {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 70%);
          bottom: -200px;
          right: -150px;
        }

        /* Hero Section */
        .about-hero {
          position: relative;
          text-align: center;
          padding: 6rem 0;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .text-glow-cyan {
          color: #00d2ff;
          text-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Mission Section */
        .mission-section {
          display: flex;
          align-items: center;
          gap: 4rem;
          padding: 6rem 1.5rem;
          position: relative;
          z-index: 1;
        }

        .mission-content {
          flex: 1;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .text-center {
          text-align: center;
        }

        .section-text {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .mission-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .image-placeholder {
          width: 100%;
          max-width: 400px;
          aspect-ratio: 1;
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
        }
        
        .image-placeholder::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: calc(var(--radius-xl) + 2px);
          background: var(--accent-gradient);
          z-index: -1;
          opacity: 0.3;
        }

        .mission-icon {
          color: #00d2ff;
        }

        /* Values Section */
        .bg-secondary {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .values-section {
          padding: 6rem 0;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .value-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 210, 255, 0.1);
          border-color: rgba(0, 210, 255, 0.3);
        }

        .value-icon-wrapper {
          width: 64px;
          height: 64px;
          background: rgba(0, 210, 255, 0.1);
          color: #00d2ff;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .value-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .value-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .mission-section {
            flex-direction: column;
            text-align: center;
            gap: 3rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
      `}} />
    </>
  );
}
