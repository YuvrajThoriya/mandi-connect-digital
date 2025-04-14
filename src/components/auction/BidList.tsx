
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { User, DollarSign, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Bid {
  id: string;
  bidder_id: string;
  bidder_name?: string;
  amount: number;
  message?: string | null;
  created_at: string;
  is_highest_bid?: boolean;
}

interface BidListProps {
  bids: Bid[];
}

const BidList = ({ bids }: BidListProps) => {
  if (bids.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No bids have been placed yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div
          key={bid.id}
          className={`p-4 border rounded-lg ${
            bid.is_highest_bid ? 'bg-green-50 border-green-200' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="font-medium">{bid.bidder_name || 'Anonymous Bidder'}</div>
            </div>
            <Badge variant={bid.is_highest_bid ? "success" : "outline"}>
              {bid.is_highest_bid && <ArrowUp className="mr-1 h-3 w-3" />}
              {bid.is_highest_bid ? "Highest Bid" : "Bid"}
            </Badge>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <div className="text-lg font-bold text-emerald-600">
                {formatCurrency(bid.amount)}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
            </div>
          </div>
          
          {bid.message && (
            <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
              {bid.message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BidList;
