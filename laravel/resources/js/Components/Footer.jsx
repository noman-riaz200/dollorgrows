import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center mb-6">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl mr-3">
                                $
                            </span>
                            <span className="text-2xl font-bold">DollarGrowth</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Premier investment platform with advanced growth strategies and secure returns. 
                            Where your investments multiply.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="text-xl">📘</span>
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="text-xl">🐦</span>
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="text-xl">📷</span>
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                                <span className="text-xl">💼</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</Link></li>
                            <li><Link href="/kyc" className="text-gray-400 hover:text-white transition-colors">KYC Policy</Link></li>
                            <li><Link href="/aml" className="text-gray-400 hover:text-white transition-colors">AML Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start">
                                <span className="mr-3">📍</span>
                                <span>123 Financial District, New York, NY 10005, USA</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3">📧</span>
                                <span>support@dollorgrows.com</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3">📞</span>
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3">🕒</span>
                                <span>24/7 Support Available</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {currentYear} Dollar Growth. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm text-gray-400">
                            <span>Registered with FINRA</span>
                            <span>•</span>
                            <span>SSL Secured</span>
                            <span>•</span>
                            <span>GDPR Compliant</span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-4 text-center">
                        Investment involves risk. Past performance is not indicative of future results. 
                        Please read our Risk Disclosure before investing.
                    </p>
                </div>
            </div>
        </footer>
    );
}