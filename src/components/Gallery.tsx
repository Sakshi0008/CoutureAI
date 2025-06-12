import React from 'react';
import { Heart } from 'lucide-react';
import type { GeneratedImage } from '../App';

interface GalleryProps {
  images: GeneratedImage[];
  onLike: (imageId: string) => Promise<void>;
  isLoading: boolean;
}

export default function Gallery({ images, onLike, isLoading }: GalleryProps) {
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
        <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image) => (
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
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${image.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{image.likes}</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}