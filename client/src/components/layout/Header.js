import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ user, onMenuClick }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/files') return 'File Explorer';
    if (path === '/profile') return 'Profile';
    if (path === '/admin') return 'Admin Panel';
    return 'Dashboard';
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return ['Dashboard'];
    
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      return {
        title,
        path: `/${segments.slice(0, index + 1).join('/')}`,
        isLast
      };
    });
  };

  return (
    <header className="bg-dark-900 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and breadcrumbs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-dark-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center space-x-2">
            {getBreadcrumbs().map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-500">/</span>
                )}
                <span className={`text-sm ${
                  breadcrumb.isLast 
                    ? 'text-gray-100 font-medium' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}>
                  {breadcrumb.title}
                </span>
              </div>
            ))}
          </nav>
          
          {/* Page title for mobile */}
          <h1 className="text-xl font-semibold text-gray-100 sm:hidden">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side - Search and user actions */}
        <div className="flex items-center space-x-4">
          {/* Search button */}
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-dark-800 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-dark-800 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-100">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username
                }
              </p>
              <p className="text-xs text-gray-400">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
            
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.firstName?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 