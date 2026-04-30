"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Fund Grow Online?",
    answer: "Fund Grow Online is a premier investment platform that helps you grow your wealth through smart, diversified investment strategies. We offer curated investment opportunities with transparent returns and professional portfolio management."
  },
  {
    question: "How much do I need to start?",
    answer: "You can start investing with as little as $50. We believe everyone should have access to wealth-building opportunities, which is why we've set our minimum investment threshold low to accommodate investors at all levels."
  },
  {
    question: "How does the referral plan work?",
    answer: "Our referral program rewards you for sharing Fund Grow Online with friends and family. When someone signs up using your unique referral link and makes their first investment, you earn a percentage of their earnings plus bonus rewards based on their investment level."
  },
  {
    question: "How can I withdraw my earnings?",
    answer: "Withdrawing your earnings is simple and secure. Log in to your dashboard, navigate to the 'Withdraw' section, enter the amount you wish to withdraw, and choose your preferred withdrawal method. Funds are typically processed within 1-3 business days."
  },
  {
    question: "Is my investment secure?",
    answer: "Absolutely. We prioritize the security of your investments through industry-leading encryption, secure banking partnerships, and regulatory compliance. Your funds are protected by robust security measures and we're transparent about all investment risks."
  },
  {
    question: "What are the expected returns?",
    answer: "Returns vary based on the investment plan you choose, ranging from 10% to 25% annually. Our platform provides detailed projections and real-time tracking so you can monitor your investment growth."
  },
  {
    question: "Can I withdraw my initial investment?",
    answer: "Yes, you can withdraw your initial investment after the lock-in period specified in your chosen plan. We offer flexible terms to accommodate different investment horizons and financial goals."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, we offer a fully-featured mobile app for both iOS and Android devices. You can manage your investments, track performance, and make withdrawals directly from your mobile device."
  }
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faqs-section">
      <div className="faqs-container">
        <div className="faqs-header">
          <h2 className="faqs-title">
            <span>Frequently Asked</span> Questions
          </h2>
          <p className="faqs-subtitle">
            Find answers to the most common questions about Fund Grow Online and our investment platform
          </p>
        </div>
        
        <div className="faqs-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? "active" : ""}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-icon">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 5V19M5 12H19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p className="faq-cta-text">
            Still have questions? We're here to help!
          </p>
          <a href="/contact" className="faq-cta-button">
            Contact Our Support Team
          </a>
        </div>
      </div>
    </section>
  );
}
