import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import type { GeneratedImage } from '../App';

interface GalleryProps {
  images: GeneratedImage[];
  user: { _id: string } | null;
  likedImages: GeneratedImage[];
  onLike: (imageId: string) => Promise<void>;
  onTogglePublicPrivate: (imageId: string, makePublic: boolean) => Promise<void>;
  isLoading: boolean;
}

export default function Gallery({ images, user, likedImages, onLike, onTogglePublicPrivate, isLoading }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<'my' | 'public' | 'liked'>('public');
  const [mySubTab, setMySubTab] = useState<'public' | 'private'>('public');
  const [confirmToggle, setConfirmToggle] = useState<{ id: string; makePublic: boolean } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  let displayedImages: GeneratedImage[] = [];
  if (activeTab === 'my' && user) {
    displayedImages = images.filter(img => img.userId === user._id && (mySubTab === 'public' ? img.isPublic : !img.isPublic));
  } else if (activeTab === 'public') {
    displayedImages = images.filter(img => img.isPublic);
  } else if (activeTab === 'liked' && user) {
    displayedImages = likedImages;
  }

  // Filter by search term
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    displayedImages = displayedImages.filter(img =>
      img.prompt.toLowerCase().includes(term) ||
      img.fabric.toLowerCase().includes(term) ||
      img.style.toLowerCase().includes(term) ||
      img.occasion.toLowerCase().includes(term) ||
      (img.filters?.color && img.filters.color.toLowerCase().includes(term)) ||
      (img.filters?.pattern && img.filters.pattern.toLowerCase().includes(term)) ||
      (img.filters?.texture && img.filters.texture.toLowerCase().includes(term))
    );
  }

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Gallery</h2>
        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by prompt, style, fabric, occasion, color, pattern, texture..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'my' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border'}`}
            onClick={() => setActiveTab('my')}
            disabled={!user}
          >
            My Creations
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'public' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border'}`}
            onClick={() => setActiveTab('public')}
          >
            Publicly Available Images
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'liked' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 border'}`}
            onClick={() => setActiveTab('liked')}
            disabled={!user}
          >
            Liked Images
          </button>
        </div>
        {/* Sub-tabs for My Creations */}
        {activeTab === 'my' && user && (
          <div className="flex justify-center mb-6 gap-2">
            <button
              className={`px-3 py-1 rounded ${mySubTab === 'public' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setMySubTab('public')}
            >
              Public
            </button>
            <button
              className={`px-3 py-1 rounded ${mySubTab === 'private' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setMySubTab('private')}
            >
              Private
            </button>
          </div>
        )}
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedImages.map((image) => (
            <div key={image._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <p className="text-gray-600 mb-4">{image.prompt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                    {image.fabric}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {image.style}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {image.occasion}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onLike(image._id)}
                    className={`flex items-center gap-2 transition-colors ${user ? 'text-gray-500 hover:text-red-500' : 'text-gray-300 cursor-not-allowed'}`}
                    disabled={!user}
                    aria-label={user ? (image.likedBy && image.likedBy.includes(user._id) ? 'Unlike' : 'Like') : 'Login to like'}
                    title={user ? (image.likedBy && image.likedBy.includes(user._id) ? 'Unlike' : 'Like') : 'Login to like'}
                  >
                    <Heart className={`w-5 h-5 ${user && image.likedBy && image.likedBy.includes(user._id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{image.likedBy ? image.likedBy.length : 0}</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {/* Toggle public/private button for owner */}
                {user && image.userId === user._id && (
                  <div className="mt-4 flex justify-end">
                    <button
                      className={`px-3 py-1 rounded ${image.isPublic ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'} border`}
                      onClick={() => setConfirmToggle({ id: image._id, makePublic: !image.isPublic })}
                    >
                      {image.isPublic ? 'Make Private' : 'Make Public'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Confirmation Popup */}
        {confirmToggle && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">
                {confirmToggle.makePublic
                  ? 'Do you really want to make this image public?'
                  : 'Do you really want to make this image private?'}
              </h3>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                  onClick={async () => {
                    await onTogglePublicPrivate(confirmToggle.id, confirmToggle.makePublic);
                    setConfirmToggle(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => setConfirmToggle(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}