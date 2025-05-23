import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';

const categoryColors = {
  electronics: 'badge-blue',
  jewelry: 'badge-amber',
  clothing: 'badge-purple',
  documents: 'badge-green',
  keys: 'badge-red',
  pets: 'badge-indigo',
  accessories: 'badge-pink',
  person: 'badge-orange',
  other: 'badge-gray',
};

const statusColors = {
  lost: 'badge-red',
  found: 'badge-green',
  claimed: 'badge-blue',
  returned: 'badge-purple',
};

const ItemCard = ({ item }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/item/${item.id}`} className="item-card">
      <div className="item-card-image-container">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="item-card-image"
          />
        ) : (
          <div className="item-card-image-placeholder">
            <span>No image</span>
          </div>
        )}
        <div className={`item-card-status ${statusColors[item.status]}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </div>
      </div>
      
      <div className="item-card-content">
        <h3 className="item-card-title">{item.name}</h3>
        
        <p className="item-card-description">{item.description}</p>
        
        <div className="item-card-tags">
          <span className={`item-card-category ${categoryColors[item.category]}`}>
            <Tag className="item-card-icon" />
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
        </div>
        
        <div className="item-card-footer">
          <div className="item-card-date">
            <Calendar className="item-card-icon" />
            <span>{formatDate(item.date)}</span>
          </div>
          <div className="item-card-location">
            <MapPin className="item-card-icon" />
            <span>{item.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;