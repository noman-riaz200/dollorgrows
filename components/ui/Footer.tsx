import React from 'react';

const Footer: React.FC = () => {
  // Styles object for Vanilla CSS approach
  const styles = {
    section: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '60px 20px 30px',
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '40px',
    },
    leftSection: {
      flex: '1 1 250px',
      minWidth: '200px',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '20px',
      display: 'block',
    },
    socialIcons: {
      display: 'flex',
      gap: '15px',
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#333333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '18px',
    },
    middleSection: {
      flex: '2 1 400px',
      display: 'flex',
      gap: '60px',
      justifyContent: 'center',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    columnTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#ffffff',
    },
    link: {
      color: '#b3b3b3',
      textDecoration: 'none',
      fontSize: '15px',
      transition: 'color 0.3s ease',
    },
    rightSection: {
      flex: '1 1 300px',
      minWidth: '250px',
    },
    newsletterTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    newsletterText: {
      color: '#b3b3b3',
      fontSize: '14px',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    input: {
      flex: '1 1 200px',
      padding: '12px 16px',
      borderRadius: '5px',
      border: '1px solid #444444',
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#4CAF50',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    bottom: {
      borderTop: '1px solid #333333',
      marginTop: '50px',
      paddingTop: '25px',
      textAlign: 'center',
      color: '#b3b3b3',
      fontSize: '14px',
    },
  };

  return React.createElement(
    'footer',
    { style: styles.section },
    React.createElement(
      'div',
      { style: styles.container },
      // Left Section - Logo and Social Media
      React.createElement(
        'div',
        { style: styles.leftSection },
        React.createElement(
          'span',
          { style: styles.logo },
          'Fund Grow Online'
        ),
        React.createElement(
          'div',
          { style: styles.socialIcons },
          React.createElement(
            'a',
            { 
              href: '#', 
              style: styles.socialIcon,
              title: 'Facebook'
            },
            'f'
          ),
          React.createElement(
            'a',
            { 
              href: '#', 
              style: styles.socialIcon,
              title: 'Twitter'
            },
            't'
          ),
          React.createElement(
            'a',
            { 
              href: '#', 
              style: styles.socialIcon,
              title: 'Instagram'
            },
            'i'
          ),
          React.createElement(
            'a',
            { 
              href: '#', 
              style: styles.socialIcon,
              title: 'LinkedIn'
            },
            'in'
          )
        )
      ),
      // Middle Section - Two Columns
      React.createElement(
        'div',
        { style: styles.middleSection },
        // Column 1: Our Resources
        React.createElement(
          'div',
          { style: styles.column },
          React.createElement(
            'h4',
            { style: styles.columnTitle },
            'Our Resources'
          ),
          React.createElement('a', { href: '#', style: styles.link }, 'Home'),
          React.createElement('a', { href: '#', style: styles.link }, 'About Us'),
          React.createElement('a', { href: '#', style: styles.link }, 'Services'),
          React.createElement('a', { href: '#', style: styles.link }, 'Contact Us')
        ),
        // Column 2: Legal
        React.createElement(
          'div',
          { style: styles.column },
          React.createElement(
            'h4',
            { style: styles.columnTitle },
            'Legal'
          ),
          React.createElement('a', { href: '#', style: styles.link }, 'Privacy Policy'),
          React.createElement('a', { href: '#', style: styles.link }, 'Terms of Service')
        )
      ),
      // Right Section - Newsletter
      React.createElement(
        'div',
        { style: styles.rightSection },
        React.createElement(
          'h4',
          { style: styles.newsletterTitle },
          'Newsletter'
        ),
        React.createElement(
          'p',
          { style: styles.newsletterText },
          'Subscribe to get the latest updates and offers.'
        ),
        React.createElement(
          'form',
          { style: styles.form },
          React.createElement('input', {
            type: 'email',
            placeholder: 'Enter your email',
            style: styles.input,
            required: true,
          }),
          React.createElement(
            'button',
            { type: 'submit', style: styles.button },
            'Subscribe'
          )
        )
      )
    ),
    // Bottom - Copyright
    React.createElement(
      'div',
      { style: styles.bottom },
      '© 2025 Fund Grow Online. All rights reserved.'
    )
  );
};

export default Footer;
