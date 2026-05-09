export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Sign Up & Verify",
            description: "Create your account and complete the verification process to ensure security.",
            icon: "👤"
        },
        {
            number: "02",
            title: "Choose Investment Plan",
            description: "Select from our range of investment plans based on your risk appetite and goals.",
            icon: "📋"
        },
        {
            number: "03",
            title: "Deposit Funds",
            description: "Add funds to your wallet using secure payment methods (crypto, bank transfer, card).",
            icon: "💰"
        },
        {
            number: "04",
            title: "Start Earning",
            description: "Watch your investments grow with daily returns and compound interest.",
            icon: "📈"
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Getting started with Dollar Growth is simple and straightforward. Follow these four easy steps 
                        to begin your investment journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 h-full">
                                <div className="flex items-center mb-6">
                                    <div className="text-4xl font-bold text-blue-600 mr-4">{step.number}</div>
                                    <div className="text-3xl">{step.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300">
                        Get Started Today
                    </button>
                </div>
            </div>
        </section>
    );
}