import React from 'react';

export default function Hero() {
  return React.createElement(
    'section',
    { className: 'hero-section' },
    React.createElement(
      'div',
      { className: 'hero-container' },
      React.createElement(
        'div',
        { className: 'hero-content-left' },
        React.createElement(
          'h1',
          { className: 'hero-headline' },
          'Fund Grow Online: The Smarter Way to Fund, Grow & Succeed'
        ),
        React.createElement(
          'p',
          { className: 'hero-description' },
          'Join a global crowdfunding ecosystem designed for financial freedom, transparency, and growth.'
        ),
        React.createElement(
          'div',
          { className: 'hero-button-wrapper' },
          React.createElement(
            'a',
            { 
              href: '/auth/register',
              className: 'hero-button'
            },
            'Registration'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'hero-content-right' },
        React.createElement(
          'div',
          { className: 'smartphone-mockup' },
          React.createElement(
            'div',
            { className: 'smartphone-screen' },
            React.createElement(
              'div',
              { className: 'financial-data' },
              React.createElement(
                'div',
                { className: 'data-row' },
                React.createElement(
                  'span',
                  { className: 'data-label' },
                  'Balance:'
                ),
                React.createElement(
                  'span',
                  { className: 'data-value' },
                  '$12,450.20'
                )
              ),
              React.createElement(
                'div',
                { className: 'data-row' },
                React.createElement(
                  'span',
                  { className: 'data-label' },
                  'Growth:'
                ),
                React.createElement(
                  'span',
                  { className: 'data-value positive' },
                  '+18.5%'
                )
              ),
              React.createElement(
                'div',
                { className: 'data-row' },
                React.createElement(
                  'span',
                  { className: 'data-label' },
                  'ROI:'
                ),
                React.createElement(
                  'span',
                  { className: 'data-value' },
                  '12.3%'
                )
              )
            )
          )
        )
      )
    )
  );
}

