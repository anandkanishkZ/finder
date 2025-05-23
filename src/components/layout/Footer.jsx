import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <MapPin className="footer-logo-icon" />
              <span className="footer-logo-text">FinderKeeper</span>
            </div>
            <p className="footer-description">
              Helping people reconnect with their lost belongings and rewarding honest finders since 2025.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <Facebook />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter />
              </a>
              <a href="#" className="footer-social-link">
                <Instagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/lost" className="footer-link">Lost Items</Link></li>
              <li><Link to="/found" className="footer-link">Found Items</Link></li>
              <li><Link to="/search" className="footer-link">Search</Link></li>
              <li><Link to="/item/new" className="footer-link">Report Item</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li><Link to="/search?category=electronics" className="footer-link">Electronics</Link></li>
              <li><Link to="/search?category=jewelry" className="footer-link">Jewelry</Link></li>
              <li><Link to="/search?category=documents" className="footer-link">Documents</Link></li>
              <li><Link to="/search?category=keys" className="footer-link">Keys</Link></li>
              <li><Link to="/search?category=pets" className="footer-link">Pets</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span>123 Find Street, Recovery City, FC 10001</span>
              </li>
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span>help@finderkeeper.com</span>
              </li>
              <li className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">© 2025 FinderKeeper. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
              <Link to="/faq" className="footer-bottom-link">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;