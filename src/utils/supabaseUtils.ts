
import { supabase, safeTable } from '@/integrations/supabase/client';

// Helper for notifications
export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: string, 
  metadata?: any
) => {
  try {
    // Use the safe table access helper
    const { data, error } = await safeTable('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        metadata: metadata || {},
        read: false
      });
    
    if (error) {
      console.error('Error creating notification:', error);
    }
    
    return data;
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
};

// Helper for categories
export const getCategories = async () => {
  try {
    // Try to get categories from the categories table
    const { data, error } = await safeTable('categories').select('*');
    
    if (error || !data) {
      // Fallback to default categories
      return ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Other'];
    }
    
    return data.map((cat: any) => cat.name || '');
  } catch (err) {
    console.error('Error fetching categories:', err);
    return ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Other'];
  }
};

// Helper for market trends
export const getMarketTrends = async () => {
  try {
    const { data, error } = await safeTable('market_trends').select('*').order('date', { ascending: false });
    
    if (error || !data) {
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Error fetching market trends:', err);
    return [];
  }
};

// Helper for documents
export const getUserDocuments = async (userId: string) => {
  try {
    const { data, error } = await safeTable('documents')
      .select('*')
      .eq('user_id', userId);
    
    if (error || !data) {
      // Fallback
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Error fetching user documents:', err);
    return [];
  }
};

// Helper function to add document
export const addUserDocument = async (
  userId: string, 
  name: string, 
  type: string, 
  url: string, 
  size: number
) => {
  try {
    const { data, error } = await safeTable('documents')
      .insert({
        user_id: userId,
        name,
        type,
        url,
        size
      });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error adding user document:', err);
    return null;
  }
};

// Helper function to delete document
export const deleteUserDocument = async (documentId: string) => {
  try {
    const { error } = await safeTable('documents')
      .delete()
      .eq('id', documentId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting user document:', err);
    return false;
  }
};
