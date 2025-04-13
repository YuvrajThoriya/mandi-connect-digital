
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FileDown, Filter, Package, Search, ShoppingBag, Truck } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TraderOrders() {
  const navigate = useNavigate();
  const { getMyOrders, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Get all orders
  const orders = getMyOrders();
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery
      ? order.productName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter
      ? order.status === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Count orders by status
  const orderCounts = {
    pending: orders.filter(o => o.status === "pending").length,
    paid: orders.filter(o => o.status === "paid").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    completed: orders.filter(o => o.status === "completed").length,
    canceled: orders.filter(o => o.status === "canceled").length,
  };
  
  return (
    <AuthGuard allowedRoles={["trader"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter("")}>
              All Orders
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
              Pending ({orderCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setStatusFilter("paid")}>
              In Transit ({orderCounts.paid + orderCounts.shipped})
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setStatusFilter("completed")}>
              Completed ({orderCounts.completed})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className="p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/trader/orders/${order.id}`)}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-md flex items-center justify-center">
                    {getOrderStatusIcon(order.status)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium">{order.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Order ID: #{order.id}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">
                        {order.quantity} {order.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm">
                      Farmer: <span className="font-medium">{order.farmerName}</span>
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trader/orders/${order.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      
                      {(order.status === "completed" || order.status === "delivered") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/trader/orders/${order.id}/invoice`, "_blank");
                          }}
                        >
                          <FileDown className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredOrders.length === 0 && (
            <Card className="p-12 text-center">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : "You haven't placed any orders yet."}
              </p>
              {!(searchQuery || statusFilter) && (
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/trader/products")}
                >
                  Browse Products
                </Button>
              )}
            </Card>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

function getOrderStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-6 w-6 text-primary" />;
    case 'paid':
      return <ShoppingBag className="h-6 w-6 text-blue-500" />;
    case 'shipped':
      return <Truck className="h-6 w-6 text-yellow-500" />;
    case 'delivered':
    case 'completed':
      return <Package className="h-6 w-6 text-green-500" />;
    case 'canceled':
      return <Filter className="h-6 w-6 text-destructive" />;
    default:
      return <Package className="h-6 w-6 text-primary" />;
  }
}
