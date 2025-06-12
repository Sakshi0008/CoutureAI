import React, { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import type { User } from '../App';

interface GeneratorProps {
  user: User | null;
  onImageGenerated: (imageData: FormData) => Promise<void>;
  onLoginRequired: () => void;
}

export default function Generator({ user, onImageGenerated, onLoginRequired }: GeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [fabric, setFabric] = useState('');
  const [style, setStyle] = useState('');
  const [occasion, setOccasion] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onLoginRequired();
      return;
    }

    if (!prompt || !fabric || !style || !occasion) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('fabric', fabric);
      formData.append('style', style);
      formData.append('occasion', occasion);
      formData.append('isPublic', isPublic.toString());
      formData.append('filters', JSON.stringify({}));

      await onImageGenerated(formData);
      
      // Reset form
      setPrompt('');
      setFabric('');
      setStyle('');
      setOccasion('');
      setIsPublic(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error generating image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Generate Your Fashion Design
          </h2>
          <p className="text-xl text-gray-600">
            Describe your vision and let AI create your perfect outfit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe your ideal outfit..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabric
                </label>
                <select
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select fabric</option>
                  <option value="silk">Silk</option>
                  <option value="cotton">Cotton</option>
                  <option value="denim">Denim</option>
                  <option value="wool">Wool</option>
                  <option value="leather">Leather</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select style</option>
                  <option value="casual">Casual</option>
                  <option value="elegant">Elegant</option>
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="bohemian">Bohemian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select occasion</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="party">Party</option>
                  <option value="work">Work</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-600">
                Make this design public
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Design
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}