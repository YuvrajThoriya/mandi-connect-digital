
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign,
  Gavel, 
  Timer, 
  Package,
  User,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function FarmerAuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAuctionById, getProductById, isLoading } = useData();
  
  // Get auction details
  const auction = getAuctionById(id || "");
  
  // Get product details if auction exists
  const product = auction ? getProductById(auction.productId) : undefined;
  
  // Helper function to calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    
    const diffMs = end.getTime() - now.getTime();
    if (diffMs < 0) return "Auction ended";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let result = '';
    if (diffDays > 0) result += `${diffDays}d `;
    if (diffHrs > 0) result += `${diffHrs}h `;
    result += `${diffMins}m`;
    
    return result;
  };
  
  // Helper function to calculate auction progress
  const getAuctionProgress = () => {
    if (!auction) return 0;
    
    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();
    const now = Date.now();
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };
  
  if (!auction || !product) {
    return (
      <AuthGuard allowedRoles={["farmer"]}>
        <MainLayout>
          <div className="py-12 text-center">
            <div className="mb-4 text-muted-foreground">Auction not found</div>
            <Button onClick={() => navigate("/farmer/auctions")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Auctions
            </Button>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }
  
  // Format dates for display
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);
  
  // Sort bids by timestamp in descending order (newest first)
  const sortedBids = [...auction.bids].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <AuthGuard allowedRoles={["farmer"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header with breadcrumb and actions */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Button 
                variant="link" 
                className="p-0 h-auto text-muted-foreground" 
                onClick={() => navigate("/farmer/auctions")}
              >
                Auctions
              </Button>
              <span>/</span>
              <span>Auction #{auction.id}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name} Auction</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/farmer/auctions")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Auctions
            </Button>
            {auction.status === 'completed' && (
              <Button onClick={() => navigate(`/farmer/orders`)}>
                <DollarSign className="mr-2 h-4 w-4" />
                View Order
              </Button>
            )}
          </div>
        </div>
        
        {/* Auction Status Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={auction.status} className="text-base px-3 py-1" />
                  {auction.status === 'active' && (
                    <Badge variant="outline" className="text-sm">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {getTimeRemaining(auction.endTime)} remaining
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 mb-1">
                    <Calendar className="h-4 w-4" />
                    Started: {format(startTime, 'PPp')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Ends: {format(endTime, 'PPp')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Auction progress</div>
                <div className="flex items-center gap-4">
                  <Progress value={getAuctionProgress()} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{Math.round(getAuctionProgress())}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Auction Info + Bids */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Auction/Product Info */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Auction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Starting Price</div>
                  <div className="text-lg font-medium">₹{auction.startPrice.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Bid</div>
                  <div className="text-xl font-semibold text-primary">
                    ₹{auction.currentBid.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Min Increment</div>
                  <div className="text-base">₹{auction.minIncrement.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Bids</div>
                  <div className="text-base">{auction.bids.length}</div>
                </div>
                
                {auction.status === 'completed' && auction.winnerId && (
                  <div className="p-3 bg-primary/10 rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Winner</div>
                    <div className="font-medium">{auction.winnerName}</div>
                    <div className="text-sm text-muted-foreground">
                      Final bid: ₹{auction.currentBid.toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Product Details</CardTitle>
                <CardDescription>
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`/farmer/products/${product.id}`)}>
                    View product page
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-muted">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <div>{product.category} - {product.variety}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Quantity</div>
                  <div>{product.quantity} {product.unit}</div>
                </div>
                
                {product.grade && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Quality Grade</div>
                    <div>Grade {product.grade}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <p className="text-sm">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Bid History */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bid History</CardTitle>
                <CardDescription>
                  {auction.bids.length > 0 
                    ? `${auction.bids.length} bids placed on this auction`
                    : "No bids have been placed yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Bids</TabsTrigger>
                    <TabsTrigger value="auto">Auto Bids</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    {sortedBids.length > 0 ? (
                      <div className="space-y-2">
                        {sortedBids.map((bid) => (
                          <div 
                            key={bid.id} 
                            className={`p-4 rounded-md ${
                              bid === sortedBids[0] ? 'bg-primary/10 border border-primary/20' : 'bg-muted/40'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {bid.traderName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{bid.traderName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(bid.timestamp).toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-semibold">₹{bid.amount.toLocaleString()}</div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  {bid.isAutoBid && (
                                    <Badge variant="outline" className="mr-2">Auto Bid</Badge>
                                  )}
                                  {sortedBids.indexOf(bid) > 0 && (
                                    <span className="flex items-center text-green-600">
                                      <ArrowUp className="h-3.5 w-3.5 mr-1" />
                                      ₹{(bid.amount - sortedBids[sortedBids.indexOf(bid) + 1].amount).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                          <Gavel className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No bids yet</h3>
                        <p className="text-muted-foreground">
                          There are no bids on this auction yet. Check back later!
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="auto">
                    {sortedBids.filter(bid => bid.isAutoBid).length > 0 ? (
                      <div className="space-y-2">
                        {sortedBids.filter(bid => bid.isAutoBid).map((bid) => (
                          <div 
                            key={bid.id} 
                            className="p-4 rounded-md bg-muted/40"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {bid.traderName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{bid.traderName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(bid.timestamp).toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-semibold">₹{bid.amount.toLocaleString()}</div>
                                {bid.maxAutoBidAmount && (
                                  <div className="text-sm text-muted-foreground">
                                    Max bid: ₹{bid.maxAutoBidAmount.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                          <Timer className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No auto bids</h3>
                        <p className="text-muted-foreground">
                          There are no automatic bids on this auction yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
