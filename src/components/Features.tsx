import React from 'react';
import { Zap, Ruler, TrendingUp, ShoppingBag } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Visualization',
      description: 'Transform your text descriptions into realistic fashion designs in seconds with our advanced AI technology.',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Ruler,
      title: 'Custom Tailoring',
      description: 'Get precise measurements and fabric suggestions tailored to your specific design requirements.',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Trend Insights',
      description: 'Stay ahead of fashion trends with AI-powered insights into what\'s popular and emerging in the industry.',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      icon: ShoppingBag,
      title: 'Seamless Shopping',
      description: 'Find similar real-world products and connect with manufacturers to bring your designs to life.',
      gradient: 'from-pink-400 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose CoutureAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of fashion design with cutting-edge AI technology that brings your creative vision to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10 transform scale-105`}></div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-emerald-100 text-lg">Designs Created</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-emerald-100 text-lg">Happy Designers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-emerald-100 text-lg">AI Availability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}