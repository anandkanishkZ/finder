import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, MessageCircle, Zap, User } from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ui/ItemCard';
import { ItemCategory } from '../types';

const HomePage: React.FC = () => {
  const { items, searchItems } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const recentItems = items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: ItemCategory) => {
    navigate(`/search?category=${category}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Lost something? Found something?
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              FinderKeeper helps reconnect people with their lost items and rewards honest finders.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row shadow-lg rounded-lg overflow-hidden">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Search for lost or found items..."
                    className="w-full px-4 py-3 text-gray-900 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 transition-colors duration-300 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </form>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/lost"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm px-6 py-3 rounded-full text-white border border-white border-opacity-30 transition-all duration-300"
              >
                I Lost Something
              </Link>
              <Link
                to="/found"
                className="bg-white text-indigo-800 hover:bg-opacity-90 px-6 py-3 rounded-full transition-all duration-300"
              >
                I Found Something
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Electronics', icon: <Zap />, category: 'electronics' as ItemCategory },
              { name: 'Jewelry', icon: <MapPin />, category: 'jewelry' as ItemCategory },
              { name: 'Documents', icon: <MessageCircle />, category: 'documents' as ItemCategory },
              { name: 'Keys', icon: <Compass />, category: 'keys' as ItemCategory },
              { name: 'Pets', icon: <Zap />, category: 'pets' as ItemCategory },
              { name: 'Person', icon: <User />, category: 'person' as ItemCategory },
              { name: 'Accessories', icon: <MessageCircle />, category: 'accessories' as ItemCategory },
              { name: 'Other', icon: <Compass />, category: 'other' as ItemCategory },
            ].map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.category)}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recent Items Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Listings</h2>
            <Link
              to="/search"
              className="text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How FinderKeeper Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Report</h3>
              <p className="text-gray-600">
                Quickly report a lost item or register something you've found to help it find its way home.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">
                Our platform helps connect item owners with finders through our secure messaging system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reunite</h3>
              <p className="text-gray-600">
                Arrange a safe meetup to retrieve your belongings and reward honest finders.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to find what you're looking for?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of people who have successfully recovered their lost items or helped others find theirs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-md transition-colors duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              to="/item/new"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium px-8 py-3 rounded-md transition-colors duration-300"
            >
              Report an Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;