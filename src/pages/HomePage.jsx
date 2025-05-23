import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, MessageCircle, Zap, User } from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ui/ItemCard';

const HomePage = () => {
  const { items, searchItems } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const recentItems = items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
              <button type="submit" className="button button-primary">
                <Search className="button-icon" />
                Search
              </button>
            </div>
          </form>
          
          <div className="hero-actions">
            <Link to="/lost" className="button button-outline-white">
              I Lost Something
            </Link>
            <Link to="/found" className="button button-white">
              I Found Something
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          
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
        </div>
      </section>
      
      {/* Recent Items Section */}
      <section className="recent-items">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recent Listings</h2>
            <Link to="/search" className="section-link">
              View All →
            </Link>
          </div>
          
          <div className="items-grid">
            {recentItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How FinderKeeper Works</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MapPin />
              </div>
              <h3 className="feature-title">Report</h3>
              <p className="feature-description">
                Quickly report a lost item or register something you've found to help it find its way home.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Compass />
              </div>
              <h3 className="feature-title">Connect</h3>
              <p className="feature-description">
                Our platform helps connect item owners with finders through our secure messaging system.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <MessageCircle />
              </div>
              <h3 className="feature-title">Reunite</h3>
              <p className="feature-description">
                Arrange a safe meetup to retrieve your belongings and reward honest finders.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to find what you're looking for?</h2>
          <p className="cta-description">
            Join thousands of people who have successfully recovered their lost items or helped others find theirs.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="button button-white">
              Sign Up Now
            </Link>
            <Link to="/item/new" className="button button-outline-white">
              Report an Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;