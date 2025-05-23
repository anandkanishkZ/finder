import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, MapPin, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <MapPin className="nav-logo-icon" />
            <span className="nav-logo-text">FinderKeeper</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="nav-menu desktop">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/search" className="nav-link">
              <Search className="nav-link-icon" />
              Browse Items
            </Link>
            <Link to="/item/new" className="nav-link">
              <PlusCircle className="nav-link-icon" />
              Report Item
            </Link>
          </div>
        </div>
        
        {/* Desktop Right Menu */}
        <div className="nav-right desktop">
          {isAuthenticated ? (
            <div className="nav-user">
              <Link to="/profile" className="nav-user-link">
                <User className="nav-link-icon" />
                {user?.name}
              </Link>
              <button onClick={logout} className="nav-logout">
                <LogOut className="nav-link-icon" />
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="button button-secondary">Login</Link>
              <Link to="/register" className="button button-primary">Register</Link>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="nav-menu-button mobile">
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="nav-mobile">
          <div className="nav-mobile-links">
            <Link to="/" className="nav-mobile-link" onClick={toggleMenu}>Home</Link>
            <Link to="/search" className="nav-mobile-link" onClick={toggleMenu}>
              <Search className="nav-link-icon" />
              Browse Items
            </Link>
            <Link to="/item/new" className="nav-mobile-link" onClick={toggleMenu}>
              <PlusCircle className="nav-link-icon" />
              Report Item
            </Link>
          </div>
          
          <div className="nav-mobile-auth">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-mobile-link" onClick={toggleMenu}>
                  <User className="nav-link-icon" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="nav-mobile-link"
                >
                  <LogOut className="nav-link-icon" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-mobile-link" onClick={toggleMenu}>Login</Link>
                <Link to="/register" className="nav-mobile-link" onClick={toggleMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;