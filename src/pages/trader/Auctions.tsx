
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Filter, Search, Tag, TrendingUp } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function TraderAuctions() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productIdFilter = queryParams.get('productId');
  const { auctions, getActiveAuctions, isLoading } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>(
    queryParams.get('filter') === 'my-bids' ? 'my-bids' : 'all'
  );
  
  // Get all active auctions
  const activeAuctions = getActiveAuctions();
  
  // Filter auctions based on search and tabs
  const filteredAuctions = activeAuctions.filter(auction => {
    const matchesSearch = searchQuery 
      ? auction.productName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesTab = selectedTab === 'my-bids'
      ? auction.bids.some(bid => bid.traderId === user?.id)
      : true;
    
    const matchesProductFilter = productIdFilter
      ? auction.productId === productIdFilter
      : true;
      
    return matchesSearch && matchesTab && matchesProductFilter;
  });

  // If there's a product filter, automatically navigate to that auction
  useEffect(() => {
    if (productIdFilter && filteredAuctions.length === 1) {
      navigate(`/auctions/${filteredAuctions[0].id}`);
    }
  }, [productIdFilter, filteredAuctions, navigate]);
  
  return (
    <AuthGuard allowedRoles={["trader"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Auctions</h1>
            <p className="text-muted-foreground">
              Browse and bid on available auctions from farmers
            </p>
          </div>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Auction Tabs */}
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All Auctions</TabsTrigger>
              <TabsTrigger value="my-bids">My Bids</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuctions.map((auction) => {
                // Check if the current trader has placed a bid
                const myBid = auction.bids.find(bid => bid.traderId === user?.id);
                const isHighestBidder = myBid && auction.currentBid === myBid.amount;
                const timeRemaining = new Date(auction.endTime).getTime() - Date.now();
                const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hoursLeft = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                return (
                  <Card 
                    key={auction.id}
                    className={`overflow-hidden h-full ${myBid ? 'border-primary/40' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg line-clamp-1">
                          {auction.productName}
                        </CardTitle>
                        <StatusBadge status={auction.status} />
                      </div>
                      <CardDescription>
                        by {auction.farmerName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm font-medium">Current Bid</p>
                          <p className="text-2xl font-bold">₹{auction.currentBid}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium">Time Left</p>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {daysLeft > 0 ? `${daysLeft}d ` : ''}
                              {hoursLeft}h left
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <Tag className="h-3 w-3" /> 
                          Starting: ₹{auction.startPrice}
                        </Badge>
                        
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <TrendingUp className="h-3 w-3" /> 
                          Min Increment: ₹{auction.minIncrement}
                        </Badge>
                        
                        {myBid && (
                          <Badge className={`${isHighestBidder ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} hover:bg-opacity-80`}>
                            {isHighestBidder ? 'Highest Bidder' : 'Outbid'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Total Bids: {auction.bids.length}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/auctions/${auction.id}`)}
                      >
                        {myBid ? 'View My Bid' : 'Place Bid'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {filteredAuctions.length === 0 && (
              <Card className="p-12 text-center">
                <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No auctions found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery
                    ? 'Try using different search terms.'
                    : selectedTab === 'my-bids'
                      ? "You haven't placed any bids yet."
                      : 'There are no active auctions at the moment.'}
                </p>
                {selectedTab === 'my-bids' && (
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedTab('all')}
                  >
                    Browse All Auctions
                  </Button>
                )}
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="my-bids" className="mt-0">
            {/* Content is filtered by tab selection */}
          </TabsContent>
        </Tabs>
      </MainLayout>
    </AuthGuard>
  );
}
