import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
            <div className="container relative mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Investments</span> with Confidence
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Premier investment platform with advanced growth strategies and secure returns. 
                        Dollar Growth - Where your investments multiply.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Start Investing Now
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-3xl font-bold text-blue-600 mb-2">10-25%</div>
                        <div className="text-gray-700 font-medium">Daily Returns</div>
                        <p className="text-gray-500 text-sm mt-2">Consistent profit on your investments</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                        <div className="text-gray-700 font-medium">Support</div>
                        <p className="text-gray-500 text-sm mt-2">Round-the-clock customer assistance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-3xl font-bold text-green-600 mb-2">Secure</div>
                        <div className="text-gray-700 font-medium">Transactions</div>
                        <p className="text-gray-500 text-sm mt-2">Bank-level security for all operations</p>
                    </div>
                </div>
            </div>
        </section>
    );
}