import React from 'react';
import { Sparkles, ArrowRight, User, LogOut, LayoutDashboard } from 'lucide-react';

interface HeroProps {
  onTryNow: () => void;
  onViewGallery: () => void;
  user: { _id: string; fullName: string; email: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  onDashboard: () => void;
}

export default function Hero({ onTryNow, onViewGallery, user, onLogin, onLogout, onDashboard }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Fashion model"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CoutureAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                  <span className="text-white">Welcome, {user.fullName}</span>  
                  <button
                    onClick={onLogout}
                    className="text-white/80 hover:text-white transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2 rounded-full transition-all duration-300 border border-white/30"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30">
          <Sparkles className="w-5 h-5 text-emerald-300" />
          <span className="text-white font-medium">Powered by Advanced AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          CoutureAI
          <span className="block text-3xl md:text-5xl font-normal text-emerald-300 mt-2">
            Bring Your Fashion Ideas to Life
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          Generate custom clothing designs instantly with AI. Transform your imagination into stunning fashion pieces.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onTryNow}
            className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try It Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onViewGallery}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/50"
          >
            View Gallery
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div> */}
    </section>
  );
}