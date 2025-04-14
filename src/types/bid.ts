
export interface Bid {
  id: string;
  product_id: string;
  bidder_id: string;
  bidder_name: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'outbid' | string; // Added string to be more flexible
  message: string | null;
  created_at: string;
  updated_at: string;
  auction_id: string;
  quantity: number;
  is_highest_bid: boolean;
  previous_bid_amount: number | null;
  expires_at: string;
  auction_end_time: string;
  product?: {
    name: string;
    image_url?: string | null;
    farmer_id?: string;
  };
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
  status?: 'pending' | 'accepted' | 'rejected' | 'outbid' | string;
  is_highest_bid?: boolean;
}
