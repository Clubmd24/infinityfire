import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  FolderOpen,
  User,
  Settings,
  Users,
  LogOut,
  X,
  Shield,
  Play,
  ClipboardCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and statistics'
    },
    {
      name: 'Files',
      href: '/files',
      icon: FolderOpen,
      description: 'Browse and download files'
    },
    {
      name: 'Tests',
      href: '/tests',
      icon: Play,
      description: 'Conduct diagnostic tests'
    },
    {
      name: 'Venue Checklists',
      href: '/venue-checklists',
      icon: ClipboardCheck,
      description: 'Opening and closing checklists'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your account'
    }
  ];

  // Admin navigation items
  if (user?.role === 'admin') {
    navigation.push({
      name: 'Admin Panel',
      href: '/admin',
      icon: Shield,
      description: 'User management and system settings'
    });
  }

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:inset-0 lg:flex-shrink-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <div className={sidebarClasses}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-dark-700">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gradient">
            InfinityFire
          </h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-100 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.username
              }
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
            {user?.role === 'admin' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border-r-2 border-primary-500'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-dark-800'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-dark-800 rounded-lg transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 