
import { supabase } from '@/integrations/supabase/client';
import { Auction, CreateAuctionDto, UpdateAuctionDto } from '../types/auction';

export const auctionService = {
  async createAuction(auction: CreateAuctionDto): Promise<Auction> {
    const { data, error } = await supabase
      .from('auctions')
      .insert([{
        ...auction,
        current_price: auction.start_price,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Auction;
  },

  async getAuctionById(id: string): Promise<Auction> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as Auction;
  },

  async getFarmerAuctions(farmerId: string): Promise<Auction[]> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Auction[];
  },

  async updateAuction(id: string, updates: UpdateAuctionDto): Promise<Auction> {
    const { data, error } = await supabase
      .from('auctions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Auction;
  },

  async deleteAuction(id: string): Promise<void> {
    const { error } = await supabase
      .from('auctions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getActiveAuctions(): Promise<Auction[]> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Auction[];
  },

  async endAuction(id: string): Promise<Auction> {
    const { data, error } = await supabase
      .from('auctions')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Auction;
  }
};
