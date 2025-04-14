import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase, safeTable } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Package, Tag, MapPin, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          product:products (
            name,
            description,
            image_url,
            price,
            unit,
            location
          ),
          farmerProfile:profiles!orders_farmer_id_fkey (
            name
          ),
          traderProfile:profiles!orders_trader_id_fkey (
            name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      setOrder(data);
      setStatus(data?.status || "");
      setPaymentStatus(data?.payment_status || "");
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch order details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
  try {
    const { error } = await safeTable('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;

    // Create notification for the other party
    const recipientId = user?.id === order?.farmer_id 
      ? order?.trader_id 
      : order?.farmer_id;
      
    if (recipientId) {
      await safeTable('notifications')
        .insert({
          user_id: recipientId,
          title: 'Order Status Update',
          message: `Order #${id.substring(0, 8)} status has been updated to ${newStatus}`,
          type: 'order',
          read: false,
          created_at: new Date().toISOString()
        });
    }

    await fetchOrder();
    toast({
      title: "Status Updated",
      description: `Order status has been updated to ${newStatus}`,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update order status.",
    });
  }
};

  const handleUpdatePaymentStatus = async (newStatus: string) => {
  try {
    const paymentDate = newStatus === 'paid' ? new Date().toISOString() : null;
    
    const { error } = await safeTable('orders')
      .update({ 
        payment_status: newStatus,
        payment_date: paymentDate
      })
      .eq('id', id);

    if (error) throw error;

    // Create notification for the other party
    const recipientId = user?.id === order?.farmer_id 
      ? order?.trader_id 
      : order?.farmer_id;
      
    if (recipientId) {
      await safeTable('notifications')
        .insert({
          user_id: recipientId,
          title: 'Payment Status Update',
          message: `Order #${id.substring(0, 8)} payment status has been updated to ${newStatus}`,
          type: 'payment',
          read: false,
          created_at: new Date().toISOString()
        });
    }

    await fetchOrder();
    toast({
      title: "Payment Status Updated",
      description: `Payment status has been updated to ${newStatus}`,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update payment status.",
    });
  }
};

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          Order not found.
        </div>
      </DashboardLayout>
    );
  }

  const farmerName = order?.farmerProfile?.name || "Unknown Farmer";
const traderName = order?.traderProfile?.name || "Unknown Trader";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <DashboardHeader title="Order Details" userName={user?.name || "User"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>
                Details about this specific order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Order ID</Label>
                  <div className="font-bold">{order.id.substring(0, 8)}</div>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <Label>Product</Label>
                <div className="font-bold">{order.product?.name}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <div>{order.quantity}</div>
                </div>
                <div>
                  <Label>Price per unit</Label>
                  <div>{formatCurrency(order.price)}</div>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="font-bold">{formatCurrency(order.total_amount)}</div>
                </div>
              </div>

              <div>
                <Label>Additional Notes</Label>
                <div>{order.notes || "No notes provided."}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Status</Label>
                  <Select value={status} onValueChange={handleUpdateStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={handleUpdatePaymentStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{order.product?.name}</div>
                  <div className="text-sm text-muted-foreground">{order.product?.description}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Price</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(order.product?.price)}/{order.product?.unit}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">{order.product?.location}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Farmer</div>
                <div className="text-sm text-muted-foreground">{farmerName}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Trader</div>
                <div className="text-sm text-muted-foreground">{traderName}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetail;
