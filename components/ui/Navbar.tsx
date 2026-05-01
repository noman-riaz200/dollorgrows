"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-brand-icon" aria-hidden="true">
            $
          </span>
          <span className="navbar-brand-text">DollarGrowth</span>
        </Link>

        <button
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`nav-menu-overlay ${isMenuOpen ? "active" : ""}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar-link ${
                  pathname === link.href ? "active" : ""
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <Link
            href="/auth/signin"
            className="navbar-btn navbar-btn-signin navbar-btn-sm"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="navbar-btn navbar-btn-signup navbar-btn-sm"
            onClick={closeMenu}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
