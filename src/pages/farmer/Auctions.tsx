
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Filter, Gavel, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function FarmerAuctions() {
  const { user } = useAuth();
  const { getMyAuctions, isLoading } = useData();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Get all auctions for this farmer
  const auctions = getMyAuctions();
  
  // Filter auctions based on search term and filters
  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = 
      searchTerm === "" || 
      auction.productName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "" || 
      auction.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    
    const diffMs = end.getTime() - now.getTime();
    if (diffMs < 0) return "Ended";
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  return (
    <AuthGuard allowedRoles={["farmer"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Auctions</h1>
            <p className="text-muted-foreground">
              View and manage your product auctions
            </p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Auction Filters</CardTitle>
            <CardDescription>Find auctions by name or status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="h-9"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6">
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction) => (
              <Card 
                key={auction.id} 
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => navigate(`/farmer/auctions/${auction.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{auction.productName}</h3>
                        <StatusBadge status={auction.status} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Auction #{auction.id} - {auction.bids.length} bids received
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Started: {formatDate(auction.startTime)}</span>
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {auction.status === 'active' 
                            ? `Ends in: ${getTimeRemaining(auction.endTime)}`
                            : `Ended: ${formatDate(auction.endTime)}`}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Starting Price</div>
                      <div className="text-lg font-medium">₹{auction.startPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Current Bid</div>
                      <div className="text-lg font-medium text-primary">₹{auction.currentBid.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Minimum Increment</div>
                      <div className="text-lg font-medium">₹{auction.minIncrement.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {auction.status === 'completed' && auction.winnerId && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">Winner</div>
                      <div className="font-medium">{auction.winnerName} - Final Bid: ₹{auction.currentBid.toLocaleString()}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                  <Gavel className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No auctions found</h3>
                <p className="text-muted-foreground mb-4">
                  {auctions.length > 0 
                    ? "Try changing your filters to see more results" 
                    : "You haven't created any auctions yet"}
                </p>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/farmer/products")}
                >
                  Go to Products
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
