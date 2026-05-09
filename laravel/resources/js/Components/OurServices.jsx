export default function OurServices() {
    const services = [
        {
            title: "Crypto Investment",
            description: "Invest in top cryptocurrencies with our managed portfolios and automated trading strategies.",
            icon: "💰",
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Forex Trading",
            description: "Access global forex markets with expert analysis and automated trading systems.",
            icon: "📈",
            color: "from-green-500 to-emerald-500"
        },
        {
            title: "Stock Market",
            description: "Diversify with stock investments across major global exchanges and sectors.",
            icon: "📊",
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Real Estate",
            description: "Fractional real estate investments with guaranteed returns and property management.",
            icon: "🏠",
            color: "from-orange-500 to-red-500"
        },
        {
            title: "Commodities",
            description: "Invest in gold, silver, oil, and other commodities with secure storage options.",
            icon: "🛢️",
            color: "from-yellow-500 to-amber-500"
        },
        {
            title: "Retirement Plans",
            description: "Long-term retirement investment plans with tax benefits and guaranteed growth.",
            icon: "👴",
            color: "from-indigo-500 to-blue-500"
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Investment Services</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We offer a comprehensive range of investment services designed to maximize your returns 
                        while minimizing risks through diversification and expert management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} text-white text-2xl mb-6`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <button className="mt-6 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                Learn More →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}