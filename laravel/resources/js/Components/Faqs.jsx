import { useState } from 'react';

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is Dollar Growth?",
            answer: "Dollar Growth is a premier investment platform that offers managed investment services across various asset classes including cryptocurrencies, forex, stocks, and real estate. We use advanced algorithms and expert management to maximize returns for our investors."
        },
        {
            question: "How much can I earn?",
            answer: "Returns vary based on the investment plan you choose. Our plans offer daily returns ranging from 10% to 25% depending on the investment amount and duration. Historical performance data is available in your dashboard."
        },
        {
            question: "Is my investment secure?",
            answer: "Yes, we employ bank-level security measures including SSL encryption, two-factor authentication, and cold storage for cryptocurrencies. All transactions are monitored 24/7 by our security team."
        },
        {
            question: "How do I withdraw my profits?",
            answer: "You can withdraw your profits anytime through your dashboard. Withdrawal requests are processed within 24 hours for most payment methods. There are no hidden fees for withdrawals."
        },
        {
            question: "What is the minimum investment?",
            answer: "The minimum investment varies by plan, starting from as low as $50 for our basic plan. You can start small and increase your investment as you become more comfortable with the platform."
        },
        {
            question: "Do you offer customer support?",
            answer: "Yes, we offer 24/7 customer support through live chat, email, and phone. Our support team is available to assist you with any questions or issues you may encounter."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our platform, investment process, security, and more.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                                    <span className="text-blue-600 text-xl">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </div>
                                {openIndex === index && (
                                    <p className="mt-4 text-gray-600">{faq.answer}</p>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Still have questions? We're here to help!
                    </p>
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300">
                        Contact Support
                    </button>
                </div>
            </div>
        </section>
    );
}