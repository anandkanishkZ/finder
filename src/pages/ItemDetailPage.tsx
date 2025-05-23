import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Tag, Mail, Phone, AlertCircle, ArrowLeft, Eye, EyeOff, MessageCircle
} from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';

const categoryLabels: Record<string, string> = {
  electronics: 'Electronics',
  jewelry: 'Jewelry',
  clothing: 'Clothing',
  documents: 'Documents',
  keys: 'Keys',
  pets: 'Pets',
  accessories: 'Accessories',
  other: 'Other',
};

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItemById, updateItem } = useItems();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  
  const item = getItemById(id || '');
  
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-4">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const isOwner = user?.id === item.userId;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const statusBgColor = {
    lost: 'bg-red-50 border-red-200 text-red-700',
    found: 'bg-green-50 border-green-200 text-green-700',
    claimed: 'bg-blue-50 border-blue-200 text-blue-700',
    returned: 'bg-purple-50 border-purple-200 text-purple-700',
  }[item.status];
  
  const handleContactSubmit = (e: React.FormEvent) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to listings
      </Link>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">No image available</span>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusBgColor} mb-4`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
              
              {/* Action buttons based on item status and user */}
              {item.status === 'found' && isAuthenticated && !isOwner && (
                <button
                  onClick={handleClaimItem}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300"
                >
                  Claim This Item
                </button>
              )}
              
              {(item.status === 'claimed' || item.status === 'found') && isOwner && (
                <button
                  onClick={handleMarkAsReturned}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                >
                  Mark as Returned
                </button>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Date {item.status === 'lost' ? 'Lost' : 'Found'}</p>
                  <p className="text-gray-900">{formatDate(item.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">{item.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-gray-900">{categoryLabels[item.category]}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="text-gray-900">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {/* Contact Section */}
            {!isOwner && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                
                {item.anonymous && !showContactInfo ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      Contact information is protected. Click below to view.
                    </p>
                    <button
                      onClick={() => setShowContactInfo(true)}
                      className="mt-2 inline-flex items-center text-teal-600 hover:text-teal-800"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Show Contact Info
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {item.anonymous && (
                      <button
                        onClick={() => setShowContactInfo(false)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2"
                      >
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide Contact Info
                      </button>
                    )}
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-800">{item.contactInfo}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-800">(Contact by email)</span>
                    </div>
                  </div>
                )}
                
                {isAuthenticated ? (
                  <>
                    {!showContactForm ? (
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact {item.status === 'lost' ? 'Owner' : 'Finder'}
                      </button>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder={`Hi, I'm interested in your ${item.status === 'lost' ? 'lost' : 'found'} item...`}
                            required
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            Send Message
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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