import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide navbar on dashboard routes
    if (url.startsWith('/dashboard')) {
        return null;
    }

    const toggleMenu = () => setIsMenuOpen(v => !v);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl">
                            $
                        </span>
                        <span className="text-2xl font-bold text-gray-800">DollarGrowth</span>
                    </Link>

                    <button
                        className={`md:hidden hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="block w-6 h-0.5 bg-gray-800 mb-1.5 transition-transform" />
                        <span className="block w-6 h-0.5 bg-gray-800 mb-1.5 transition-opacity" />
                        <span className="block w-6 h-0.5 bg-gray-800 transition-transform" />
                    </button>

                    <div className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${
                        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`} onClick={closeMenu} />

                    <ul className={`md:flex md:items-center md:space-x-8 fixed md:static top-0 left-0 right-0 md:w-auto h-screen md:h-auto bg-white md:bg-transparent z-50 transition-transform duration-300 ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}>
                        <div className="flex justify-between items-center p-4 md:hidden">
                            <span className="text-xl font-bold">Menu</span>
                            <button onClick={closeMenu} className="text-2xl">×</button>
                        </div>
                        {navLinks.map((link) => (
                            <li key={link.href} className="border-b md:border-0">
                                <Link
                                    href={link.href}
                                    className={`block py-4 px-6 md:py-2 md:px-0 text-lg md:text-base ${
                                        url === link.href 
                                            ? 'text-blue-600 font-semibold' 
                                            : 'text-gray-700 hover:text-blue-600'
                                    }`}
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <div className="mt-8 md:mt-0 md:ml-8 space-x-4 p-4 md:p-0">
                            <Link
                                href="/login"
                                className="inline-block px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                onClick={closeMenu}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                onClick={closeMenu}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    );
}