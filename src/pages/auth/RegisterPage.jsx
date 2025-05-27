import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/RegisterPage.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">
          <MapPin className="register-logo-icon" />
        </div>

        <h1 className="register-title">Create an account</h1>
        <p className="register-subtitle">
          Join FinderKeeper to report lost items or help others find their belongings
        </p>

        {errors.general && (
          <div className="error-message general">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="create-account-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="terms-text">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="link">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="link">Privacy Policy</Link>
          </p>
        </form>

        <div className="login-prompt">
          Already have an account?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;