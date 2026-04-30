'use client';

import React from 'react';

const OurServices: React.FC = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">
            <span>Our Premium</span> Services
          </h2>
          <p className="services-subtitle">
            Unlock financial growth with our comprehensive suite of investment solutions designed for maximum returns and security
          </p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-wrapper">
              <svg className="service-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="service-card-title">Flexible Investment Plans</h3>
            <p className="service-card-desc">
              Choose from a wide range of investment options from $10 to $100,000 with customizable terms and competitive returns.
            </p>
            <ul className="service-features">
              <li>Daily profit withdrawals</li>
              <li>Compound interest options</li>
              <li>Risk management tools</li>
              <li>Portfolio diversification</li>
            </ul>
            <a href="/dashboard/plans" className="service-cta">
              Explore Plans
            </a>
          </div>
          
          <div className="service-card">
            <div className="service-icon-wrapper">
              <svg className="service-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <h3 className="service-card-title">Dual-phase Income System</h3>
            <p className="service-card-desc">
              Earn both instant returns and long-term growth through our innovative dual-phase income distribution model.
            </p>
            <ul className="service-features">
              <li>Instant daily profits</li>
              <li>Long-term capital growth</li>
              <li>Automatic reinvestment</li>
              <li>Performance bonuses</li>
            </ul>
            <a href="/dashboard" className="service-cta">
              Start Earning
            </a>
          </div>
          
          <div className="service-card">
            <div className="service-icon-wrapper">
              <svg className="service-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </div>
            <h3 className="service-card-title">Referral & Team Rewards</h3>
            <p className="service-card-desc">
              Build your network and earn substantial rewards through our multi-level referral program with unlimited earning potential.
            </p>
            <ul className="service-features">
              <li>Multi-level commissions</li>
              <li>Team performance bonuses</li>
              <li>Leadership rewards</li>
              <li>Weekly payout system</li>
            </ul>
            <a href="/dashboard/referrals" className="service-cta">
              Build Your Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
