
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BidList from '@/components/auction/BidList';
import { Gavel, DollarSign, Clock, Package, Store, ChevronLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the bid form schema
const bidFormSchema = z.object({
  amount: z.coerce.number()
    .positive({ message: 'Bid amount must be positive' }),
  quantity: z.coerce.number()
    .positive({ message: 'Quantity must be positive' }),
  message: z.string().optional(),
});

type BidFormValues = z.infer<typeof bidFormSchema>;

const AuctionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [auction, setAuction] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  
  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: 0,
      quantity: 1,
      message: '',
    },
  });

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch auction details
        const { data: auctionData, error: auctionError } = await supabase
          .from('auctions')
          .select('*')
          .eq('id', id)
          .single();
          
        if (auctionError) throw auctionError;
        
        setAuction(auctionData);
        
        // Set initial bid amount based on current price and min increment
        const initialBidAmount = auctionData.current_price + auctionData.min_increment;
        form.setValue('amount', initialBidAmount);
        
        // Fetch product details
        if (auctionData.product_id) {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', auctionData.product_id)
            .single();
            
          if (productError) throw productError;
          
          setProduct(productData);
          
          // Fetch farmer details
          if (productData.farmer_id) {
            const { data: farmerData, error: farmerError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', productData.farmer_id)
              .single();
              
            if (farmerError) throw farmerError;
            
            setFarmer(farmerData);
          }
        }
        
        // Fetch bids for this auction
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select('*')
          .eq('auction_id', id)
          .order('created_at', { ascending: false });
          
        if (bidsError) throw bidsError;
        
        setBids(bidsData || []);
      } catch (error) {
        console.error('Error fetching auction details:', error);
        toast({
          title: "Error",
          description: "Failed to load auction details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctionDetails();
    
    // Set up real-time subscription for bids
    const channel = supabase.channel('auction-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bids', filter: `auction_id=eq.${id}` },
        () => setRefreshKey(prev => prev + 1)
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'auctions', filter: `id=eq.${id}` },
        () => setRefreshKey(prev => prev + 1)
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, form]);
  
  // Refresh auction data when refresh key changes
  useEffect(() => {
    if (id) {
      const refreshData = async () => {
        try {
          const { data, error } = await supabase
            .from('auctions')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) throw error;
          setAuction(data);
          
          const { data: bidsData, error: bidsError } = await supabase
            .from('bids')
            .select('*')
            .eq('auction_id', id)
            .order('created_at', { ascending: false });
            
          if (bidsError) throw bidsError;
          setBids(bidsData || []);
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      };
      
      refreshData();
    }
  }, [id, refreshKey]);
  
  // Update countdown timer
  useEffect(() => {
    if (!auction) return;
    
    const timer = setInterval(() => {
      const endTime = new Date(auction.end_time);
      const now = new Date();
      
      if (isAfter(now, endTime)) {
        setTimeLeft('Auction ended');
        clearInterval(timer);
      } else {
        setTimeLeft(formatDistanceToNow(endTime, { addSuffix: true }));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auction]);
  
  const onSubmit = async (values: BidFormValues) => {
    if (!profile || !auction || !product) return;
    
    // Validate bid amount
    if (values.amount <= auction.current_price) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be higher than the current price of ${formatCurrency(auction.current_price)}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (auction.min_increment && values.amount < auction.current_price + auction.min_increment) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be at least ${formatCurrency(auction.current_price + auction.min_increment)}.`,
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create the bid
      const bidData = {
        auction_id: auction.id,
        product_id: product.id,
        bidder_id: profile.id,
        bidder_name: profile.name || 'Anonymous Bidder',
        amount: values.amount,
        quantity: values.quantity,
        message: values.message || null,
        status: 'pending',
        is_highest_bid: true,
        previous_bid_amount: auction.current_price,
      };
      
      const { error: bidError } = await supabase
        .from('bids')
        .insert(bidData);
        
      if (bidError) throw bidError;
      
      // Update the auction's current price
      const { error: auctionError } = await supabase
        .from('auctions')
        .update({ current_price: values.amount })
        .eq('id', auction.id);
        
      if (auctionError) throw auctionError;
      
      // Mark previous highest bid as outbid
      await supabase
        .from('bids')
        .update({
          status: 'outbid',
          is_highest_bid: false
        })
        .eq('auction_id', auction.id)
        .eq('is_highest_bid', true)
        .neq('bidder_id', profile.id);
      
      // Create notification for farmer if notification_settings table exists
      try {
        await supabase
          .from('notification_settings')
          .insert({
            user_id: product.farmer_id,
            settings: {
              bids: true
            }
          });
      } catch (err) {
        console.log('Notification settings might already exist or table doesn\'t exist');
      }
      
      toast({
        title: "Bid Placed",
        description: "Your bid has been successfully placed.",
      });
      
      // Reset form and refresh data
      form.reset({
        amount: values.amount + auction.min_increment,
        quantity: values.quantity,
        message: '',
      });
      
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleBuyNow = async () => {
    if (!profile || !auction || !product) return;
    
    setSubmitting(true);
    
    try {
      // Create an order directly
      const orderData = {
        product_id: product.id,
        quantity: 1,
        price: product.price,
        total_amount: product.price * 1,
        trader_id: profile.id,
        farmer_id: product.farmer_id,
        status: 'pending',
        payment_status: 'pending',
      };
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderData);
        
      if (orderError) throw orderError;
      
      // End the auction
      const { error: auctionError } = await supabase
        .from('auctions')
        .update({ status: 'completed' })
        .eq('id', auction.id);
        
      if (auctionError) throw auctionError;
      
      // Update product status
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', product.id);
        
      if (productError) throw productError;
      
      toast({
        title: "Purchase Successful",
        description: "You've successfully purchased this item. View details in your orders.",
      });
      
      // Redirect to orders page
      navigate('/trader-orders');
    } catch (error) {
      console.error('Error buying now:', error);
      toast({
        title: "Error",
        description: "Failed to complete purchase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEndAuction = async () => {
    if (!auction) return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('auctions')
        .update({ status: 'completed' })
        .eq('id', auction.id);
        
      if (error) throw error;
      
      // If there's a highest bid, create an order
      const highestBid = bids.find(bid => bid.is_highest_bid);
      
      if (highestBid && product) {
        const orderData = {
          product_id: product.id,
          quantity: highestBid.quantity,
          price: highestBid.amount,
          total_amount: highestBid.amount * highestBid.quantity,
          trader_id: highestBid.bidder_id,
          farmer_id: product.farmer_id,
          status: 'pending',
          payment_status: 'pending',
        };
        
        await supabase.from('orders').insert(orderData);
        
        // Update product status
        await supabase
          .from('products')
          .update({ status: 'sold' })
          .eq('id', product.id);
      }
      
      toast({
        title: "Auction Ended",
        description: "The auction has been successfully ended.",
      });
      
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error ending auction:', error);
      toast({
        title: "Error",
        description: "Failed to end auction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <DashboardLayout userRole={profile?.role as 'farmer' | 'trader'}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!auction || !product) {
    return (
      <DashboardLayout userRole={profile?.role as 'farmer' | 'trader'}>
        <div className="p-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="mb-8"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <div className="text-center p-10">
            <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
            <p className="text-muted-foreground">The auction you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Determine if the user is the farmer who created this auction
  const isFarmer = profile?.id === product.farmer_id;
  // Determine if the auction is still active
  const isActive = auction.status === 'active';
  // Determine if the auction has ended due to time
  const hasEnded = isAfter(new Date(), new Date(auction.end_time));
  
  return (
    <DashboardLayout userRole={profile?.role as 'farmer' | 'trader'}>
      <DashboardHeader 
        title="Auction Details" 
        userName={profile?.name || ""}
        userRole={profile?.role as 'farmer' | 'trader'}
      />
      
      <div className="container p-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-8"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription className="text-base">
                      {product.category} • {product.location}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className="mt-2 md:mt-0"
                  >
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="bids">Bids ({bids.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6">
                    {product.image_url && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-medium">Description</h3>
                      <p>{product.description || "No description provided."}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{auction.quantity} {product.unit}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Quality</p>
                        <p className="font-medium capitalize">{product.quality}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Min. Increment</p>
                        <p className="font-medium">{formatCurrency(auction.min_increment)}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Reserve Price</p>
                        <p className="font-medium">
                          {auction.reserve_price ? formatCurrency(auction.reserve_price) : 'None'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Seller Information</h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{farmer?.name || 'Unknown Farmer'}</p>
                        </div>
                        {farmer?.location && (
                          <p className="text-sm text-muted-foreground">{farmer.location}</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bids">
                    <BidList bids={bids} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Current Price</span>
                  </div>
                  <span className="text-xl font-bold">
                    {formatCurrency(auction.current_price)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Starting Price</span>
                  </div>
                  <span className="text-base">
                    {formatCurrency(auction.start_price)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Available Quantity</span>
                  </div>
                  <span className="text-base">
                    {auction.quantity} {product.unit}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Time Remaining</span>
                  </div>
                  <span className="text-base font-medium">
                    {timeLeft}
                  </span>
                </div>
                
                <Progress 
                  value={
                    new Date(auction.end_time) < new Date() ? 100 :
                    (1 - (new Date(auction.end_time).getTime() - new Date().getTime()) / 
                    (new Date(auction.end_time).getTime() - new Date(auction.start_time).getTime())) * 100
                  } 
                />
                
                <p className="text-xs text-muted-foreground text-center">
                  Auction {auction.status === 'active' ? 'ends' : 'ended'} on {new Date(auction.end_time).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            {!isFarmer && isActive && !hasEnded && (
              <Card>
                <CardHeader>
                  <CardTitle>Place Your Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bid Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min={auction.current_price + auction.min_increment} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              Minimum bid: {formatCurrency(auction.current_price + auction.min_increment)}
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max={auction.quantity} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              Available: {auction.quantity} {product.unit}
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add a message to the seller"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2 flex flex-col gap-2">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={submitting}
                        >
                          {submitting ? 'Submitting...' : 'Place Bid'}
                        </Button>
                        
                        {product.price && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleBuyNow}
                            disabled={submitting}
                          >
                            Buy Now at {formatCurrency(product.price)}
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {isFarmer && isActive && (
              <Card>
                <CardHeader>
                  <CardTitle>Auction Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You are the seller of this item. You can end the auction early if needed.
                    </p>
                    
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={handleEndAuction}
                      disabled={submitting}
                    >
                      {submitting ? 'Processing...' : 'End Auction'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(!isActive || hasEnded) && (
              <Card>
                <CardHeader>
                  <CardTitle>Auction {auction.status === 'completed' ? 'Completed' : 'Ended'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This auction has ended. {bids.some(bid => bid.is_highest_bid) ? 
                      'The winning bid has been accepted.' : 
                      'No successful bids were placed.'}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(isFarmer ? '/farmer-auctions' : '/trader-auctions')}
                  >
                    View All Auctions
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuctionPage;
