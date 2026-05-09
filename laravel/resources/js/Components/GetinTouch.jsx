import { useState } from 'react';

export default function GetinTouch() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, this would submit to a Laravel endpoint
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Touch</span>
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Have questions about our investment platform? Our team is here to help you 
                            get started and answer any questions you may have about our services.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <span className="text-blue-600 text-xl">📧</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Email Support</h4>
                                    <p className="text-gray-600">support@dollorgrows.com</p>
                                    <p className="text-sm text-gray-500">Response time: Within 24 hours</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                    <span className="text-purple-600 text-xl">💬</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Live Chat</h4>
                                    <p className="text-gray-600">Available 24/7</p>
                                    <p className="text-sm text-gray-500">Click the chat icon in the bottom right</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="bg-green-100 p-3 rounded-lg mr-4">
                                    <span className="text-green-600 text-xl">📞</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Phone Support</h4>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Tell us about your inquiry..."
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}