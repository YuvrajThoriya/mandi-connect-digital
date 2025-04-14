
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Gavel, Tag, MapPin, ShoppingCart, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import BidList from "@/components/auction/BidList";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const AuctionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [auction, setAuction] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState("1");
  const [bids, setBids] = useState<any[]>([]);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setIsLoading(true);

        // Fetch auction data
        const { data: auctionData, error: auctionError } = await supabase
          .from("auctions")
          .select("*")
          .eq("id", id)
          .single();

        if (auctionError) throw auctionError;
        if (!auctionData) {
          toast({
            title: "Error",
            description: "Auction not found",
            variant: "destructive",
          });
          navigate("/trader-auctions");
          return;
        }
        setAuction(auctionData);

        // Fetch product data
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", auctionData.product_id)
          .single();

        if (productError) throw productError;
        if (!productData) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          });
          navigate("/trader-auctions");
          return;
        }
        setProduct(productData);

        // Fetch bids
        const { data: bidsData, error: bidsError } = await supabase
          .from("bids")
          .select("*")
          .eq("auction_id", id)
          .order("amount", { ascending: false });

        if (bidsError) throw bidsError;
        setBids(bidsData || []);
      } catch (error: any) {
        console.error("Error fetching auction:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to fetch auction details. Please try again.",
        });
        navigate("/trader-auctions");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAuction();
  }, [id, navigate, toast]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auction || !product) return;

    setIsBidding(true);
    try {
      // Validate bid amount
      const bidAmountNum = parseFloat(bidAmount);
      if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
        throw new Error("Please enter a valid bid amount");
      }

      if (bidAmountNum <= auction.current_price) {
        throw new Error("Bid amount must be greater than the current price");
      }

      // Check if bid amount is within the allowed increment
      if (auction.min_increment && (bidAmountNum - auction.current_price) < auction.min_increment) {
        throw new Error(`Bid amount must be at least ${formatCurrency(auction.min_increment)} greater than the current price`);
      }

      // Create bid
      const { data, error } = await supabase
        .from("bids")
        .insert({
          product_id: product.id,
          bidder_id: user.id,
          bidder_name: profile?.name || "Anonymous",
          amount: bidAmountNum,
          message: message || null,
          auction_id: auction.id,
          quantity: parseInt(quantity, 10),
        })
        .select()
        .single();

      if (error) throw error;

      // Update auction current price
      const { error: updateError } = await supabase
        .from("auctions")
        .update({ current_price: bidAmountNum })
        .eq("id", auction.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Bid placed successfully",
        variant: "default",
      });

      // Refresh bids
      const { data: bidsData, error: bidsError } = await supabase
        .from("bids")
        .select("*")
        .eq("auction_id", id)
        .order("amount", { ascending: false });

      if (bidsError) throw bidsError;
      setBids(bidsData || []);

      // Clear form
      setBidAmount("");
      setMessage("");
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to place bid. Please try again.",
      });
    } finally {
      setIsBidding(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      // Calculate the total amount based on price and quantity
      const quantityNum = parseInt(quantity, 10);
      const total_amount = product.price * quantityNum;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          product_id: product.id,
          farmer_id: auction.farmer_id,
          trader_id: user?.id,
          quantity: quantityNum,
          price: product.price,
          total_amount: total_amount,
          status: 'pending',
          payment_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: "Success",
        description: "Order created successfully",
        variant: "default",
      });
      navigate(`/trader-orders/${orderData.id}`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to create order. Please try again.",
      });
    }
  };

  if (!auction || !product) {
    return (
      <DashboardLayout userRole="trader">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="trader">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/trader-auctions`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>

        <DashboardHeader
          title="Auction Details"
          userName={profile?.name || "User"}
          userRole="trader"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
              <CardDescription>
                Review the auction details and place your bid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bidAmount">Bid Amount *</Label>
                  <Input
                    id="bidAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    required
                  />
                  {auction.min_increment && (
                    <p className="text-sm text-muted-foreground">
                      Minimum increment: {formatCurrency(auction.min_increment)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add any additional notes or requirements"
                />
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Current Price</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(auction.current_price)}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleBid}
                className="w-full"
                variant="purchase"
                disabled={isBidding}
              >
                {isBidding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Bid...
                  </>
                ) : (
                  <>
                    <Gavel className="mr-2 h-4 w-4" />
                    Place Bid
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bids</CardTitle>
              <CardDescription>
                See the current bids for this auction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BidList bids={bids} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.category}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Price</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(product.price)}/{product.unit}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {product.location}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Gavel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm text-muted-foreground">
                    {auction.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">End Time</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(auction.end_time), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              {auction.status === "active" ? (
                <Button onClick={handleCreateOrder} variant="secondary">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              ) : (
                <Badge variant="destructive">Auction Ended</Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuctionPage;
