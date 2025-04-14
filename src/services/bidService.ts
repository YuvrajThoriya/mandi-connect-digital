
import { supabase } from '@/integrations/supabase/client';
import { Bid, CreateBidDto, UpdateBidDto } from '../types/bid';

export const bidService = {
  async createBid(bid: CreateBidDto): Promise<Bid> {
    const bidData = { 
      ...bid,
      bidder_id: bid.bidder_id || '',  
      bidder_name: '',  // Will be updated below
      product_id: bid.product_id,
      status: 'pending',
      auction_end_time: new Date().toISOString(),
      expires_at: new Date().toISOString()
    };

    // First get bidder's name
    const { data: userData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', bidData.bidder_id)
      .single();

    if (userData?.name) {
      bidData.bidder_name = userData.name;
    }

    const { data, error } = await supabase
      .from('bids')
      .insert([bidData])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Bid;
  },

  async getBidById(id: string): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as Bid;
  },

  async getAuctionBids(auctionId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false });

    if (error) throw error;
    return data as unknown as Bid[];
  },

  async getFarmerBids(farmerId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('bidder_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Bid[];
  },

  async updateBid(id: string, updates: UpdateBidDto): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Bid;
  },

  async deleteBid(id: string): Promise<void> {
    const { error } = await supabase
      .from('bids')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getHighestBid(auctionId: string): Promise<Bid | null> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('is_highest_bid', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data as unknown as Bid;
  },

  async acceptBid(id: string): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Bid;
  },

  async rejectBid(id: string): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Bid;
  }
};
