import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Eye, Heart, Calendar, Filter, Grid, List, Search, Trash2, Edit3 } from 'lucide-react';
import type { User, GeneratedImage } from '../App';

interface UserDashboardProps {
  user: User;
  generatedImages: GeneratedImage[];
  onBack: () => void;
  onLogout: () => void;
  onDeleteImage: (imageId: string) => Promise<void>;
}

export default function UserDashboard({ user, generatedImages, onBack, onLogout, onDeleteImage }: UserDashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const filters = [
    { id: 'all', label: 'All Designs' },
    { id: 'public', label: 'Public' },
    { id: 'private', label: 'Private' },
    { id: 'recent', label: 'Recent' }
  ];

  const filteredImages = generatedImages.filter(image => {
    const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.fabric.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'public' && image.isPublic) ||
                         (filterBy === 'private' && !image.isPublic) ||
                         (filterBy === 'recent' && new Date(image.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesFilter;
  });

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Designs</p>
                <p className="text-3xl font-bold text-gray-900">{generatedImages.length}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Grid className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Public Designs</p>
                <p className="text-3xl font-bold text-gray-900">{generatedImages.filter(img => img.isPublic).length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-3xl font-bold text-gray-900">{generatedImages.reduce((sum, img) => sum + img.likes, 0)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900">
                  {generatedImages.filter(img => new Date(img.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {filters.map(filter => (
                    <option key={filter.id} value={filter.id}>{filter.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {selectedImages.length > 0 && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg flex items-center justify-between">
              <span className="text-emerald-700 font-medium">
                {selectedImages.length} design{selectedImages.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Selected
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Images Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map(image => (
              <div key={image._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="relative aspect-square">
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image._id)}
                      onChange={() => toggleImageSelection(image._id)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      image.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {image.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{image.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded">{image.fabric}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{image.style}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{image.likes}</span>
                      </div>
                      <span>{formatDate(image.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredImages.map(image => (
                <div key={image._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image._id)}
                      onChange={() => toggleImageSelection(image._id)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium line-clamp-1 mb-1">{image.prompt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>Fabric: {image.fabric}</span>
                        <span>Style: {image.style}</span>
                        <span>Occasion: {image.occasion}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{image.likes} likes</span>
                        </div>
                        <span>{formatDate(image.createdAt)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          image.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {image.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-12 shadow-sm">
              <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms or filters.' : 'Start creating your first design!'}
              </p>
              <button
                onClick={onBack}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create New Design
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}