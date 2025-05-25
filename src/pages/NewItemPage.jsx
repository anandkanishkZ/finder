import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2, ArrowLeft, AlertCircle, MapPin, User, Calendar, Tag, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import '../styles/NewItemPage.css';

const categoryOptions = [
  { value: 'electronics', label: 'Electronics', icon: <MapPin /> },
  { value: 'jewelry', label: 'Jewelry', icon: <MapPin /> },
  { value: 'clothing', label: 'Clothing', icon: <MapPin /> },
  { value: 'documents', label: 'Documents', icon: <MapPin /> },
  { value: 'keys', label: 'Keys', icon: <MapPin /> },
  { value: 'pets', label: 'Pets', icon: <MapPin /> },
  { value: 'accessories', label: 'Accessories', icon: <MapPin /> },
  { value: 'other', label: 'Other', icon: <MapPin /> },
];

const NewItemPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useItems();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'lost',
    date: new Date().toISOString().split('T')[0],
    location: '',
    contactInfo: user?.email || '',
    anonymous: false,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-required-content">
          <AlertCircle className="auth-required-icon" />
          <h2 className="auth-required-title">Authentication Required</h2>
          <p className="auth-required-message">
            You need to be logged in to report a lost or found item.
          </p>
          <button
            onClick={() => navigate('/login', { state: { redirectTo: '/item/new' } })}
            className="auth-required-button"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    } else if (!formData.contactInfo.includes('@')) {
      newErrors.contactInfo = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newItem = await addItem({
        ...formData,
        date: new Date(formData.date),
        imageUrl: imagePreview,
        userId: user?.id,
      });
      
      navigate(`/item/${newItem.id}`);
    } catch (error) {
      console.error('Failed to create item:', error);
      setErrors({
        ...errors,
        submit: 'Failed to create item. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="new-item-page">
      <div className="new-item-container">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          Back
        </button>
        
        <div className="new-item-card">
          <div className="new-item-header">
            <h1 className="new-item-title">Report an Item</h1>
            <p className="new-item-subtitle">
              Please provide accurate information to help connect lost items with their owners
            </p>
          </div>
          
          {errors.submit && (
            <div className="error-banner">
              <AlertCircle className="error-icon" />
              <p>{errors.submit}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="new-item-form">
            <div className="form-grid">
              <div className="form-field-full">
                <div className="status-toggle">
                  <label className="status-label">Item Status</label>
                  <div className="toggle-group">
                    <button
                      type="button"
                      className={`toggle-button ${formData.status === 'lost' ? 'active' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'status', value: 'lost' } })}
                    >
                      <MapPin className="toggle-icon" />
                      Lost Item
                    </button>
                    <button
                      type="button"
                      className={`toggle-button ${formData.status === 'found' ? 'active' : ''}`}
                      onClick={() => handleInputChange({ target: { name: 'status', value: 'found' } })}
                    >
                      <User className="toggle-icon" />
                      Found Item
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="name" className="form-label">
                  Item Name*
                </label>
                <div className="input-group">
                  <Tag className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g., iPhone 13 Pro, Gold Ring"
                  />
                </div>
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
              
              <div className="form-field">
                <label htmlFor="category" className="form-label">
                  Category*
                </label>
                <div className="input-group">
                  <MapPin className="input-icon" />
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`form-input ${errors.category ? 'error' : ''}`}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="error-message">{errors.category}</p>}
              </div>
              
              <div className="form-field">
                <label htmlFor="date" className="form-label">
                  Date {formData.status === 'lost' ? 'Lost' : 'Found'}*
                </label>
                <div className="input-group">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`form-input ${errors.date ? 'error' : ''}`}
                  />
                </div>
                {errors.date && <p className="error-message">{errors.date}</p>}
              </div>
              
              <div className="form-field-full">
                <label htmlFor="description" className="form-label">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Provide a detailed description of the item..."
                  rows={4}
                />
                {errors.description && <p className="error-message">{errors.description}</p>}
              </div>
              
              <div className="form-field-full">
                <label htmlFor="location" className="form-label">
                  Location*
                </label>
                <div className="input-group">
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`form-input ${errors.location ? 'error' : ''}`}
                    placeholder="e.g., Central Park, NYC Public Library"
                  />
                </div>
                {errors.location && <p className="error-message">{errors.location}</p>}
              </div>
              
              <div className="form-field-full">
                <label className="form-label">
                  Item Image
                </label>
                {!imagePreview ? (
                  <div className="image-upload">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input"
                    />
                    <div className="upload-content">
                      <Camera className="upload-icon" />
                      <p className="upload-text">
                        <span className="upload-link">Upload an image</span>
                        <span className="upload-or">or drag and drop</span>
                      </p>
                      <p className="upload-hint">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Item preview"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="remove-image"
                    >
                      <Trash2 className="remove-icon" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="form-field">
                <label htmlFor="contactInfo" className="form-label">
                  Contact Email*
                </label>
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    className={`form-input ${errors.contactInfo ? 'error' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.contactInfo && <p className="error-message">{errors.contactInfo}</p>}
              </div>
              
              {formData.status === 'found' && (
                <div className="form-field-full">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <Lock className="checkbox-icon" />
                    <span className="checkbox-text">
                      Keep my contact information private
                    </span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewItemPage;