'use client';

import React from 'react';

const GetinTouch: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return React.createElement(
    'section',
    { className: 'contact-section' },
    React.createElement(
      'div',
      { className: 'contact-container' },
      React.createElement(
        'div',
        { className: 'contact-content' },
        React.createElement(
          'h2',
          { className: 'contact-title' },
          React.createElement(
            'span',
            null,
            'Get in Touch'
          ),
          ' With Us'
        ),
        React.createElement(
          'p',
          { className: 'contact-subtitle' },
          'Have questions or need assistance? Our team is here to help you with any inquiries about our services, investments, or platform features.'
        ),
        React.createElement(
          'div',
          { className: 'contact-info' },
          React.createElement(
            'div',
            { className: 'contact-item' },
            React.createElement(
              'div',
              { className: 'contact-icon' },
              React.createElement('i', null, '📍')
            ),
            React.createElement(
              'div',
              { className: 'contact-details' },
              React.createElement('h4', null, 'Visit Our Office'),
              React.createElement('p', null, '123 Financial District, New York, NY 10001')
            )
          ),
          React.createElement(
            'div',
            { className: 'contact-item' },
            React.createElement(
              'div',
              { className: 'contact-icon' },
              React.createElement('i', null, '📧')
            ),
            React.createElement(
              'div',
              { className: 'contact-details' },
              React.createElement('h4', null, 'Email Us'),
              React.createElement('p', null, 'support@dollargrowth.com')
            )
          ),
          React.createElement(
            'div',
            { className: 'contact-item' },
            React.createElement(
              'div',
              { className: 'contact-icon' },
              React.createElement('i', null, '📞')
            ),
            React.createElement(
              'div',
              { className: 'contact-details' },
              React.createElement('h4', null, 'Call Us'),
              React.createElement('p', null, '+1 (555) 123-4567')
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'contact-form-wrapper' },
        React.createElement(
          'form',
          { 
            className: 'contact-form',
            onSubmit: handleSubmit
          },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'name', className: 'form-label' },
              'Full Name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'name',
              name: 'name',
              className: 'form-input',
              placeholder: 'Enter your full name',
              required: true
            })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'email', className: 'form-label' },
              'Email Address'
            ),
            React.createElement('input', {
              type: 'email',
              id: 'email',
              name: 'email',
              className: 'form-input',
              placeholder: 'Enter your email address',
              required: true
            })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'subject', className: 'form-label' },
              'Subject'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'subject',
              name: 'subject',
              className: 'form-input',
              placeholder: 'What is this regarding?',
              required: true
            })
          ),
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              'label',
              { htmlFor: 'message', className: 'form-label' },
              'Message'
            ),
            React.createElement('textarea', {
              id: 'message',
              name: 'message',
              className: 'form-textarea',
              placeholder: 'Tell us how we can help you...',
              rows: 5,
              required: true
            })
          ),
          React.createElement(
            'button',
            { 
              type: 'submit',
              className: 'form-button'
            },
            React.createElement('span', null, 'Send Message'),
            React.createElement('i', null, '→')
          )
        )
      )
    )
  );
};

export default GetinTouch;
