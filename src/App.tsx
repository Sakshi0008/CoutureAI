import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Generator from './components/Generator';
import Gallery from './components/Gallery';
import Features from './components/Features';
import Footer from './components/Footer';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
import { authAPI, imagesAPI } from './services/api';

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type GeneratedImage = {
  _id: string;
  userId: string;
  imageUrl: string;
  prompt: string;
  fabric: string;
  style: string;
  occasion: string;
  filters: {
    color?: string;
    pattern?: string;
    texture?: string;
  };
  isPublic: boolean;
  likes: number;
  createdAt: Date;
};

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const images = await imagesAPI.getPublicImages();
      setGeneratedImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleSignup = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setCurrentSection('home');
  };

  const addGeneratedImage = async (imageData: FormData) => {
    try {
      const newImage = await imagesAPI.createImage(imageData);
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Error creating image:', error);
    }
  };

  const handleLikeImage = async (imageId: string) => {
    try {
      const updatedImage = await imagesAPI.likeImage(imageId);
      setGeneratedImages(prev =>
        prev.map(img => (img._id === imageId ? updatedImage : img))
      );
    } catch (error) {
      console.error('Error liking image:', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await imagesAPI.deleteImage(imageId);
      setGeneratedImages(prev => prev.filter(img => img._id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setCurrentSection('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (currentSection === 'dashboard' && user) {
    return (
      <UserDashboard 
        user={user}
        generatedImages={generatedImages.filter(img => img.userId === user._id)}
        onBack={() => setCurrentSection('home')}
        onLogout={handleLogout}
        onDeleteImage={handleDeleteImage}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Hero 
        onTryNow={() => scrollToSection('generator')}
        onViewGallery={() => scrollToSection('gallery')}
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onDashboard={() => setCurrentSection('dashboard')}
      />
      <div id="generator">
        <Generator 
          user={user}
          onImageGenerated={addGeneratedImage}
          onLoginRequired={() => setShowAuthModal(true)}
        />
      </div>
      <div id="gallery">
        <Gallery 
          images={generatedImages.filter(img => img.isPublic)}
          onLike={handleLikeImage}
          isLoading={isLoading}
        />
      </div>
      <Features />
      <Footer />
      
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}
    </div>
  );
}

export default App;