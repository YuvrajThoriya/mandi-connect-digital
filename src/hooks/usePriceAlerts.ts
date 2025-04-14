
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PriceAlert {
  id: string;
  user_id: string;
  product_name: string;
  product_id?: string;
  condition: 'above' | 'below';
  target_price: number;
  status: 'active' | 'triggered' | 'disabled';
  created_at: string;
  updated_at: string;
}

// Mock data for development
const MOCK_ALERTS: PriceAlert[] = [
  {
    id: 'mock-1',
    user_id: '',  // Will be set dynamically
    product_name: 'Organic Wheat',
    product_id: 'product-123',
    condition: 'above',
    target_price: 4500,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-2',
    user_id: '',  // Will be set dynamically
    product_name: 'Premium Rice',
    condition: 'below',
    target_price: 3200,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const usePriceAlerts = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      if (!profile?.id) return;
      
      // For development, use mock data
      // When price_alerts table is created, uncomment this code
      /*
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', profile.id);

      if (error) throw error;
      
      setAlerts(data as PriceAlert[]);
      */
      
      // Use mock data for now, but set the user_id to the current user's id
      const mockData = MOCK_ALERTS.map(alert => ({
        ...alert,
        user_id: profile.id
      }));
      
      setAlerts(mockData);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load price alerts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alertData: Omit<PriceAlert, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      if (!profile?.id) return null;

      // For development, just add to local state
      // When price_alerts table is created, uncomment this code
      /*
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: profile.id,
          product_name: alertData.product_name,
          product_id: alertData.product_id,
          condition: alertData.condition,
          target_price: alertData.target_price,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      
      const newAlert = data as PriceAlert;
      */
      
      // Mock implementation for now
      const newAlert: PriceAlert = {
        id: `mock-${Date.now()}`,
        user_id: profile.id,
        product_name: alertData.product_name,
        product_id: alertData.product_id,
        condition: alertData.condition,
        target_price: alertData.target_price,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setAlerts((prev) => [...prev, newAlert]);
      
      toast({
        title: 'Success',
        description: 'Price alert created successfully.',
      });
      
      return newAlert;
    } catch (error) {
      console.error('Error creating price alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create price alert.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateAlert = async (id: string, updates: Partial<Omit<PriceAlert, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      // For development, just update local state
      // When price_alerts table is created, uncomment this code
      /*
      const { data, error } = await supabase
        .from('price_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedAlert = data as PriceAlert;
      */
      
      // Mock implementation for now
      setAlerts((prev) =>
        prev.map((alert) => 
          alert.id === id 
            ? { 
                ...alert, 
                ...updates, 
                updated_at: new Date().toISOString() 
              } 
            : alert
        )
      );
      
      toast({
        title: 'Success',
        description: 'Price alert updated successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating price alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update price alert.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      // For development, just remove from local state
      // When price_alerts table is created, uncomment this code
      /*
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      */
      
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      
      toast({
        title: 'Success',
        description: 'Price alert deleted successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting price alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete price alert.',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchAlerts();
    }
  }, [profile?.id]);

  return {
    alerts,
    loading,
    createAlert,
    updateAlert,
    deleteAlert,
    refreshAlerts: fetchAlerts,
  };
};
