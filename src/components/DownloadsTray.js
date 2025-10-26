import React from 'react';

const DownloadsTray = ({ isOpen, onClose }) => {
  const downloads = [
    { id: 1, name: 'document.pdf', size: '2.3 MB', status: 'Completed', time: '2 minutes ago' },
    { id: 2, name: 'image.jpg', size: '1.8 MB', status: 'Completed', time: '5 minutes ago' },
    { id: 3, name: 'video.mp4', size: '45.2 MB', status: 'Downloading...', time: 'Now' },
    { id: 4, name: 'archive.zip', size: '12.1 MB', status: 'Completed', time: '1 hour ago' }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Downloads Tray */}
      <div className="fixed bottom-4 right-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50">
        {/* Header */}
        <div className="bg-gray-700 border-b border-gray-600 px-4 py-3 flex items-center justify-between rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">Downloads</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-600 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Downloads List */}
        <div className="max-h-64 overflow-y-auto">
          {downloads.map((download) => (
            <div key={download.id} className="px-4 py-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{download.name}</p>
                  <p className="text-xs text-gray-400">{download.size} • {download.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    download.status === 'Completed' 
                      ? 'bg-green-600 text-green-100' 
                      : 'bg-orbitix-600 text-orbitix-100'
                  }`}>
                    {download.status}
                  </span>
                  <button className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-700 px-4 py-2 rounded-b-lg">
          <button className="w-full text-sm text-gray-300 hover:text-white transition-colors duration-200">
            Open Downloads Folder
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadsTray;
