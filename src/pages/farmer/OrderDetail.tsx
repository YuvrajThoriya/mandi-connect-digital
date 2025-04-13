
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  FileText, 
  MapPin, 
  Package, 
  Truck, 
  User 
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UpdateShippingFormValues = {
  trackingInfo: string;
};

export default function FarmerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus, generateInvoice, isLoading } = useData();
  
  const [updateShippingDialogOpen, setUpdateShippingDialogOpen] = useState(false);
  
  // Get order details
  const order = getOrderById(id || "");
  
  const form = useForm<UpdateShippingFormValues>({
    defaultValues: {
      trackingInfo: order?.trackingInfo || "",
    },
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  // Handle shipping update
  const handleUpdateShipping = async (values: UpdateShippingFormValues) => {
    if (!id) return;
    
    try {
      const success = await updateOrderStatus(id, 'shipped', values.trackingInfo);
      
      if (success) {
        setUpdateShippingDialogOpen(false);
        toast.success("Order status updated to shipped");
      }
    } catch (error) {
      console.error("Failed to update shipping status:", error);
      toast.error("Failed to update shipping status");
    }
  };
  
  // Handle order status update
  const handleUpdateStatus = async (status: 'shipped' | 'delivered' | 'completed' | 'canceled') => {
    if (!id) return;
    
    if (status === 'shipped') {
      setUpdateShippingDialogOpen(true);
      return;
    }
    
    try {
      const success = await updateOrderStatus(id, status);
      
      if (success) {
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };
  
  // Handle invoice generation
  const handleGenerateInvoice = () => {
    if (!id) return;
    
    const invoiceUrl = generateInvoice(id);
    if (invoiceUrl) {
      toast.success("Invoice generated successfully");
      // In a real app, this would download or open the invoice
      // For now, we'll just show a toast message
      toast("In a real app, this would download the invoice PDF");
    }
  };
  
  if (!order) {
    return (
      <AuthGuard allowedRoles={["farmer"]}>
        <MainLayout>
          <div className="py-12 text-center">
            <div className="mb-4 text-muted-foreground">Order not found</div>
            <Button onClick={() => navigate("/farmer/orders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }
  
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
                onClick={() => navigate("/farmer/orders")}
              >
                Orders
              </Button>
              <span>/</span>
              <span>Order #{order.id}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/farmer/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <Button 
              variant="outline"
              onClick={handleGenerateInvoice}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
          </div>
        </div>
        
        {/* Order Status Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} className="text-base px-3 py-1" />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 mb-1">
                    <Calendar className="h-4 w-4" />
                    Order Date: {formatDate(order.createdAt)}
                  </span>
                  {order.paymentMethod && (
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Payment Method: {order.paymentMethod}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xl font-semibold text-primary">
                  ₹{order.totalAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.quantity} {order.unit} at ₹{order.pricePerUnit.toLocaleString()}/unit
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
                <CardDescription>
                  Details about the order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Product Details</h3>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{order.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.quantity} {order.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{order.pricePerUnit} per {order.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Trader Information</h3>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{order.traderName}</div>
                        <div className="text-sm text-muted-foreground">
                          Trader ID: {order.traderId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-6">
                  {order.shippingAddress && (
                    <div>
                      <h3 className="font-medium mb-2">Delivery Address</h3>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="whitespace-pre-line">
                            {order.shippingAddress}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.trackingInfo && (
                    <div>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="whitespace-pre-line">
                            {order.trackingInfo}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {order.feedback?.farmerComment && (
                  <>
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Trader Feedback</h3>
                      <div className="p-4 bg-muted rounded-md">
                        {order.feedback.farmerRating && (
                          <div className="flex items-center gap-1 mb-2">
                            {Array(5).fill(0).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={i < order.feedback.farmerRating! ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`h-4 w-4 ${i < order.feedback.farmerRating! ? "text-yellow-500" : "text-muted-foreground"}`}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                            <span className="text-sm ml-1">
                              {order.feedback.farmerRating} stars
                            </span>
                          </div>
                        )}
                        <div className="text-sm">{order.feedback.farmerComment}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  
                  {order.paymentMethod && order.paymentId && (
                    <div className="mt-4 pt-4 border-t text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span>{order.paymentId}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Actions and Status */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
                <CardDescription>
                  Manage this order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Current Status</div>
                  <StatusBadge status={order.status} />
                </div>
                
                {order.status === 'paid' && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpdateStatus('shipped')}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Mark as Shipped
                  </Button>
                )}
                
                {order.status === 'shipped' && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleUpdateStatus('delivered')}
                    disabled={true} // In a real app, this would be enabled
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Mark as Delivered
                  </Button>
                )}
                
                {(order.status === 'pending' || order.status === 'paid') && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleUpdateStatus('canceled')}
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="text-xs text-muted-foreground">
                  <p>Order status flow:</p>
                  <p>Pending → Paid → Shipped → Delivered → Completed</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Update Shipping Dialog */}
        <Dialog open={updateShippingDialogOpen} onOpenChange={setUpdateShippingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Shipping Information</DialogTitle>
              <DialogDescription>
                Provide tracking details for this shipment.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateShipping)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="trackingInfo"
                  rules={{ required: "Tracking information is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Information</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Dispatched via XYZ Logistics. Expected delivery in 2 days." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setUpdateShippingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update and Ship
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </AuthGuard>
  );
}
