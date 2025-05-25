import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, MapPin, PlusCircle, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <MapPin className="navbar-logo-icon" />
            <span className="navbar-logo-text">FinderKeeper</span>
          </Link>

          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/search" className="navbar-link">
              <Search className="navbar-link-icon" />
              Browse Items
            </Link>
            <Link to="/item/new" className="navbar-link">
              <PlusCircle className="navbar-link-icon" />
              Report Item
            </Link>
            {isAdmin && (
              <Link to="/admin" className="navbar-link admin-link">
                <Settings className="navbar-link-icon" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          {!isAuthenticated ? (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-button login">Login</Link>
              <Link to="/register" className="navbar-button register">Register</Link>
            </div>
          ) : (
            <div className="navbar-auth">
              <button onClick={logout} className="navbar-button login">Logout</button>
            </div>
          )}

          <button className="navbar-menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="navbar-mobile">
          <div className="navbar-mobile-links">
            <Link to="/" className="navbar-mobile-link" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/search" className="navbar-mobile-link" onClick={toggleMenu}>
              <Search className="navbar-link-icon" />
              Browse Items
            </Link>
            <Link to="/item/new" className="navbar-mobile-link" onClick={toggleMenu}>
              <PlusCircle className="navbar-link-icon" />
              Report Item
            </Link>
            {isAdmin && (
              <Link to="/admin" className="navbar-mobile-link" onClick={toggleMenu}>
                <Settings className="navbar-link-icon" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="navbar-mobile-auth">
              <Link to="/login" className="navbar-mobile-button login" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" className="navbar-mobile-button register" onClick={toggleMenu}>
                Register
              </Link>
            </div>
          ) : (
            <div className="navbar-mobile-auth">
              <button onClick={logout} className="navbar-mobile-button login">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;