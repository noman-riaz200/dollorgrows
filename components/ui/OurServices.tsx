'use client';

import React from 'react';

const OurServices: React.FC = () => {
  return (
    <>
      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <p className="subtitle">Unlock financial growth with our Crowdfunding Plans designed for all levels</p>
          <div className="services-grid">
            <div className="service-card">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3>Flexible Plans</h3>
              <p>Investments from $10 to $100,000</p>
            </div>
            <div className="service-card">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <h3>Dual-phase Income</h3>
              <p>Instant and long-term multiplication</p>
            </div>
            <div className="service-card">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              <h3>Referral Rewards</h3>
              <p>Potential earnings of up to $53,836</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .services-section {
          padding: 80px 20px;
          background-color: #f8f9fa;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        h2 {
          font-size: 3rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        .subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .service-card {
          background: white;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .icon {
          width: 60px;
          height: 60px;
          color: #006400; /* dark green */
          margin-bottom: 20px;
        }
        .service-card h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 12px;
        }
        .service-card p {
          font-size: 1rem;
          color: #666;
          line-height: 1.6;
        }
        @media (max-width: 768px) {
          .services-section {
            padding: 60px 20px;
          }
          h2 {
            font-size: 2.5rem;
          }
          .services-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
    </>
  );
};

export default OurServices;

