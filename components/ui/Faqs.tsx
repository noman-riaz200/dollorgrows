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
          <h2 className="faqs-title">FAQs</h2>
          <p className="faqs-subtitle">
            Find answers to the most common questions about Fund Grow Online
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
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .faqs-section {
          background-color: #f8f9fa;
          padding: 80px 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faqs-container {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        .faqs-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .faqs-title {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .faqs-subtitle {
          font-size: 18px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .faqs-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.3s ease;
        }

        .faq-item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .faq-item.active {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s ease;
        }

        .faq-question:hover {
          background-color: #fafafa;
        }

        .faq-question-text {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          flex: 1;
          padding-right: 16px;
        }

        .faq-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #e8f5e9;
          color: #2e7d32;
          flex-shrink: 0;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .faq-item.active .faq-icon {
          transform: rotate(45deg);
          background-color: #2e7d32;
          color: #ffffff;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .faq-item.active .faq-answer {
          max-height: 300px;
        }

        .faq-answer p {
          padding: 0 28px 24px 28px;
          margin: 0;
          font-size: 16px;
          line-height: 1.7;
          color: #555;
        }

        @media (max-width: 768px) {
          .faqs-section {
            padding: 60px 16px;
          }

          .faqs-title {
            font-size: 36px;
          }

          .faqs-subtitle {
            font-size: 16px;
          }

          .faq-question {
            padding: 20px 24px;
          }

          .faq-question-text {
            font-size: 16px;
          }

          .faq-answer p {
            padding: 0 24px 20px 24px;
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
}
