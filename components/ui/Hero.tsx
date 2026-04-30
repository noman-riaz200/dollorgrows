import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Fund Grow Online: The Smarter Way to Fund, Grow & Succeed
          </h1>
          <p className="hero-subtitle">
            Join a global crowdfunding ecosystem designed for financial freedom, transparency, and growth.
            Start with as little as $10 and watch your investments multiply.
          </p>
          <div className="hero-buttons">
            <Link href="/auth/register" className="hero-btn hero-btn-primary">
              Get Started Free
            </Link>
            <Link href="/dashboard" className="hero-btn hero-btn-secondary">
              Explore Dashboard
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">10,000+</span>
              <span className="hero-stat-label">Active Investors</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">98%</span>
              <span className="hero-stat-label">Success Rate</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">24/7</span>
              <span className="hero-stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-mockup">
            <div className="hero-screen">
              <div className="financial-data">
                <div className="data-row">
                  <span className="data-label">Balance:</span>
                  <span className="data-value">$12,450.20</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Growth:</span>
                  <span className="data-value positive">+18.5%</span>
                </div>
                <div className="data-row">
                  <span className="data-label">ROI:</span>
                  <span className="data-value">12.3%</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Daily Profit:</span>
                  <span className="data-value positive">+$42.80</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
