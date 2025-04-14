
export interface Bid {
  id: string;
  product_id: string;
  bidder_id: string;
  bidder_name: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'outbid';
  message: string | null;
  created_at: string;
  updated_at: string;
  auction_id: string;
  quantity: number;
  is_highest_bid: boolean;
  previous_bid_amount: number | null;
  expires_at: string;
  auction_end_time: string;
}

export interface CreateBidDto {
  product_id: string;
  bidder_id?: string; // Make bidder_id optional to match service implementation
  bidder_name?: string; // Make bidder_name optional to match service implementation
  amount: number;
  message?: string;
  auction_id: string;
  quantity: number;
}

export interface UpdateBidDto {
  amount?: number;
  message?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'outbid';
  is_highest_bid?: boolean;
} 
