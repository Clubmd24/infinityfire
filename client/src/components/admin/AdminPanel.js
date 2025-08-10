import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Shield, 
  Activity, 
  Settings, 
  Database,
  HardDrive,
  Eye,
  EyeOff,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import axios from 'axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bucketStatus: null,
    systemInfo: null
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersResponse = await axios.get('/api/users');
      const usersData = usersResponse.data.data;
      
      // Fetch bucket info
      const bucketResponse = await axios.get('/api/files/bucket-info');
      
      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        activeUsers: usersData.filter(u => u.isActive).length,
        bucketStatus: bucketResponse.data.data,
        systemInfo: {
          nodeVersion: 'Browser Environment',
          platform: navigator.platform || 'Unknown',
          uptime: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setMessage({ type: 'error', text: 'Failed to fetch admin data' });
    }
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      setLoading(true);
      await axios.put(`/api/users/${userId}/status`, {
        isActive: !currentStatus
      });
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isActive: !currentStatus } : u
      ));
      
      setMessage({ 
        type: 'success', 
        text: `User ${currentStatus ? 'deactivated' : 'activated'} successfully` 
      });
      
      // Refresh stats
      fetchAdminData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' });
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/users/${userId}`);
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      setMessage({ type: 'success', text: 'User deleted successfully' });
      
      // Refresh stats
      fetchAdminData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  const formatUptime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-800 to-red-700 rounded-2xl p-6 border border-orange-600">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-orange-100">
              Manage users, monitor system status, and configure settings
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-2">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            System Status
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="ml-auto text-gray-400 hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Users</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">S3 Status</p>
                  <p className="text-lg font-semibold text-green-400 mt-2">
                    {stats.bucketStatus?.accessible ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">System Uptime</p>
                  <p className="text-lg font-semibold text-white mt-2">
                    {stats.systemInfo ? formatUptime(stats.systemInfo.uptime) : 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 text-left"
              >
                <Users className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Manage Users</h3>
                <p className="text-gray-400 text-sm">View, edit, and manage user accounts</p>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-left"
              >
                <Database className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">System Monitor</h3>
                <p className="text-gray-400 text-sm">Monitor system performance and status</p>
              </button>

              <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg">
                <Settings className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Configuration</h3>
                <p className="text-gray-400 text-sm">System configuration and settings</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Login</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id} className="border-b border-dark-600/50 hover:bg-dark-700/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{userItem.username}</p>
                        <p className="text-gray-400 text-sm">
                          {userItem.firstName} {userItem.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{userItem.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userItem.role === 'admin' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userItem.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {userItem.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {userItem.lastLogin 
                        ? new Date(userItem.lastLogin).toLocaleDateString() 
                        : 'Never'
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserStatusToggle(userItem.id, userItem.isActive)}
                          disabled={loading || userItem.id === user.id}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            userItem.isActive
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                              : 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={userItem.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {userItem.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        
                        {userItem.id !== user.id && (
                          <button
                            onClick={() => handleUserDelete(userItem.id)}
                            disabled={loading}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* System Information */}
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">System Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Node.js Version</p>
                  <p className="text-white font-medium">{stats.systemInfo?.nodeVersion || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Platform</p>
                  <p className="text-white font-medium capitalize">{stats.systemInfo?.platform || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">System Uptime</p>
                  <p className="text-white font-medium">
                    {stats.systemInfo ? formatUptime(stats.systemInfo.uptime) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Environment</p>
                  <p className="text-white font-medium capitalize">Production</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Port</p>
                  <p className="text-white font-medium">443 (HTTPS)</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Database</p>
                  <p className="text-white font-medium">MySQL</p>
                </div>
              </div>
            </div>
          </div>

          {/* S3 Bucket Status */}
          {stats.bucketStatus && (
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">S3 Bucket Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${stats.bucketStatus.accessible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-white text-sm font-medium">Connection Status</p>
                    <p className="text-gray-400 text-xs">
                      {stats.bucketStatus.accessible ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Bucket Name</p>
                    <p className="text-gray-400 text-xs">{stats.bucketStatus.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Region</p>
                    <p className="text-gray-400 text-xs">{stats.bucketStatus.region}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 