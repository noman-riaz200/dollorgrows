"use client";

import React, { useState } from "react";
import Footer from "@/components/ui/Footer";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <>
      <main className="contact-page">
        <div className="bg-shape shape-purple"></div>

        <section className="contact-hero">
          <div className="container text-center">
            <h1 className="hero-title">
              Get in <span className="text-glow-purple">Touch</span>
            </h1>
            <p className="hero-subtitle">
              Have questions about our investment pools or need support? Our team is here to help you grow.
            </p>
          </div>
        </section>

        <section className="contact-content">
          <div className="container contact-grid">
            
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p className="info-desc">
                Fill out the form and our team will get back to you within 24 hours. We're dedicated to your success.
              </p>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3>Email Us</h3>
                    <p>support@dollorgrows.com</p>
                    <p>invest@dollorgrows.com</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3>Call Us</h3>
                    <p>+1 (555) 123-4567</p>
                    <p>Mon-Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3>Headquarters</h3>
                    <p>123 Financial District,</p>
                    <p>New York, NY 10004</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Send a Message</h2>
                
                {isSuccess ? (
                  <div className="success-message">
                    <div className="success-icon-wrap">
                      <Send size={32} />
                    </div>
                    <h3>Message Sent!</h3>
                    <p>We've received your inquiry and will contact you shortly.</p>
                    <button 
                      type="button" 
                      className="reset-btn"
                      onClick={() => setIsSuccess(false)}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" required className="form-input" placeholder="John" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" required className="form-input" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" required className="form-input" placeholder="john@example.com" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <select id="subject" className="form-input form-select" required>
                        <option value="">Select a topic...</option>
                        <option value="investment">Investment Pools</option>
                        <option value="network">Network/Referrals</option>
                        <option value="support">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea id="message" rows={5} required className="form-input form-textarea" placeholder="How can we help you?"></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="spinner" size={20} />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
            
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-page {
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
          opacity: 0.25;
        }

        .shape-purple {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
          top: -100px;
          right: -200px;
        }

        /* Hero */
        .contact-hero {
          padding: 5rem 0 3rem;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .text-glow-purple {
          color: #8b5cf6;
          text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Content Grid */
        .contact-content {
          padding: 3rem 0 8rem;
          position: relative;
          z-index: 1;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: flex-start;
        }

        .contact-info h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .info-desc {
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.15);
        }

        .info-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .info-card p {
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        /* Form Wrapper */
        .contact-form-wrapper {
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition, all 0.3s ease);
          outline: none;
        }

        .form-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Success Message */
        .success-message {
          text-align: center;
          padding: 2rem 0;
          animation: fadeIn 0.5s ease;
        }

        .success-icon-wrap {
          width: 64px;
          height: 64px;
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .success-message h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .success-message p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .reset-btn {
          background: transparent;
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          background: var(--bg-primary);
          border-color: var(--text-secondary);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .contact-info {
            text-align: center;
          }
          
          .info-cards {
            align-items: center;
          }
          
          .info-card {
            text-align: left;
            width: 100%;
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .contact-form-wrapper {
            padding: 2rem 1.5rem;
          }
          .form-row {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}} />
    </>
  );
}
