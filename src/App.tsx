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
  fullName: string;
  email: string;
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
  likedBy: string[];
  createdAt: string;
  updatedAt?: string;
};

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [likedImages, setLikedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to merge and deduplicate images by _id
  const mergeImages = (arr1: GeneratedImage[], arr2: GeneratedImage[]) => {
    const map = new Map<string, GeneratedImage>();
    arr1.forEach(img => map.set(img._id, img));
    arr2.forEach(img => map.set(img._id, img));
    return Array.from(map.values());
  };

  const loadAllImages = async (currentUser: User | null) => {
    setIsLoading(true);
    try {
      const publicImages = await imagesAPI.getPublicImages();
      if (currentUser) {
        const userImages = await imagesAPI.getUserImages();
        setGeneratedImages(mergeImages(publicImages, userImages));
      } else {
        setGeneratedImages(publicImages);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let parsedUser = null;
    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUser({
        _id: parsedUser.user.id || parsedUser.user._id,
        fullName: parsedUser.user.fullName,
        email: parsedUser.user.email,
      });
    }
    loadAllImages(parsedUser ? {
      _id: parsedUser.user.id || parsedUser.user._id,
      fullName: parsedUser.user.fullName,
      email: parsedUser.user.email,
    } : null);
  }, []);

  useEffect(() => {
    if (user) {
      imagesAPI.getLikedImages().then(setLikedImages).catch(() => setLikedImages([]));
      loadAllImages(user);
    } else {
      setLikedImages([]);
      loadAllImages(null);
    }
  }, [user]);

  const handleLogin = (userData: any) => {
    const user = {
      _id: userData.user.id || userData.user._id,
      fullName: userData.user.fullName,  
      email: userData.user.email,
    };
    setUser(user);
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

  const addGeneratedImage = async (imageData: {
    prompt: string;
    fabric: string;
    style: string;
    occasion: string;
    isPublic: boolean;
    filters: Record<string, any>;
  }) => {
    try {
      const newImage = await imagesAPI.generateImage(imageData);
      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleLikeImage = async (imageId: string) => {
    try {
      const updatedImage = await imagesAPI.likeImage(imageId);
      setGeneratedImages(prev =>
        prev.map(img => (img._id === imageId ? updatedImage : img))
      );
      if (user) {
        imagesAPI.getLikedImages().then(setLikedImages).catch(() => {});
      }
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

  const handleTogglePublicPrivate = async (imageId: string, makePublic: boolean) => {
    try {
      const updatedImage = await imagesAPI.updatePublicStatus(imageId, makePublic);
      setGeneratedImages(prev => prev.map(img => img._id === imageId ? updatedImage : img));
      // After toggling, re-fetch user images and merge with public images
      if (user) {
        const publicImages = await imagesAPI.getPublicImages();
        const userImages = await imagesAPI.getUserImages();
        setGeneratedImages(mergeImages(publicImages, userImages));
      }
    } catch (error) {
      console.error('Error toggling public/private:', error);
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
          images={generatedImages}
          user={user}
          likedImages={likedImages}
          onLike={handleLikeImage}
          onTogglePublicPrivate={handleTogglePublicPrivate}
          isLoading={isLoading}
        />
      </div>
      <Features />
      <Footer scrollToSection={scrollToSection} />
      
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