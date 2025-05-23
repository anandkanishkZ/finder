import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-teal-400" />
              <span className="ml-2 text-xl font-bold">FinderKeeper</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Helping people reconnect with their lost belongings and rewarding honest finders since 2025.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/lost" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Lost Items</Link>
              </li>
              <li>
                <Link to="/found" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Found Items</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Search</Link>
              </li>
              <li>
                <Link to="/item/new" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Report Item</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?category=electronics" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Electronics</Link>
              </li>
              <li>
                <Link to="/search?category=jewelry" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Jewelry</Link>
              </li>
              <li>
                <Link to="/search?category=documents" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Documents</Link>
              </li>
              <li>
                <Link to="/search?category=keys" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Keys</Link>
              </li>
              <li>
                <Link to="/search?category=pets" className="text-gray-300 hover:text-teal-400 transition-colors duration-300">Pets</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="ml-2 text-gray-300">123 Find Street, Recovery City, FC 10001</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-teal-400 flex-shrink-0" />
                <span className="ml-2 text-gray-300">help@finderkeeper.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-teal-400 flex-shrink-0" />
                <span className="ml-2 text-gray-300">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 FinderKeeper. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">Terms of Service</Link>
              <Link to="/faq" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;