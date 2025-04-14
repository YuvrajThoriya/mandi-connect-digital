
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

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

export const usePriceAlerts = () => {
  const { profile } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      if (!profile?.id) return;
      
      // Use the correct object typing to avoid infinite type instantiation
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', profile.id);

      if (error) throw error;
      
      // Use type assertion to convert to PriceAlert[]
      setAlerts(data as unknown as PriceAlert[]);
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
      
      // Use type assertion
      const newAlert = data as unknown as PriceAlert;
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
      const { data, error } = await supabase
        .from('price_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Use type assertion
      const updatedAlert = data as unknown as PriceAlert;
      
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? updatedAlert : alert))
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
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
