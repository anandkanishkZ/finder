import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, MapPin, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <MapPin className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinderKeeper</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-teal-500 hover:text-gray-700"
              >
                Home
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-teal-500 hover:text-gray-700"
              >
                <Search className="h-4 w-4 mr-1" />
                Browse Items
              </Link>
              <Link
                to="/item/new"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-teal-500 hover:text-gray-700"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Report Item
              </Link>
            </div>
          </div>
          
          {/* Desktop Right Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <Link to="/profile" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                      <User className="h-5 w-5 mr-1" />
                      {user?.name}
                    </Link>
                    <button
                      onClick={logout}
                      className="ml-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
              onClick={toggleMenu}
            >
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-1" />
                Browse Items
              </div>
            </Link>
            <Link
              to="/item/new"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
              onClick={toggleMenu}
            >
              <div className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-1" />
                Report Item
              </div>
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-800"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;