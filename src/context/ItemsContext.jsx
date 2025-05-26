import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { generateQRCode, calculateDistance } from '../utils/helpers';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
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

  const getItemById = async (id) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting item:', error);
      return undefined;
    }
  };

  const getItemsByStatus = async (status) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('status', status);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting items by status:', error);
      return [];
    }
  };

  const getItemsByCategory = async (category) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('category', category);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting items by category:', error);
      return [];
    }
  };

  const searchItems = async (query) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
    }
  };

  const filterItems = async (filters) => {
    try {
      let query = supabase.from('items').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data;

      if (filters.location && filters.radius) {
        filteredData = filteredData.filter(item => {
          if (!item.coordinates) return false;
          const distance = calculateDistance(filters.location, item.coordinates);
          return distance <= filters.radius;
        });
      }

      return filteredData;
    } catch (error) {
      console.error('Error filtering items:', error);
      return [];
    }
  };

  const getSimilarItems = async (itemId) => {
    const item = await getItemById(itemId);
    if (!item) return [];

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('category', item.category)
        .neq('id', itemId)
        .limit(5);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting similar items:', error);
      return [];
    }
  };

  const getNearbyItems = async (coordinates, radius) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .not('coordinates', 'is', null);

      if (error) throw error;

      return data.filter(item => {
        if (!item.coordinates) return false;
        const distance = calculateDistance(coordinates, item.coordinates);
        return distance <= radius;
      });
    } catch (error) {
      console.error('Error getting nearby items:', error);
      return [];
    }
  };

  const getRecommendedSafetyPoints = async (coordinates) => {
    try {
      const { data, error } = await supabase
        .from('safety_points')
        .select('*');

      if (error) throw error;

      return data
        .map(point => ({
          ...point,
          distance: calculateDistance(coordinates, point.coordinates),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 3);
    } catch (error) {
      console.error('Error getting safety points:', error);
      return [];
    }
  };

  const verifyItem = async (itemId, verificationCode) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('verification_code')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return data.verification_code === verificationCode;
    } catch (error) {
      console.error('Error verifying item:', error);
      return false;
    }
  };

  const reportItem = async (itemId, reason, description) => {
    try {
      const { error } = await supabase
        .from('reports')
        .insert([{ item_id: itemId, reason, description }]);

      if (error) throw error;
      toast.success('Report submitted successfully');
    } catch (error) {
      console.error('Error reporting item:', error);
      toast.error('Failed to submit report');
      throw error;
    }
  };

  const incrementViews = async (itemId) => {
    try {
      const { error } = await supabase.rpc('increment_views', { item_id: itemId });
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const getReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, items(*), profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  };

  const updateReport = async (id, status) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Report status updated successfully');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report status');
      throw error;
    }
  };

  const value = {
    items,
    isLoading,
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
    getRecommendedSafetyPoints,
    verifyItem,
    reportItem,
    incrementViews,
    getReports,
    updateReport,
  };

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};