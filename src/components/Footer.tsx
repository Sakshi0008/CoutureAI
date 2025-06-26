import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  scrollToSection: (sectionId: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
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
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
            <div className="min-w-0 mx-auto text-center md:text-left">
              <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CoutureAI</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                Revolutionizing fashion design with AI technology. Transform your creative vision into stunning, wearable art.
              </p>
            </div>
            <div className="min-w-0 mx-auto">
              <h4 className="text-lg font-semibold mb-6 text-center">Quick Links</h4>
              <ul className="space-y-3 text-center md:text-left">
                {[
                  { label: 'How It Works', section: 'hero' },
                  { label: 'Generate', section: 'generator' },
                  { label: 'Gallery', section: 'gallery' },
                  { label: 'Features', section: 'features' },
                ].map(link => (
                  <li key={link.label}>
                    <a
                      href={`#${link.section}`}
                      className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                      onClick={e => {
                        e.preventDefault();
                        scrollToSection(link.section);
                      }}
                    >
                      {link.label}
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