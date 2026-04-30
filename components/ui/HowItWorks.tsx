import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: '🚀',
      title: 'Sign Up & Choose Pool',
      desc: 'Create your account in seconds and select the perfect community pool that matches your growth goals.'
    },
    {
      number: '02',
      icon: '💰',
      title: 'Contribute to Pool',
      desc: 'Add your resources to our shared community pool where collective power creates exponential opportunities.'
    },
    {
      number: '03',
      icon: '📈',
      title: 'Fund Multiplication',
      desc: 'Watch your contributions multiply through our proven multiplication strategies and smart algorithms.'
    },
    {
      number: '04',
      icon: '👥',
      title: 'Invite & Earn Bonuses',
      desc: 'Grow your network by inviting others and unlock generous referral bonuses at every level.'
    },
    {
      number: '05',
      icon: '⚡',
      title: 'Quick Withdrawals',
      desc: 'Access your earnings anytime with our lightning-fast withdrawal system for true financial freedom.'
    }
  ];

  return (
    <section className="how-section">
      <div className="how-container">
        <div className="how-header">
          <h2 className="how-title">
            <span>How It</span> Works
          </h2>
          <p className="how-desc">
            A simple, scalable, and transparent journey to financial success in just 5 easy steps
          </p>
        </div>

        <div className="how-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className="how-step"
            >
              <div className="how-step-number">{step.number}</div>
              <div className="how-step-icon">
                <span>{step.icon}</span>
              </div>
              <h3 className="how-step-title">
                {step.title}
              </h3>
              <p className="how-step-desc">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <a href="/auth/register" className="how-cta">
          Start Your Journey Now
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;
