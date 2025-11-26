
import React, { useState } from 'react';
import { PhoneIcon, AtSymbolIcon, LocationMarkerIcon, CheckIcon } from './Icons';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here (e.g., API call)
    setIsSubmitted(true);
  };

  const inputClass = "w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all";

  return (
    <section className="mt-16 py-16 bg-gradient-to-br from-purple-700 via-slate-900 to-pink-800 rounded-2xl relative overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-pink-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white tracking-tight">Get In Touch</h2>
                <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                    Have questions or feedback? We'd love to hear from you. Reach out to us, and we'll get back to you shortly.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Contact Form */}
                <div className="bg-black/20 backdrop-blur-lg p-8 rounded-xl border border-white/10">
                    {isSubmitted ? (
                        <div className="text-center py-16 animate-fade-in">
                            <CheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                            <p className="text-gray-300 mt-2">Your message has been sent successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input type="text" id="name" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input type="email" id="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea id="message" placeholder="Your Message" rows={5} value={message} onChange={e => setMessage(e.target.value)} required className={inputClass}></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full py-3 px-4 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                {/* Contact Info */}
                <div className="space-y-8 text-white">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <PhoneIcon className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold">Call Us</h4>
                            <p className="text-gray-300">Mon-Fri from 9am to 5pm.</p>
                            <a href="tel:+911234567890" className="text-lg font-medium text-pink-400 hover:text-pink-300 transition-colors">+91 123-456-7890</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="p-3 bg-white/10 rounded-full">
                            <AtSymbolIcon className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold">Chat With Us</h4>
                            <p className="text-gray-300">Drop us an email anytime.</p>
                            <a href="mailto:contact@eventfinder.app" className="text-lg font-medium text-pink-400 hover:text-pink-300 transition-colors">contact@eventfinder.app</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <LocationMarkerIcon className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold">Visit Us</h4>
                            <p className="text-gray-300">Veer Bahadur Purvanchal University</p>
                            <span className="text-lg font-medium text-pink-400">Jaunpur, Uttar Pradesh</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};
