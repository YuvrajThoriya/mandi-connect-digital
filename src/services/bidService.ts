
import { supabase, safeTable } from '@/integrations/supabase/client';
import { Bid, CreateBidDto, UpdateBidDto } from '../types/bid';

export const bidService = {
  async createBid(bid: CreateBidDto & { bidder_id: string, bidder_name: string }): Promise<Bid> {
    const { data, error } = await safeTable<Bid>('bids')
      .insert({
        ...bid,
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
  },

  async getBidById(id: string): Promise<Bid> {
    const { data, error } = await safeTable('bids')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Bid;
  },

  async getAuctionBids(auctionId: string): Promise<Bid[]> {
    const { data, error } = await safeTable('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Bid[];
  },

  async getUserBids(userId: string): Promise<Bid[]> {
    const { data, error } = await safeTable('bids')
      .select('*')
      .eq('bidder_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Bid[];
  },

  async updateBid(id: string, updates: UpdateBidDto): Promise<Bid> {
    const { data, error } = await safeTable('bids')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Bid;
  },

  async acceptBid(id: string): Promise<Bid> {
    const { data, error } = await safeTable('bids')
      .update({ status: 'accepted', is_highest_bid: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Bid;
  },

  async rejectBid(id: string): Promise<Bid> {
    const { data, error } = await safeTable('bids')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Bid;
  }
};
