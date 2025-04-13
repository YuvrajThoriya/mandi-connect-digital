
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Package,
  Search,
  ShoppingBag,
  TrendingUp,
  Wallet
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataCard } from "@/components/ui/data-card";
import { LoadingOverlay } from "@/components/ui/loader";

export default function TraderDashboard() {
  const { user } = useAuth();
  const {
    products,
    getActiveAuctions,
    getMyOrders,
    getMyAppointments,
    isLoading
  } = useData();
  const navigate = useNavigate();

  const activeAuctions = getActiveAuctions();
  const orders = getMyOrders();
  const appointments = getMyAppointments();

  // Calculate metrics
  const bidPlacedAuctionsCount = activeAuctions.filter(a => 
    a.bids.some(bid => bid.traderId === user?.id)
  ).length;
  
  const totalSpend = orders
    .filter(order => order.status !== 'canceled')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const pendingDeliveries = orders.filter(o => 
    o.status === 'paid' || o.status === 'shipped'
  ).length;

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get recent auctions with my bids
  const myAuctions = activeAuctions
    .filter(a => a.bids.some(bid => bid.traderId === user?.id))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  return (
    <AuthGuard allowedRoles={["trader"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your trading activity
            </p>
          </div>
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              onChange={(e) => {
                if (e.target.value.trim()) {
                  navigate(`/products?search=${e.target.value.trim()}`);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  navigate(`/products?search=${(e.target as HTMLInputElement).value.trim()}`);
                }
              }}
            />
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <DataCard
            title="Active Auctions"
            value={activeAuctions.length}
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/auctions")}
              >
                View all auctions
              </Button>
            }
          />
          <DataCard
            title="My Active Bids"
            value={bidPlacedAuctionsCount}
            icon={<BarChart3 className="h-4 w-4 text-yellow-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/auctions?filter=my-bids")}
              >
                View my bids
              </Button>
            }
          />
          <DataCard
            title="Total Spend"
            value={`₹${totalSpend.toLocaleString()}`}
            icon={<Wallet className="h-4 w-4 text-green-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/trader/reports")}
              >
                View detailed reports
              </Button>
            }
          />
          <DataCard
            title="Pending Deliveries"
            value={pendingDeliveries}
            icon={<Clock className="h-4 w-4 text-purple-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/trader/orders")}
              >
                View all orders
              </Button>
            }
          />
        </div>
        
        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* My Bidding Activity */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">My Bidding Activity</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Auctions where you've placed bids</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              {myAuctions.length > 0 ? (
                <div className="space-y-4">
                  {myAuctions.map((auction) => {
                    const myBid = auction.bids
                      .filter(bid => bid.traderId === user?.id)
                      .sort((a, b) => b.amount - a.amount)[0];
                    
                    return (
                      <div 
                        key={auction.id} 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate(`/auctions/${auction.id}`)}
                      >
                        <div className="bg-primary/10 p-2 rounded">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{auction.productName}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Your bid: ₹{myBid?.amount || 0}
                              {auction.currentBid > (myBid?.amount || 0) && " (Outbid)"}
                            </span>
                            <StatusBadge status={auction.status} />
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Current highest: ₹{auction.currentBid}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No auction bids placed yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/auctions")}
              >
                Browse Auctions
              </Button>
            </CardFooter>
          </Card>
          
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => navigate(`/appointments/${appointment.id}`)}
                    >
                      <div className="bg-primary/10 p-2 rounded">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{appointment.title}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {appointment.date}, {appointment.time}
                          </span>
                          <StatusBadge status={appointment.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          With: {appointment.farmerName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No upcoming appointments</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/appointments")}
              >
                View All Appointments
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Available Products */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Available Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Products currently available for auction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs border-b bg-muted/50">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Farmer</th>
                    <th className="px-4 py-3 font-medium">Price (₹)</th>
                    <th className="px-4 py-3 font-medium">Quantity</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => p.status === 'auction').slice(0, 5).map((product) => (
                    <tr 
                      key={product.id} 
                      className="border-b hover:bg-muted/40 cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">{product.farmerName}</td>
                      <td className="px-4 py-3">₹{product.price}</td>
                      <td className="px-4 py-3">{product.quantity} {product.unit}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={product.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/products")}
            >
              View All Products
            </Button>
          </CardFooter>
        </Card>
      </MainLayout>
    </AuthGuard>
  );
}
