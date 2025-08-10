import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Folder, 
  File, 
  Download, 
  Clock, 
  User, 
  Activity,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    recentFiles: [],
    bucketInfo: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get bucket info
        const bucketResponse = await axios.get('/api/files/bucket-info');
        
        // Get root directory listing for stats
        const filesResponse = await axios.get('/api/files/list?path=');
        
        const data = filesResponse.data.data;
        const totalFiles = data.files.length;
        const totalFolders = data.folders.length;
        
        // Get recent files (last 5)
        const recentFiles = data.files
          .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
          .slice(0, 5);

        setStats({
          totalFiles,
          totalFolders,
          recentFiles,
          bucketInfo: bucketResponse.data.data
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-700 rounded-2xl p-6 border border-dark-600">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.firstName || user.username}! 👋
            </h1>
            <p className="text-gray-300">
              Access and manage your files stored in the cloud
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Files */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Files</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalFiles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Folders */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Folders</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalFolders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Storage Status */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Storage Status</p>
              <p className="text-lg font-semibold text-green-400 mt-2">Active</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Last Activity</p>
              <p className="text-lg font-semibold text-white mt-2">
                {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Files</h2>
            <Link
              to="/files"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {stats.recentFiles.length > 0 ? (
            <div className="space-y-3">
              {stats.recentFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium text-sm truncate max-w-32">
                        {file.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatFileSize(file.size)} • {formatDate(file.lastModified)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(`/api/files/download?path=${encodeURIComponent(file.path)}`, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <File className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No files found</p>
              <p className="text-gray-500 text-sm">Upload some files to get started</p>
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
          
          <div className="space-y-3">
            <Link
              to="/files"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Browse Files</p>
                  <p className="text-gray-400 text-sm">Access your file collection</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-medium">Profile Settings</p>
                  <p className="text-gray-400 text-sm">Manage your account</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Admin Panel</p>
                    <p className="text-gray-400 text-sm">Manage system settings</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      {stats.bucketInfo && (
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${stats.bucketInfo.accessible ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="text-white text-sm font-medium">S3 Bucket</p>
                <p className="text-gray-400 text-xs">
                  {stats.bucketInfo.accessible ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-white text-sm font-medium">Database</p>
                <p className="text-gray-400 text-xs">Connected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-white text-sm font-medium">API</p>
                <p className="text-gray-400 text-xs">Online</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 