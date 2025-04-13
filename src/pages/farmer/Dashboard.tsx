
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Calendar, 
  Clock, 
  DollarSign, 
  Package, 
  Plus, 
  ShoppingBag, 
  TrendingUp, 
  Truck 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataCard } from "@/components/ui/data-card";
import { LoadingOverlay } from "@/components/ui/loader";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { 
    getMyProducts, 
    getMyAuctions, 
    getMyOrders, 
    getMyAppointments, 
    isLoading 
  } = useData();
  const navigate = useNavigate();

  const products = getMyProducts();
  const auctions = getMyAuctions();
  const orders = getMyOrders();
  const appointments = getMyAppointments();

  // Calculate metrics
  const activeAuctions = auctions.filter(a => a.status === 'active').length;
  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const totalRevenue = orders
    .filter(order => order.status !== 'canceled')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'pending').length;

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get recent auctions
  const recentAuctions = auctions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  return (
    <AuthGuard allowedRoles={["farmer"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your products today
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/farmer/products/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <DataCard
            title="Active Auctions"
            value={activeAuctions}
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/farmer/auctions")}
              >
                View all auctions
              </Button>
            }
          />
          <DataCard
            title="Pending Products"
            value={pendingProducts}
            icon={<Clock className="h-4 w-4 text-yellow-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/farmer/products")}
              >
                View all products
              </Button>
            }
          />
          <DataCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-green-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/farmer/reports")}
              >
                View detailed reports
              </Button>
            }
          />
          <DataCard
            title="Orders to Fulfill"
            value={pendingOrders}
            icon={<Truck className="h-4 w-4 text-purple-500" />}
            footer={
              <Button 
                variant="link" 
                className="px-0 w-full justify-start text-xs text-muted-foreground" 
                onClick={() => navigate("/farmer/orders")}
              >
                View all orders
              </Button>
            }
          />
        </div>
        
        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Recent Auctions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Auctions</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Your most recent auction activities</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              {recentAuctions.length > 0 ? (
                <div className="space-y-4">
                  {recentAuctions.map((auction) => (
                    <div key={auction.id} className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded">
                        <BarChart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{auction.productName}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Current Bid: ₹{auction.currentBid}
                          </span>
                          <StatusBadge status={auction.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No recent auctions found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/farmer/auctions")}
              >
                View All Auctions
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
                    <div key={appointment.id} className="flex items-center gap-4">
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
        
        {/* My Products */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">My Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Manage your listed products</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs border-b bg-muted/50">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price (₹)</th>
                      <th className="px-4 py-3 font-medium">Quantity</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((product) => (
                      <tr 
                        key={product.id} 
                        className="border-b hover:bg-muted/40 cursor-pointer"
                        onClick={() => navigate(`/farmer/products/${product.id}`)}
                      >
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
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
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No products found</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/farmer/products/add")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </CardContent>
          {products.length > 0 && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/farmer/products")}
              >
                View All Products
              </Button>
            </CardFooter>
          )}
        </Card>
      </MainLayout>
    </AuthGuard>
  );
}
