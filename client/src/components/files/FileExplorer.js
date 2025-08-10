import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Folder,
  File,
  Download,
  Search,
  ArrowLeft,
  Home,
  MoreVertical,
  Clock,
  HardDrive
} from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const FileExplorer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPath, setCurrentPath] = useState(searchParams.get('path') || '');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Load files and folders for current path
  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  // Update URL when path changes
  useEffect(() => {
    if (currentPath) {
      setSearchParams({ path: currentPath });
    } else {
      setSearchParams({});
    }
  }, [currentPath, setSearchParams]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/files/list?path=${currentPath}`);
      const { folders, files } = response.data.data;
      
      setFolders(folders);
      setFiles(files);
    } catch (error) {
      console.error('Failed to load files:', error);
      setError(error.response?.data?.error || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const navigateToFolder = (folderPath) => {
    setCurrentPath(folderPath);
  };

  const navigateToParent = () => {
    if (!currentPath) return;
    
    const pathParts = currentPath.split('/').filter(part => part);
    pathParts.pop();
    const parentPath = pathParts.join('/') + (pathParts.length > 0 ? '/' : '');
    setCurrentPath(parentPath);
  };

  const navigateToRoot = () => {
    setCurrentPath('');
  };

  const handleFileDownload = async (filePath) => {
    try {
      const response = await axios.get(`/api/files/download?path=${filePath}`);
      const { downloadUrl } = response.data.data;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setSearching(true);
      const response = await axios.get(`/api/files/search?q=${searchTerm}&path=${currentPath}`);
      setSearchResults(response.data.data.results);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">File Explorer</h1>
          <p className="text-gray-400 mt-1">
            Browse and manage your files
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field pl-10 w-full"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim() || searching}
            className="btn-primary"
          >
            {searching ? <LoadingSpinner size="sm" /> : 'Search'}
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={clearSearch}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="card p-4">
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={navigateToRoot}
            className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Root</span>
          </button>
          
          {currentPath && (
            <>
              <span className="text-gray-500">/</span>
              {currentPath.split('/').filter(part => part).map((part, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={() => {
                      const pathParts = currentPath.split('/').filter(p => p);
                      const newPath = pathParts.slice(0, index + 1).join('/') + '/';
                      setCurrentPath(newPath);
                    }}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {part}
                  </button>
                  {index < currentPath.split('/').filter(part => part).length - 1 && (
                    <span className="text-gray-500">/</span>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">
              Search Results ({searchResults.length})
            </h3>
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-300"
            >
              Clear Results
            </button>
          </div>
          
          <div className="grid gap-3">
            {searchResults.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-100 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">{file.path}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFileDownload(file.path)}
                  className="btn-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files and Folders */}
      {!searchResults.length && (
        <div className="card p-6">
          {/* Navigation Actions */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">
              {currentPath ? currentPath.split('/').pop() : 'Root Directory'}
            </h3>
            {currentPath && (
              <button
                onClick={navigateToParent}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
          </div>

          {/* Content */}
          {folders.length === 0 && files.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">This folder is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Folders */}
              {folders.map((folder, index) => (
                <div
                  key={index}
                  onClick={() => navigateToFolder(folder.path)}
                  className="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-all duration-200 cursor-pointer hover-lift"
                >
                  <div className="flex items-center space-x-3">
                    <Folder className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-gray-100 font-medium">{folder.name}</p>
                      <p className="text-sm text-gray-400">Folder</p>
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </div>
              ))}

              {/* Files */}
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <File className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-gray-100 font-medium">{file.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <HardDrive className="w-4 h-4" />
                          <span>{formatFileSize(file.size)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(file.lastModified)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFileDownload(file.path)}
                    className="btn-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer; 