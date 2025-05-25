import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { generateQRCode, calculateDistance } from '../utils/helpers';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      setError('Failed to load items');
      toast.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (newItem) => {
    try {
      const qrCode = await generateQRCode();
      const { data, error } = await supabase
        .from('items')
        .insert([{ ...newItem, qr_code: qrCode }])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
      throw error;
    }
  };

  const updateItem = async (id, updatedFields) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));

      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
      throw error;
    }
  };

  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      throw error;
    }
  };

  const getItemById = (id) => {
    return items.find(item => item.id === id);
  };

  const getItemsByStatus = (status) => {
    return items.filter(item => item.status === status);
  };

  const getItemsByCategory = (category) => {
    return items.filter(item => item.category === category);
  };

  const searchItems = (query) => {
    const searchQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.location.toLowerCase().includes(searchQuery)
    );
  };

  const filterItems = (filters) => {
    return items.filter(item => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) return false;
      if (filters.location && filters.radius) {
        if (!item.lat || !item.lng) return false;
        const distance = calculateDistance(filters.location, { lat: item.lat, lng: item.lng });
        if (distance > filters.radius) return false;
      }
      return true;
    });
  };

  const getSimilarItems = (itemId) => {
    const item = getItemById(itemId);
    if (!item) return [];
    
    return items
      .filter(i => i.category === item.category && i.id !== itemId)
      .slice(0, 5);
  };

  const getNearbyItems = (coordinates, radius) => {
    return items.filter(item => {
      if (!item.lat || !item.lng) return false;
      const distance = calculateDistance(coordinates, { lat: item.lat, lng: item.lng });
      return distance <= radius;
    });
  };

  const value = {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByStatus,
    getItemsByCategory,
    searchItems,
    filterItems,
    getSimilarItems,
    getNearbyItems,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};