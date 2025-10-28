import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Grid, Camera } from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4">
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
  const [imageSrc, setImageSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const handleError = () => {
    setIsLoading(false);
    
    // Retry logic for failed images
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Add timestamp to force reload
      setImageSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${retryCount + 1}`);
      setIsLoading(true);
    } else {
      setHasError(true);
    }
  };

  return (
    <div 
      className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 aspect-square hover:transform hover:scale-105 transition-all duration-300"
      onClick={() => !hasError && onImageClick(src)}
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
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
          <Download className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

// Gallery Component
const Gallery = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Example gallery items using reliable stock images */}
        {[
          { prompt: 'cherry blossoms', id: 1 },
          { prompt: 'city skyline', id: 2 }, 
          { prompt: 'mountain landscape', id: 3 },
          { prompt: 'forest pathway', id: 4 },
          { prompt: 'ocean waves', id: 5 },
          { prompt: 'modern architecture', id: 6 },
          { prompt: 'sunset clouds', id: 7 },
          { prompt: 'desert dunes', id: 8 },
          { prompt: 'river reflection', id: 9 },
          { prompt: 'autumn leaves', id: 10 },
          { prompt: 'snow mountains', id: 11 },
          { prompt: 'field flowers', id: 12 }
        ].map((item, index) => {
          // Use Picsum with different approach - add timestamp to prevent caching issues
          const imageUrl = `https://picsum.photos/seed/${item.id}/400/400`;
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
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
            loading="lazy"
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
  const [generatedImages, setGeneratedImages] = useState(() => {
    // Load images from localStorage on initial load
    try {
      const savedImages = localStorage.getItem('generatedImages');
      return savedImages ? JSON.parse(savedImages) : [];
    } catch (error) {
      console.error('Error loading images from localStorage:', error);
      return [];
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Save images to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
    } catch (error) {
      console.error('Error saving images to localStorage:', error);
    }
  }, [generatedImages]);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Generate a random seed for variety
      const seed = Math.floor(Math.random() * 1000000);
      const timestamp = Date.now();
      
      // Create Pollinations API URL with timestamp to prevent caching
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true&timestamp=${timestamp}`;
      
      // Add a small delay to show loading state and ensure image generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newImage = {
        url: imageUrl,
        prompt: prompt,
        timestamp: timestamp,
        seed: seed,
        id: `${timestamp}-${seed}` // Unique ID to prevent React key issues
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-4" style={{
            background: 'linear-gradient(to right, rgb(96, 165, 250), rgb(168, 85, 247))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.15em',
            lineHeight: '1.3'
          }}>
            AI Image Generator
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
            Generate an image using Generative AI by describing what you want to see, all images are published publicly by default.
          </p>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What do you want to see?"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-32 sm:pr-36 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm sm:text-base"
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
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center px-2">
                <Grid className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Your Generated Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
                {generatedImages.map((image) => (
                  <div key={image.id || image.timestamp} className="relative">
                    <ImageCard
                      src={image.url}
                      alt={image.prompt}
                      onImageClick={handleImageClick}
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-1.5 sm:p-2 rounded truncate">
                      {image.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
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