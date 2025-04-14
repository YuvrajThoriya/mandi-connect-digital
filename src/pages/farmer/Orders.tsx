
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Filter, Package, Search, Truck } from "lucide-react";
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

export default function FarmerOrders() {
  const { user } = useAuth();
  const { getMyOrders, isLoading } = useData();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Change from "" to "all"
  
  // Get all orders for this farmer
  const orders = getMyOrders();
  
  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      searchTerm === "" || 
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.traderName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || // Change from "" to "all"
      order.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  return (
    <AuthGuard allowedRoles={["farmer"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">
              View and manage your orders from traders
            </p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Filters</CardTitle>
            <CardDescription>Find orders by product name or status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product or trader..."
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
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
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
                  setStatusFilter("all"); // Change from "" to "all"
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card 
                key={order.id} 
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => navigate(`/farmer/orders/${order.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{order.productName}</h3>
                        <div className="text-sm text-muted-foreground">
                          Order #{order.id} • {formatDate(order.createdAt)}
                        </div>
                        <div className="mt-1">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:text-right">
                      <div className="text-sm text-muted-foreground">Order Total</div>
                      <div className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.quantity} {order.unit} at ₹{order.pricePerUnit}/unit
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Trader</div>
                      <div className="font-medium">{order.traderName}</div>
                    </div>
                    
                    {order.status !== 'pending' && (
                      <div>
                        <div className="text-muted-foreground mb-1">Payment Method</div>
                        <div>{order.paymentMethod || 'Not specified'}</div>
                      </div>
                    )}
                    
                    {order.status === 'shipped' && (
                      <div>
                        <div className="text-muted-foreground mb-1">Shipping Status</div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-blue-600" />
                          <span>In Transit</span>
                        </div>
                      </div>
                    )}
                    
                    {order.deliveryDate && (
                      <div>
                        <div className="text-muted-foreground mb-1">Delivery Date</div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(order.deliveryDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {orders.length > 0 
                  ? "Try changing your filters to see more results" 
                  : "You haven't received any orders yet"}
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/farmer/products")}
              >
                View Your Products
              </Button>
            </CardContent>
          </Card>
        )}
      </MainLayout>
    </AuthGuard>
  );
}
