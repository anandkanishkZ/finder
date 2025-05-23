import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { redirectTo } = location.state || {};
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData.email, formData.password);
      navigate(redirectTo || '/');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Invalid email or password',
      });
    }
  };
  
  const handleDemoUserLogin = async (e) => {
    e.preventDefault();
    try {
      await login('user@example.com', 'password');
      navigate(redirectTo || '/');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Failed to login with demo user account',
      });
    }
  };

  const handleDemoAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await login('admin@example.com', 'adminpassword');
      navigate(redirectTo || '/admin-dashboard');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Failed to login with demo admin account',
      });
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <MapPin className="auth-logo-icon" />
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Sign in to your account to manage your lost and found items
          </p>
        </div>
        
        {errors.general && (
          <div className="auth-error">
            <AlertCircle className="error-icon" />
            <p className="error-message">{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                className="checkbox"
              />
              <span>Remember me</span>
            </label>
            
            <a href="#" className="forgot-password">
              Forgot your password?
            </a>
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="button button-primary full-width"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <button
              onClick={handleDemoUserLogin}
              className="button button-secondary full-width"
            >
              Demo User Login (user@example.com)
            </button>

            <button
              onClick={handleDemoAdminLogin}
              className="button button-secondary full-width"
            >
              Demo Admin Login (admin@example.com)
            </button>
          </div>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;