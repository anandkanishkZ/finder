import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, MessageCircle, Zap, User, ArrowRight } from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ui/ItemCard';
import '../styles/HomePage.css';

const HomePage = () => {
  const { items, isLoading } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const recentItems = items
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Lost something? Found something?
          </h1>
          <p className="hero-subtitle">
            FinderKeeper helps reconnect people with their lost items and rewards honest finders.
          </p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search for lost or found items..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <Search size={20} />
                Search
              </button>
            </div>
          </form>
          
          <div className="hero-actions">
            <Link to="/lost" className="hero-button secondary">
              <MapPin size={24} />
              I Lost Something
            </Link>
            <Link to="/found" className="hero-button primary">
              <Compass size={24} />
              I Found Something
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="categories">
        <h2 className="categories-title">Browse by Category</h2>
        
        <div className="categories-grid">
          {[
            { name: 'Electronics', icon: <Zap />, category: 'electronics' },
            { name: 'Jewelry', icon: <MapPin />, category: 'jewelry' },
            { name: 'Documents', icon: <MessageCircle />, category: 'documents' },
            { name: 'Keys', icon: <Compass />, category: 'keys' },
            { name: 'Pets', icon: <Zap />, category: 'pets' },
            { name: 'Person', icon: <User />, category: 'person' },
            { name: 'Accessories', icon: <MessageCircle />, category: 'accessories' },
            { name: 'Other', icon: <Compass />, category: 'other' },
          ].map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.category)}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </section>
      
      {/* Recent Items Section */}
      <section className="recent-items">
        <div className="recent-items-header">
          <h2 className="recent-items-title">Recent Listings</h2>
          <Link to="/search" className="view-all-link">
            View All <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="items-grid">
          {recentItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;