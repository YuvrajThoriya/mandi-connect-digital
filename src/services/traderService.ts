
import { supabase, safeTable } from '@/integrations/supabase/client';
import { BusinessDetails, CompanyFormData, ProfileFormData } from '../types/trader';
import { Appointment } from '../types/appointment';
import { Bid } from '../types/bid';
import { Order } from '../types/order';

export const traderService = {
  // Profile Management
  async updateProfile(userId: string, profileData: ProfileFormData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: `${profileData.firstName} ${profileData.lastName}`,
          phone: profileData.phone,
          address: profileData.address,
          bio: profileData.bio
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  },

  // Business Details Management
  async updateBusinessDetails(userId: string, businessData: CompanyFormData) {
    try {
      const { data, error } = await supabase
        .from('business_details')
        .upsert({
          user_id: userId,
          business_name: businessData.companyName,
          business_type: 'trader',
          business_address: businessData.companyAddress,
          gst_number: businessData.gstin,
          registration_number: businessData.tradeLicense,
          business_description: businessData.businessDescription || null,
          operational_areas: businessData.operationalAreas || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating business details:", error);
      return null;
    }
  },

  async getBusinessDetails(userId: string): Promise<BusinessDetails | null> {
    try {
      const { data, error } = await supabase
        .from('business_details')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as BusinessDetails;
    } catch (error) {
      console.error("Error getting business details:", error);
      return null;
    }
  },

  // Bidding Management
  async placeBid(bidData: any): Promise<Bid | null> {
    try {
      const { data, error } = await safeTable<Bid>('bids')
        .insert({
          ...bidData,
          status: 'pending',
          is_highest_bid: false,
          previous_bid_amount: null,
          expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
          auction_end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as Bid;
    } catch (error) {
      console.error("Error placing bid:", error);
      return null;
    }
  },

  async getTraderBids(traderId: string): Promise<Bid[]> {
    try {
      const { data, error } = await safeTable<Bid>('bids')
        .select('*')
        .eq('bidder_id', traderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Bid[];
    } catch (error) {
      console.error("Error getting trader bids:", error);
      return [];
    }
  },

  // Order Management
  async createOrder(orderData: any): Promise<Order | null> {
    try {
      // Calculate total amount
      const totalAmount = orderData.quantity * orderData.price;
      
      // Get the farmer_id from the product
      const { data: productData } = await supabase
        .from('products')
        .select('farmer_id')
        .eq('id', orderData.product_id)
        .single();
      
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id || '';
      
      if (!productData?.farmer_id || !userId) {
        throw new Error('Product not found or user not authenticated');
      }
      
      const { data, error } = await safeTable<Order>('orders')
        .insert({
          product_id: orderData.product_id,
          quantity: orderData.quantity,
          price: orderData.price,
          total_amount: totalAmount,
          trader_id: userId,
          farmer_id: productData.farmer_id,
          shipping_address: orderData.shipping_address || '',
          notes: orderData.notes || '',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  },

  async getTraderOrders(traderId: string): Promise<Order[]> {
    try {
      const { data, error } = await safeTable<Order>('orders')
        .select('*')
        .eq('trader_id', traderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error("Error getting trader orders:", error);
      return [];
    }
  },

  // Appointment Management
  async createAppointment(appointmentData: any): Promise<Appointment | null> {
    try {
      const { data, error } = await safeTable<Appointment>('appointments')
        .insert({
          ...appointmentData,
          status: 'upcoming'
        })
        .select()
        .single();

      if (error) throw error;
      return data as Appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      return null;
    }
  },

  async getTraderAppointments(traderId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await safeTable<Appointment>('appointments')
        .select('*')
        .eq('trader_id', traderId)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return (data || []) as Appointment[];
    } catch (error) {
      console.error("Error getting trader appointments:", error);
      return [];
    }
  },

  // Market Analysis
  async getMarketTrends() {
    try {
      const { data, error } = await safeTable('market_trends')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        // Fallback to empty array if table doesn't exist yet
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error getting market trends:", error);
      return [];
    }
  },

  // Dashboard Statistics
  async getTraderStats(traderId: string) {
    try {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', traderId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting trader stats:", error);
      return [];
    }
  }
};
