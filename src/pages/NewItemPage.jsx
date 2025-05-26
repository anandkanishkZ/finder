import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'documents', label: 'Documents' },
  { value: 'keys', label: 'Keys' },
  { value: 'pets', label: 'Pets' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'other', label: 'Other' },
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
    contact_info: user?.email || '',
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
            className="button button-primary"
          >
            Login
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
    
    // Clear error when user starts typing
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
    
    if (!formData.contact_info.trim()) {
      newErrors.contact_info = 'Contact information is required';
    } else if (!formData.contact_info.includes('@')) {
      newErrors.contact_info = 'Please enter a valid email address';
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
        image_url: imagePreview,
        user_id: user?.id,
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
    <div className="new-item">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <ArrowLeft className="back-button-icon" />
        Back
      </button>
      
      <div className="new-item-card">
        <div className="new-item-content">
          <h1 className="new-item-title">Report an Item</h1>
          
          <form onSubmit={handleSubmit} className="new-item-form">
            <div className="form-grid">
              <div className="form-field-full">
                <div className="status-toggle">
                  <label className="status-label">
                    Item Status
                  </label>
                  <div className="toggle-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="status"
                        checked={formData.status === 'found'}
                        onChange={(e) => setFormData({
                          ...formData,
                          status: e.target.checked ? 'found' : 'lost'
                        })}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-label">
                      {formData.status === 'lost' ? 'Lost Item' : 'Found Item'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="form-field-full">
                <label htmlFor="name" className="form-label">
                  Item Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., iPhone 13 Pro, Gold Ring, Car Keys"
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
              
              <div className="form-field-full">
                <label htmlFor="description" className="form-label">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Provide a detailed description of the item, including any identifying features..."
                />
                {errors.description && <p className="error-message">{errors.description}</p>}
              </div>
              
              <div className="form-field">
                <label htmlFor="category" className="form-label">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="error-message">{errors.category}</p>}
              </div>
              
              <div className="form-field">
                <label htmlFor="date" className="form-label">
                  Date {formData.status === 'lost' ? 'Lost' : 'Found'}*
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`form-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <p className="error-message">{errors.date}</p>}
              </div>
              
              <div className="form-field-full">
                <label htmlFor="location" className="form-label">
                  Location*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`form-input ${errors.location ? 'error' : ''}`}
                  placeholder="e.g., Central Park, NYC Public Library, Main Street Mall"
                />
                {errors.location && <p className="error-message">{errors.location}</p>}
              </div>
              
              <div className="form-field-full">
                <label className="form-label">
                  Item Image
                </label>
                {!imagePreview ? (
                  <div className="image-upload">
                    <Camera className="upload-icon" />
                    <div className="upload-text">
                      <label htmlFor="image-upload" className="upload-label">
                        Upload an image
                      </label>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <p className="upload-hint">or drag and drop</p>
                      <p className="upload-formats">PNG, JPG, GIF up to 10MB</p>
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
              
              <div className="form-field-full">
                <label htmlFor="contact_info" className="form-label">
                  Contact Email*
                </label>
                <input
                  type="email"
                  id="contact_info"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className={`form-input ${errors.contact_info ? 'error' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.contact_info && <p className="error-message">{errors.contact_info}</p>}
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
                    <span className="checkbox-text">
                      Keep my contact information private (users will need to request access)
                    </span>
                  </label>
                </div>
              )}
            </div>
            
            {errors.submit && (
              <div className="error-message submit-error">
                {errors.submit}
              </div>
            )}
            
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="button button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="button button-primary"
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