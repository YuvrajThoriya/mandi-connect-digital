
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Calendar, ChevronLeft, Clock, DollarSign, TrendingUp, User } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

export default function TraderAuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAuctionById, getProductById, placeBid, isLoading } = useData();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [bidError, setBidError] = useState<string | null>(null);
  
  // Get auction data
  const auction = getAuctionById(id || "");
  
  // Get related product
  const product = auction ? getProductById(auction.productId) : undefined;
  
  // Form for bidding
  const form = useForm({
    defaultValues: {
      bidAmount: auction ? auction.currentBid + auction.minIncrement : 0,
      isAutoBid: false,
      maxAutoBidAmount: 0,
    },
  });
  
  // Update form values when auction data changes
  useEffect(() => {
    if (auction) {
      form.setValue("bidAmount", auction.currentBid + auction.minIncrement);
    }
  }, [auction, form]);
  
  // Check if current user has placed a bid
  const myBids = auction?.bids.filter(bid => bid.traderId === user?.id) || [];
  const myHighestBid = myBids.length > 0 
    ? Math.max(...myBids.map(bid => bid.amount))
    : 0;
  const isHighestBidder = myHighestBid > 0 && auction?.currentBid === myHighestBid;
  
  // Calculate time remaining
  useEffect(() => {
    const updateTimeRemaining = () => {
      if (!auction) return;
      
      const endTime = new Date(auction.endTime).getTime();
      const now = Date.now();
      const timeLeft = endTime - now;
      
      if (timeLeft <= 0) {
        setTimeRemaining("Auction ended");
        setIsAuctionEnded(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setIsAuctionEnded(false);
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        let timeString = "";
        if (days > 0) timeString += `${days}d `;
        if (days > 0 || hours > 0) timeString += `${hours}h `;
        if (days > 0 || hours > 0 || minutes > 0) timeString += `${minutes}m `;
        timeString += `${seconds}s`;
        
        setTimeRemaining(timeString);
      }
    };
    
    // Update immediately and then every second
    updateTimeRemaining();
    timerRef.current = setInterval(updateTimeRemaining, 1000);
    
    // Cleanup interval
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [auction]);
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };
  
  // Handle bid submission
  const onSubmitBid = async (data: any) => {
    if (!auction) return;
    
    setBidError(null);
    
    try {
      const { bidAmount, isAutoBid, maxAutoBidAmount } = data;
      
      // Validation
      if (bidAmount <= auction.currentBid) {
        setBidError(`Bid amount must be higher than current bid (₹${auction.currentBid})`);
        return;
      }
      
      if ((bidAmount - auction.currentBid) < auction.minIncrement) {
        setBidError(`Minimum bid increment is ₹${auction.minIncrement}`);
        return;
      }
      
      if (isAutoBid && maxAutoBidAmount <= bidAmount) {
        setBidError(`Maximum auto bid amount must be greater than your bid amount`);
        return;
      }
      
      // Place bid
      const success = await placeBid(
        auction.id, 
        bidAmount, 
        isAutoBid, 
        isAutoBid ? maxAutoBidAmount : undefined
      );
      
      if (success) {
        form.reset({
          bidAmount: 0,
          isAutoBid: false,
          maxAutoBidAmount: 0,
        });
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      setBidError("Failed to place bid. Please try again.");
    }
  };
  
  // If auction not found
  if (!auction || !product) {
    return (
      <AuthGuard allowedRoles={["trader"]}>
        <MainLayout>
          {isLoading ? <LoadingOverlay /> : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Auction not found</h2>
              <p className="text-muted-foreground mb-6">
                The auction you are looking for does not exist or has been removed.
              </p>
              <Button onClick={() => navigate("/trader/auctions")}>
                View All Auctions
              </Button>
            </div>
          )}
        </MainLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["trader"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="p-0 h-auto font-normal"
            onClick={() => navigate("/trader/auctions")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Auctions
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Auction Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {product.name}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {product.category} • {product.variety}
                    </p>
                  </div>
                  <StatusBadge status={auction.status} />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Auction Timer */}
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium mb-1">Current Bid</p>
                      <p className="text-3xl font-bold">₹{auction.currentBid}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium mb-1">Time Remaining</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className={`font-mono text-xl ${isAuctionEnded ? 'text-destructive' : ''}`}>
                          {timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Auction Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Price</p>
                    <p className="font-medium">₹{auction.startPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min Increment</p>
                    <p className="font-medium">₹{auction.minIncrement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                    <p className="font-medium">{auction.bids.length}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Product Information */}
                <div>
                  <h3 className="font-medium mb-2">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity Available</p>
                      <p className="font-medium">{product.quantity} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-medium">{product.grade || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1">{product.description}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Farmer Information */}
                <div>
                  <h3 className="font-medium mb-2">Farmer Information</h3>
                  <div className="flex items-center gap-3">
                    <User className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{auction.farmerName}</p>
                      <Button variant="link" className="h-auto p-0" onClick={() => navigate(`/appointments/add?farmerId=${auction.farmerId}`)}>
                        Book an appointment with farmer
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Auction Schedule */}
                <div>
                  <h3 className="font-medium mb-2">Auction Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Time</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(auction.startTime)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Time</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(auction.endTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View Product Details
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Bidding Controls */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
              </CardHeader>
              
              <CardContent>
                {isAuctionEnded ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Auction has ended</AlertTitle>
                    <AlertDescription>
                      This auction is no longer accepting bids.
                      {auction.winnerId && (
                        <p className="mt-2">
                          {auction.winnerId === user?.id 
                            ? 'Congratulations! You won this auction.'
                            : 'The auction has been won by another trader.'}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {isHighestBidder && (
                      <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                        <TrendingUp className="h-4 w-4" />
                        <AlertTitle>You are the highest bidder!</AlertTitle>
                        <AlertDescription>
                          Your bid of ₹{myHighestBid} is currently the highest.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {myBids.length > 0 && !isHighestBidder && (
                      <Alert className="mb-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>You have been outbid!</AlertTitle>
                        <AlertDescription>
                          Your highest bid was ₹{myHighestBid}. The current highest bid is ₹{auction.currentBid}.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {bidError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{bidError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitBid)} className="space-y-5">
                        <FormField
                          control={form.control}
                          name="bidAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Bid Amount (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Minimum bid: ₹{auction.currentBid + auction.minIncrement}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isAutoBid"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                              <div>
                                <FormLabel>Enable Auto-Bidding</FormLabel>
                                <FormDescription>
                                  Automatically place bids up to your maximum amount
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("isAutoBid") && (
                          <FormField
                            control={form.control}
                            name="maxAutoBidAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Bid Amount (₹)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Must be greater than your bid amount
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <Button type="submit" className="w-full">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Place Bid
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Bid History */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                {auction.bids.length > 0 ? (
                  <div className="space-y-3">
                    {auction.bids
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(bid => {
                        const isMyBid = bid.traderId === user?.id;
                        
                        return (
                          <div 
                            key={bid.id} 
                            className={`p-3 rounded-md ${isMyBid ? 'bg-primary/10' : 'bg-muted/40'}`}
                          >
                            <div className="flex justify-between">
                              <span className={isMyBid ? 'font-medium' : ''}>
                                {isMyBid ? 'You' : bid.traderName}
                              </span>
                              <span className="font-bold">₹{bid.amount}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{new Date(bid.timestamp).toLocaleString()}</span>
                              {bid.isAutoBid && <span>Auto Bid</span>}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    No bids have been placed yet. Be the first to bid!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
