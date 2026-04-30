"use client";

import { useState } from 'react';
import { NeonButton } from "./NeonButton";
import Link from "next/link";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="beautiful-navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          Dollar Growth
        </Link>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link href="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link href="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>Services</Link></li>
          <li><Link href="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        </ul>

        <div className="nav-actions">
          <NeonButton variant="green" size="md">Sign In</NeonButton>
          <NeonButton variant="green" size="md">Sign Up</NeonButton>
        </div>
      </div>
    </nav>
  );
}

