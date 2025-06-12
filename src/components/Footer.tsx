import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Ahead of Fashion Trends
          </h3>
          {/* <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Get the latest AI fashion insights, design tips, and exclusive features delivered to your inbox
          </p> */}
          
          {/* <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Subscribe
              </button>
            </div>
          </form> */}
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CoutureAI</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Revolutionizing fashion design with AI technology. Transform your creative vision into stunning, wearable art.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="bg-gray-800 hover:bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['How It Works', 'Gallery', 'Pricing', 'API Access', 'Mobile App'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-400 text-center">
              © 2025 CoutureAI. All rights reserved. Made with{' '}
              <Heart className="w-4 h-4 inline text-red-500" />
              {' '}for fashion innovators.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}