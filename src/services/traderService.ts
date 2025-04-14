
import { supabase } from '@/integrations/supabase/client';
import { safeTableOperation } from '@/utils/safeTableUtil';

// Add any trader-specific service functions
export const traderService = {
  // Example function
  async getTraderProfile(traderId: string) {
    try {
      // @ts-ignore - Using safeTableOperation for profiles
      const { data, error } = await safeTableOperation('profiles')
        .select('*')
        .eq('id', traderId)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching trader profile:', error);
      return { data: null, error };
    }
  },
  
  // Other trader-specific functions can be added here
};
