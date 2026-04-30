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
    { className: 'getintouch-section' },
    React.createElement(
      'div',
      { className: 'getintouch-overlay' },
      React.createElement(
        'div',
        { className: 'getintouch-container' },
        React.createElement(
          'div',
          { className: 'getintouch-content' },
          React.createElement(
            'div',
            { className: 'getintouch-text' },
            React.createElement(
              'h2',
              { className: 'getintouch-title' },
              'Get in touch'
            ),
            React.createElement(
              'p',
              { className: 'getintouch-subtitle' },
              'Feel free to contact us and we will get back to you as soon as possible'
            )
          ),
          React.createElement(
            'div',
            { className: 'getintouch-form-wrapper' },
            React.createElement(
              'form',
              { 
                className: 'getintouch-form',
                onSubmit: handleSubmit
              },
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                  'label',
                  { htmlFor: 'name', className: 'form-label' },
                  'Name'
                ),
                React.createElement('input', {
                  type: 'text',
                  id: 'name',
                  name: 'name',
                  className: 'form-input',
                  placeholder: 'Enter your name',
                  required: true
                })
              ),
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                  'label',
                  { htmlFor: 'email', className: 'form-label' },
                  'E-mail'
                ),
                React.createElement('input', {
                  type: 'email',
                  id: 'email',
                  name: 'email',
                  className: 'form-input',
                  placeholder: 'Enter your email',
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
                  placeholder: 'Enter your message',
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
                'Send'
              )
            )
          )
        )
      )
    )
  );
};

export default GetinTouch;
