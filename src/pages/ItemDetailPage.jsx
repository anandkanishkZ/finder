import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Tag, Mail, Phone, AlertCircle, ArrowLeft, Eye, EyeOff, MessageCircle
} from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';

const categoryLabels = {
  electronics: 'Electronics',
  jewelry: 'Jewelry',
  clothing: 'Clothing',
  documents: 'Documents',
  keys: 'Keys',
  pets: 'Pets',
  accessories: 'Accessories',
  other: 'Other',
};

const ItemDetailPage = () => {
  const { id } = useParams();
  const { getItemById, updateItem } = useItems();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  
  const item = getItemById(id || '');
  
  if (!item) {
    return (
      <div className="item-not-found">
        <div className="item-not-found-content">
          <AlertCircle className="item-not-found-icon" />
          <h2 className="item-not-found-title">Item Not Found</h2>
          <p className="item-not-found-message">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="item-not-found-link">
            <ArrowLeft className="item-not-found-link-icon" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const isOwner = user?.id === item.userId;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the message to the backend
    alert('Message sent successfully! The user will be notified.');
    setContactMessage('');
    setShowContactForm(false);
  };
  
  const handleClaimItem = async () => {
    if (item.status === 'found' && isAuthenticated) {
      const updatedItem = await updateItem(item.id, { status: 'claimed' });
      if (updatedItem) {
        alert('You have claimed this item. Please contact the finder to arrange pickup.');
      } else {
        alert('Failed to claim the item. Please try again later.');
      }
    } else if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/item/${item.id}` } });
    }
  };
  
  const handleMarkAsReturned = async () => {
    if ((item.status === 'claimed' || item.status === 'found') && isOwner) {
      const updatedItem = await updateItem(item.id, { status: 'returned' });
      if (updatedItem) {
        alert('Item has been marked as returned. Thank you for using FinderKeeper!');
      } else {
        alert('Failed to update the item status. The item may have been removed or is no longer available.');
      }
    }
  };
  
  return (
    <div className="item-detail">
      <Link to="/" className="back-link">
        <ArrowLeft className="back-link-icon" />
        Back to listings
      </Link>
      
      <div className="item-detail-card">
        <div className="item-detail-content">
          <div className="item-detail-image">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="item-image"
              />
            ) : (
              <div className="item-image-placeholder">
                <span>No image available</span>
              </div>
            )}
          </div>
          
          <div className="item-detail-info">
            <div className="item-detail-header">
              <div>
                <h1 className="item-title">{item.name}</h1>
                <div className={`item-status status-${item.status}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
              
              {item.status === 'found' && isAuthenticated && !isOwner && (
                <button
                  onClick={handleClaimItem}
                  className="button button-primary"
                >
                  Claim This Item
                </button>
              )}
              
              {(item.status === 'claimed' || item.status === 'found') && isOwner && (
                <button
                  onClick={handleMarkAsReturned}
                  className="button button-secondary"
                >
                  Mark as Returned
                </button>
              )}
            </div>
            
            <div className="item-description">
              <h2 className="section-title">Description</h2>
              <p>{item.description}</p>
            </div>
            
            <div className="item-details-grid">
              <div className="item-detail-field">
                <Calendar className="field-icon" />
                <div>
                  <p className="field-label">Date {item.status === 'lost' ? 'Lost' : 'Found'}</p>
                  <p className="field-value">{formatDate(item.date)}</p>
                </div>
              </div>
              
              <div className="item-detail-field">
                <MapPin className="field-icon" />
                <div>
                  <p className="field-label">Location</p>
                  <p className="field-value">{item.location}</p>
                </div>
              </div>
              
              <div className="item-detail-field">
                <Tag className="field-icon" />
                <div>
                  <p className="field-label">Category</p>
                  <p className="field-value">{categoryLabels[item.category]}</p>
                </div>
              </div>
              
              <div className="item-detail-field">
                <Calendar className="field-icon" />
                <div>
                  <p className="field-label">Posted On</p>
                  <p className="field-value">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {!isOwner && (
              <div className="contact-section">
                <h2 className="section-title">Contact Information</h2>
                
                {item.anonymous && !showContactInfo ? (
                  <div className="contact-protected">
                    <p>Contact information is protected. Click below to view.</p>
                    <button
                      onClick={() => setShowContactInfo(true)}
                      className="button button-secondary"
                    >
                      <Eye className="button-icon" />
                      Show Contact Info
                    </button>
                  </div>
                ) : (
                  <div className="contact-info">
                    {item.anonymous && (
                      <button
                        onClick={() => setShowContactInfo(false)}
                        className="button button-text"
                      >
                        <EyeOff className="button-icon" />
                        Hide Contact Info
                      </button>
                    )}
                    <div className="contact-field">
                      <Mail className="field-icon" />
                      <span>{item.contactInfo}</span>
                    </div>
                    <div className="contact-field">
                      <Phone className="field-icon" />
                      <span>(Contact by email)</span>
                    </div>
                  </div>
                )}
                
                {isAuthenticated ? (
                  <>
                    {!showContactForm ? (
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="button button-primary"
                      >
                        <MessageCircle className="button-icon" />
                        Contact {item.status === 'lost' ? 'Owner' : 'Finder'}
                      </button>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="contact-form">
                        <div className="form-group">
                          <label htmlFor="message" className="form-label">
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="form-textarea"
                            placeholder={`Hi, I'm interested in your ${item.status === 'lost' ? 'lost' : 'found'} item...`}
                            required
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            className="button button-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="button button-primary"
                          >
                            Send Message
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="login-prompt">
                    <Link
                      to="/login"
                      className="button button-primary"
                    >
                      Login to Contact
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;