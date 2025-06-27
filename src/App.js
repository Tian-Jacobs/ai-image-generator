import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, Heart, Sparkles, Grid, Camera } from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Image Card Component
const ImageCard = ({ src, alt, onImageClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 aspect-square hover:transform hover:scale-105 transition-all duration-300"
      onClick={() => onImageClick(src)}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-800">
          <div className="text-center">
            <Camera className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-2">
          <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
            <Heart className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Gallery Component
const Gallery = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Example gallery items using fast-loading stock images */}
        {[
          { prompt: 'cherry blossoms', id: 100 },
          { prompt: 'city skyline', id: 101 }, 
          { prompt: 'mountain landscape', id: 102 },
          { prompt: 'forest pathway', id: 103 },
          { prompt: 'ocean waves', id: 104 },
          { prompt: 'modern architecture', id: 105 },
          { prompt: 'sunset clouds', id: 106 },
          { prompt: 'desert dunes', id: 107 },
          { prompt: 'river reflection', id: 108 },
          { prompt: 'autumn leaves', id: 109 },
          { prompt: 'snow mountains', id: 110 },
          { prompt: 'field flowers', id: 111 }
        ].map((item, index) => {
          // Use fast-loading stock images from Picsum
          const imageUrl = `https://picsum.photos/400/400?random=${item.id}`;
          return (
            <ImageCard
              key={index}
              src={imageUrl}
              alt={item.prompt}
              onImageClick={onImageClick}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={index}
          src={image.url}
          alt={image.prompt}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

// Image Modal Component
const ImageModal = ({ src, alt, isOpen, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
    }
  }, [isOpen, src]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl z-10"
        >
          ×
        </button>
        <div className="relative">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg min-w-96 min-h-96">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={handleDownload}
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Generate a random seed for variety
      const seed = Math.floor(Math.random() * 1000000);
      
      // Create Pollinations API URL
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true`;
      
      // Add a small delay to show loading state and ensure image generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newImage = {
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        seed: seed
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      setPrompt(''); // Clear the input after generation
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateImage();
    }
  };

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight px-4">
            AI Image Generator
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            Generate an image using Generative AI by describing what you want to see, all images are published publicly by default.
          </p>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What do you want to see?"
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-8">
          {generatedImages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Grid className="w-6 h-6 mr-2" />
                Your Generated Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <ImageCard
                      src={image.url}
                      alt={image.prompt}
                      onImageClick={handleImageClick}
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded truncate">
                      {image.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <p className="text-gray-400 max-w-2xl mx-auto px-4">
              Get inspiration from these example generations below, or create your own unique images!
            </p>
          </div>

          <Gallery images={[]} onImageClick={handleImageClick} />
        </div>
      </main>

      <ImageModal
        src={selectedImage}
        alt="Generated image"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default App;