
import { supabase } from '@/integrations/supabase/client';

// Helper for notifications
export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: string, 
  metadata?: any
) => {
  try {
    const { data, error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_metadata: metadata || {}
    });
    
    if (error) {
      // Fallback if RPC doesn't exist
      const { error: insertError } = await supabase.rpc('exec_sql', {
        sql_query: `
          INSERT INTO public.notifications (user_id, title, message, type, metadata)
          VALUES ('${userId}', '${title}', '${message}', '${type}', '${JSON.stringify(metadata || {})}')
        `
      });
      
      if (insertError) {
        console.error('Error creating notification:', insertError);
      }
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
    const { data, error } = await supabase.rpc('get_categories');
    
    if (error || !data) {
      // Fallback to default categories
      return ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Other'];
    }
    
    return data.map((cat: any) => cat.name);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Other'];
  }
};

// Helper for market trends
export const getMarketTrends = async () => {
  try {
    const { data, error } = await supabase.rpc('get_market_trends');
    
    if (error || !data) {
      // Fallback to direct query using RPC to execute raw SQL
      const { data: fallbackData, error: fallbackError } = await supabase.rpc('exec_sql', {
        sql_query: `
          SELECT * FROM market_trends 
          ORDER BY date DESC
        `
      });
      
      if (fallbackError) {
        throw fallbackError;
      }
      
      return fallbackData || [];
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
    const { data, error } = await supabase.rpc('get_user_documents', {
      p_user_id: userId
    });
    
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
    const { data, error } = await supabase.rpc('add_user_document', {
      p_user_id: userId,
      p_name: name,
      p_type: type,
      p_url: url,
      p_size: size
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
    const { data, error } = await supabase.rpc('delete_user_document', {
      p_document_id: documentId
    });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting user document:', err);
    return false;
  }
};
