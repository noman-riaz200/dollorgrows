import React from 'react';
import { cn } from '@/lib/utils';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: '✓',
      title: 'Sign Up & Choose Pool',
      desc: 'Create your account in seconds and select the perfect community pool that matches your growth goals.'
    },
    {
      icon: '💰',
      title: 'Contribute to Pool',
      desc: 'Add your resources to our shared community pool where collective power creates exponential opportunities.'
    },
    {
      icon: '📈',
      title: 'Fund Multiplication',
      desc: 'Watch your contributions multiply through our proven multiplication strategies and smart algorithms.'
    },
    {
      icon: '👥',
      title: 'Invite & Earn Bonuses',
      desc: 'Grow your network by inviting others and unlock generous referral bonuses at every level.'
    },
    {
      icon: '⚡',
      title: 'Quick Withdrawals',
      desc: 'Access your earnings anytime with our lightning-fast withdrawal system for true financial freedom.'
    }
  ];

  return (
    <section className="how-it-works-section py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Decorative top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Title & Subtitle */}
        <div className="text-center mb-20">
          <h2 className="how-title font-black text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-gray-900 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
            HOW IT WORKS
          </h2>
          <p className="how-subtitle text-xl md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto">
            HOW IT WORKS
          </p>
        </div>

        {/* 5 Column Steps Grid */}
        <div className="steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-column group p-8 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden cursor-pointer"
            >
              {/* Green Glow Icon */}
              <div className="step-icon w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-2xl glow-mint flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                <span className="text-white font-bold">{step.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="step-title text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center leading-tight">
                {step.title}
              </h3>
              <p className="step-desc text-gray-600 leading-relaxed text-center text-base md:text-lg">
                {step.desc}
              </p>
              
              {/* Top progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </div>
          ))}
        </div>

        {/* Bottom Journey Text */}
        <div className="journey-text text-center">
          <p className="text-2xl md:text-3xl font-medium text-slate-600 italic max-w-4xl mx-auto px-6 py-12 border-t-2 border-dashed border-slate-300 rounded-3xl bg-gradient-to-r from-emerald-50/50 to-blue-50/50 backdrop-blur-sm">
            A SIMPLE, SCALABLE, AND TRANSPARENT JOURNEY TO SUCCESS
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

