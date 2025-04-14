
import { supabase } from '@/integrations/supabase/client';
import { BusinessDetails, CompanyFormData, ProfileFormData } from '../types/trader';
import { Appointment, CreateAppointmentDto } from '../types/appointment';
import { Bid, CreateBidDto } from '../types/bid';
import { Order, CreateOrderDto } from '../types/order';

export const traderService = {
  // Profile Management
  async updateProfile(userId: string, profileData: ProfileFormData) {
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
  },

  // Business Details Management
  async updateBusinessDetails(userId: string, businessData: CompanyFormData) {
    const { data, error } = await supabase
      .from('business_details')
      .upsert({
        user_id: userId,
        business_name: businessData.companyName,
        business_type: 'trader',
        business_address: businessData.companyAddress,
        gst_number: businessData.gstin,
        registration_number: businessData.tradeLicense,
        business_description: businessData.businessDescription,
        operational_areas: businessData.operationalAreas
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBusinessDetails(userId: string): Promise<BusinessDetails> {
    const { data, error } = await supabase
      .from('business_details')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as unknown as BusinessDetails;
  },

  // Bidding Management
  async placeBid(bidData: CreateBidDto): Promise<Bid> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data: userData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase
      .from('bids')
      .insert([{
        ...bidData,
        bidder_id: userId || '',
        bidder_name: userData?.name || '',
        product_id: bidData.product_id,
        auction_end_time: new Date().toISOString(),
        expires_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Bid;
  },

  async getTraderBids(traderId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('bidder_id', traderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Bid[];
  },

  // Order Management
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    // Calculate total amount
    const totalAmount = orderData.quantity * orderData.price;
    
    // Get the farmer_id from the product
    const { data: productData } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', orderData.product_id)
      .single();
    
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!productData?.farmer_id || !userId) {
      throw new Error('Product not found or user not authenticated');
    }
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
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
      }])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Order;
  },

  async getTraderOrders(traderId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('trader_id', traderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Order[];
  },

  // Appointment Management
  async createAppointment(appointmentData: CreateAppointmentDto): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        ...appointmentData,
        status: 'upcoming'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Appointment;
  },

  async getTraderAppointments(traderId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('trader_id', traderId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data as unknown as Appointment[];
  },

  // Market Analysis
  async getMarketTrends() {
    const { data, error } = await supabase
      .rpc('get_market_trends');

    if (error) {
      // Fallback to direct table access if RPC fails
      const { data: directData, error: directError } = await supabase
        .from('market_trends')
        .select('*')
        .order('date', { ascending: false });
      
      if (directError) throw directError;
      return directData;
    }
    
    return data;
  },

  // Dashboard Statistics
  async getTraderStats(traderId: string) {
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .eq('user_id', traderId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }
};
