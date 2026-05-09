import AppLayout from '@/Layouts/AppLayout';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function About() {
    return (
        <AppLayout title="About Us | Dollar Growth">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dollar Growth</span>
                        </h1>
                        
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 mb-6">
                                At Dollar Growth, our mission is to democratize access to sophisticated investment 
                                opportunities. We believe that everyone should have the chance to grow their wealth 
                                through smart, managed investments, regardless of their financial background or 
                                expertise.
                            </p>
                            <p className="text-gray-600">
                                Founded in 2020, we've helped thousands of investors achieve their financial goals 
                                through our carefully curated investment portfolios and expert market analysis.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        <span>Transparency in all operations</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        <span>Security as our top priority</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        <span>Innovation in investment strategies</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-600 mr-2">✓</span>
                                        <span>Customer-centric approach</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Team</h3>
                                <p className="text-gray-600 mb-4">
                                    Our team consists of financial experts, data scientists, and blockchain 
                                    specialists with decades of combined experience in traditional and 
                                    digital finance.
                                </p>
                                <p className="text-gray-600">
                                    We continuously monitor market trends and adjust our strategies to ensure 
                                    optimal returns for our investors.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-900 text-white rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
                                    <div className="text-gray-300">Active Investors</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-400 mb-2">$50M+</div>
                                    <div className="text-gray-300">Assets Managed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400 mb-2">99.8%</div>
                                    <div className="text-gray-300">Uptime & Reliability</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </AppLayout>
    );
}