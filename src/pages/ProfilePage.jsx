import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    preferred_meeting_points: user?.preferred_meeting_points || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMeetingPoint, setNewMeetingPoint] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMeetingPoint = () => {
    if (newMeetingPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        preferred_meeting_points: [...(prev.preferred_meeting_points || []), newMeetingPoint.trim()]
      }));
      setNewMeetingPoint('');
    }
  };

  const handleRemoveMeetingPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      preferred_meeting_points: prev.preferred_meeting_points.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone_number: formData.phone_number,
          preferred_meeting_points: formData.preferred_meeting_points
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">Profile Settings</h1>
            <div className="member-since">
              Member since {new Date(user?.created_at).toLocaleDateString()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Your full name"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  className="form-input"
                  disabled
                />
              </div>
              <p className="form-hint">Email cannot be changed</p>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Your phone number"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Meeting Points</label>
              <div className="meeting-points">
                <div className="meeting-point-input">
                  <div className="input-wrapper">
                    <MapPin className="input-icon" />
                    <input
                      type="text"
                      value={newMeetingPoint}
                      onChange={(e) => setNewMeetingPoint(e.target.value)}
                      className="form-input"
                      placeholder="Add a meeting point"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMeetingPoint}
                    className="save-button"
                    disabled={!newMeetingPoint.trim() || isSubmitting}
                  >
                    Add
                  </button>
                </div>

                <div className="meeting-point-list">
                  {formData.preferred_meeting_points?.map((point, index) => (
                    <div key={index} className="meeting-point-item">
                      <span className="meeting-point-text">{point}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMeetingPoint(index)}
                        className="remove-button"
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="save-button"
                disabled={isSubmitting}
              >
                <Save className="save-icon" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;