
import { supabase, safeTable } from '@/integrations/supabase/client';
import { Bid, CreateBidDto, UpdateBidDto } from '../types/bid';
import { queryTable, insertIntoTable, updateTable } from '@/utils/supabaseUtils';

export const bidService = {
  async createBid(bid: CreateBidDto & { bidder_id: string, bidder_name: string }): Promise<Bid> {
    const { data, error } = await insertIntoTable<Bid>('bids', {
      ...bid,
      status: 'pending',
      is_highest_bid: false,
      previous_bid_amount: null,
      expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
      auction_end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create bid');
    return data[0] as Bid;
  },

  async getBidById(id: string): Promise<Bid> {
    const { data, error } = await queryTable<Bid>('bids', 
      table => table.select('*').eq('id', id).single()
    );

    if (error) throw error;
    if (!data) throw new Error('Bid not found');
    return data[0] as Bid;
  },

  async getAuctionBids(auctionId: string): Promise<Bid[]> {
    const { data, error } = await queryTable<Bid>('bids',
      table => table.select('*').eq('auction_id', auctionId).order('created_at', { ascending: false })
    );

    if (error) throw error;
    if (!data) return [];
    return data as Bid[];
  },

  async getUserBids(userId: string): Promise<Bid[]> {
    const { data, error } = await queryTable<Bid>('bids',
      table => table.select('*').eq('bidder_id', userId).order('created_at', { ascending: false })
    );

    if (error) throw error;
    if (!data) return [];
    return data as Bid[];
  },

  async updateBid(id: string, updates: UpdateBidDto): Promise<Bid> {
    const { data, error } = await updateTable<Bid>('bids', updates, 'id', id);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update bid');
    return data[0] as Bid;
  },

  async acceptBid(id: string): Promise<Bid> {
    const { data, error } = await updateTable<Bid>(
      'bids',
      { status: 'accepted', is_highest_bid: true },
      'id',
      id
    );

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to accept bid');
    return data[0] as Bid;
  },

  async rejectBid(id: string): Promise<Bid> {
    const { data, error } = await updateTable<Bid>(
      'bids',
      { status: 'rejected' },
      'id',
      id
    );

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to reject bid');
    return data[0] as Bid;
  }
};
