import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, LogOut, Menu, X, Plus, Settings } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { hapticFeedback } from '../utils/haptics';
import EnhancedButton from './EnhancedButton';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    hapticFeedback.medium();
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    hapticFeedback.light();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    hapticFeedback.light();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" style={{backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'}} >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Home className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors duration-200 group-hover:rotate-12 transform" />
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
              Ghar
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              onClick={() => hapticFeedback.light()}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
            >
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => hapticFeedback.light()}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
            >
              Search PGs
            </Link>
            <Link
              to="/about"
              onClick={() => hapticFeedback.light()}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
            >
              About
            </Link>
            <Link
              to="/list-pg"
              onClick={() => hapticFeedback.light()}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
            >
              List PG
            </Link>
            {user?.role === 'owner' && (
              <Link
                to="/owner/dashboard"
                onClick={() => hapticFeedback.light()}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
              >
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <div className="relative group">
                <Link
                  to="/admin/dashboard"
                  onClick={() => hapticFeedback.light()}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                >
                  Admin Panel
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border">
                  <div className="py-1">
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link to="/admin/pg-approval" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PG Approvals</Link>
                    <Link to="/admin/amenities" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Amenities</Link>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'owner' && (
                  <EnhancedButton
                    onClick={() => navigate('/owner/add-pg')}
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    iconPosition="left"
                    hapticType="medium"
                    animationType="scale"
                    className="shadow-lg"
                  >
                    Add PG
                  </EnhancedButton>
                )}
                <NotificationCenter />
                <Link 
                  to="/profile"
                  onClick={() => hapticFeedback.light()}
                  className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-sm">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-all duration-200 hover:bg-red-50 hover:scale-110 active:scale-95"
                  title="Logout"
                  aria-label="Logout from account"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  onClick={() => hapticFeedback.light()}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                >
                  Login
                </Link>
                <EnhancedButton
                  onClick={() => navigate('/register')}
                  variant="primary"
                  size="sm"
                  hapticType="medium"
                  animationType="scale"
                  className="shadow-lg"
                >
                  Sign Up
                </EnhancedButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              title="Toggle menu"
              aria-label="Toggle navigation menu"
              className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-all duration-200 hover:bg-primary-50 hover:scale-110 active:scale-95"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 transform rotate-180 transition-transform duration-200" /> : 
                <Menu className="h-6 w-6 transition-transform duration-200" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slideDown">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t shadow-lg">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                onClick={() => {
                  hapticFeedback.light();
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                onClick={() => {
                  hapticFeedback.light();
                  setIsMenuOpen(false);
                }}
              >
                Search PGs
              </Link>
              {user?.role === 'owner' && (
                <>
                  <Link
                    to="/owner/dashboard"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/owner/add-pg"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    Add PG
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/pg-approval"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    PG Approvals
                  </Link>
                  <Link
                    to="/admin/amenities"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    Manage Amenities
                  </Link>
                </>
              )}
              {user ? (
                <div className="border-t pt-4 mt-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600 flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <span>Profile ({user.name})</span>
                  </Link>
                  <Link
                    to="/manage-subscription"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    Manage Subscription
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-red-50 hover:scale-105 active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4 mt-4 space-y-1">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-primary-50 hover:scale-105 active:scale-95"
                    onClick={() => {
                      hapticFeedback.light();
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                    onClick={() => {
                      hapticFeedback.medium();
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;