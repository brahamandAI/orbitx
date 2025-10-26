import React, { useState } from 'react';

const ImageSearchResults = ({ imageData, onImageClick, onLoadMore }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowLightbox(true);
    if (onImageClick) {
      onImageClick(image);
    }
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedImage(null);
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    if (typeof size === 'string') return size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${Math.round(size / (1024 * 1024))} MB`;
  };

  const getImageAspectRatio = (width, height) => {
    if (!width || !height) return 'aspect-square';
    const ratio = width / height;
    if (ratio > 1.5) return 'aspect-video';
    if (ratio < 0.8) return 'aspect-portrait';
    return 'aspect-square';
  };

  if (!imageData || !imageData.images || imageData.images.length === 0) {
    return (
      <div className="flex-1 bg-gray-900 overflow-y-auto">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No images found</h3>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto">
      {/* Search Info */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              About {imageData.totalResults || imageData.images.length} images found
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {imageData.source}
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {imageData.images.map((image, index) => (
            <ImageCard
              key={`${image.url}-${index}`}
              image={image}
              onClick={() => handleImageClick(image)}
              formatFileSize={formatFileSize}
              getImageAspectRatio={getImageAspectRatio}
            />
          ))}
        </div>

        {/* Load More Button */}
        {imageData.images.length > 0 && imageData.hasMore && (
          <div className="text-center mt-8">
            <button 
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center mx-auto space-x-2"
            >
              {isLoadingMore ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Loading More Images...</span>
                </>
              ) : (
                <>
                  <span>Load More Images</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && selectedImage && (
        <ImageLightbox
          image={selectedImage}
          onClose={closeLightbox}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  );
};

const ImageCard = ({ image, onClick, formatFileSize, getImageAspectRatio }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className={`relative ${getImageAspectRatio(image.width, image.height)} bg-gray-700`}>
        {!imageError ? (
          <img
            src={image.thumbnailUrl || image.imageUrl}
            alt={image.title}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-sm">Image not available</div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Image Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="text-white text-xs">
            {image.width && image.height && (
              <div>{image.width} × {image.height}</div>
            )}
            {image.size && (
              <div>{formatFileSize(image.size)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Image Details */}
      <div className="p-3">
        <h3 className="text-sm text-white line-clamp-2 mb-1">
          {image.title}
        </h3>
        <div className="text-xs text-gray-400 truncate">
          {image.source}
        </div>
      </div>
    </div>
  );
};

const ImageLightbox = ({ image, onClose, formatFileSize }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-w-4xl max-h-full bg-gray-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {image.title}
            </h3>
            <div className="text-sm text-gray-400">
              {image.source} • {image.width && image.height && `${image.width} × ${image.height}`}
              {image.size && ` • ${formatFileSize(image.size)}`}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="relative bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          <img
            src={image.imageUrl}
            alt={image.title}
            className={`w-full h-auto max-h-96 object-contain transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">
              {image.description}
            </div>
            <div className="flex space-x-2">
              <a
                href={image.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                View Source
              </a>
              <a
                href={image.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                Open Image
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchResults;
