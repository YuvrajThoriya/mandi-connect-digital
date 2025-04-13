
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, Download, Edit, MapPin, Package, Star, Truck, User } from "lucide-react";
import { toast } from "sonner";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export default function TraderOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, getProductById, updateOrderStatus, generateInvoice, isLoading } = useData();
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  
  // Get order data
  const order = getOrderById(id || "");
  
  // Get related product
  const product = order ? getProductById(order.productId) : undefined;
  
  // Form for feedback
  const feedbackForm = useForm({
    defaultValues: {
      farmerRating: 5,
      farmerComment: "",
    },
  });
  
  if (!order || !product) {
    return (
      <AuthGuard allowedRoles={["trader"]}>
        <MainLayout>
          {isLoading ? <LoadingOverlay /> : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                The order you are looking for does not exist or has been removed.
              </p>
              <Button onClick={() => navigate("/trader/orders")}>
                View All Orders
              </Button>
            </div>
          )}
        </MainLayout>
      </AuthGuard>
    );
  }
  
  // Handle feedback submission
  const onSubmitFeedback = async (data: any) => {
    try {
      // In a real app, this would call an API to update feedback
      await updateOrderStatus(order.id, "completed", undefined);
      toast.success("Thank you for your feedback!");
      setIsFeedbackDialogOpen(false);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };
  
  // Handle order confirmation
  const handleConfirmDelivery = async () => {
    try {
      await updateOrderStatus(order.id, "delivered");
      toast.success("Delivery confirmed! Please provide your feedback.");
      setIsFeedbackDialogOpen(true);
    } catch (error) {
      toast.error("Failed to confirm delivery. Please try again.");
    }
  };
  
  // Handle invoice download
  const handleDownloadInvoice = () => {
    const invoiceUrl = generateInvoice(order.id);
    // In a real app, this would download the actual invoice
    toast.success("Invoice downloaded successfully!");
  };
  
  // Get order status steps
  const getOrderStatusSteps = () => {
    const steps = [
      { label: "Order Placed", status: "pending", completed: true },
      { label: "Payment Confirmed", status: "paid", completed: ["paid", "shipped", "delivered", "completed"].includes(order.status) },
      { label: "Shipped", status: "shipped", completed: ["shipped", "delivered", "completed"].includes(order.status) },
      { label: "Delivered", status: "delivered", completed: ["delivered", "completed"].includes(order.status) },
      { label: "Completed", status: "completed", completed: ["completed"].includes(order.status) },
    ];
    
    // Don't show steps if order is canceled
    if (order.status === "canceled") return null;
    
    return (
      <div className="relative mt-8 mb-12">
        <div className="absolute top-3 left-0 w-full h-0.5 bg-muted"></div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full ${
                step.completed 
                  ? 'bg-green-500' 
                  : 'bg-muted'
              } flex items-center justify-center z-10`}>
                {step.completed && <Check className="h-4 w-4 text-white" />}
              </div>
              <span className={`text-xs mt-2 text-center ${
                step.completed ? 'text-green-600 font-medium' : 'text-muted-foreground'
              }`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AuthGuard allowedRoles={["trader"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="p-0 h-auto font-normal"
            onClick={() => navigate("/trader/orders")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <span>Order #{order.id}</span>
              <StatusBadge status={order.status} />
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            {order.status === "shipped" && (
              <Button onClick={handleConfirmDelivery}>
                <Package className="mr-2 h-4 w-4" />
                Confirm Delivery
              </Button>
            )}
            
            {(order.status === "delivered" && !order.feedback?.traderRating) && (
              <Button onClick={() => setIsFeedbackDialogOpen(true)}>
                <Star className="mr-2 h-4 w-4" />
                Leave Feedback
              </Button>
            )}
            
            {(order.status === "delivered" || order.status === "completed") && (
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            )}
          </div>
        </div>
        
        {/* Order Status Steps */}
        {getOrderStatusSteps()}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Product Information */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded bg-center bg-cover" style={{ 
                      backgroundImage: `url(${product.images[0] || '/assets/product-placeholder.jpg'})` 
                    }} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • {product.variety}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p>{order.quantity} {order.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price per unit</p>
                        <p>₹{order.pricePerUnit}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Order Timeline */}
                <div>
                  <h3 className="font-medium mb-2">Order Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    {order.status !== "pending" && (
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Payment Confirmed</p>
                          <p className="text-sm text-muted-foreground">
                            {order.paymentMethod} - {order.paymentId}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {["shipped", "delivered", "completed"].includes(order.status) && (
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center">
                          <Truck className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-medium">Shipped</p>
                          <p className="text-sm text-muted-foreground">
                            {order.trackingInfo}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {["delivered", "completed"].includes(order.status) && (
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Delivered</p>
                          <p className="text-sm text-muted-foreground">
                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'Date not recorded'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {order.status === "canceled" && (
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                          <X className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium">Order Canceled</p>
                          <p className="text-sm text-muted-foreground">
                            The order has been canceled.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-1">Delivery Address</p>
                <p className="text-muted-foreground whitespace-pre-line mb-4">
                  {order.shippingAddress || 'No address provided'}
                </p>
                
                {order.trackingInfo && (
                  <>
                    <p className="font-medium mb-1">Tracking Information</p>
                    <p className="text-muted-foreground">
                      {order.trackingInfo}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Farmer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.farmerName}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {product.location}
                    </p>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 mt-1"
                      onClick={() => navigate(`/appointments/add?farmerId=${order.farmerId}`)}
                    >
                      Schedule an appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.pricePerUnit * order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹0</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
                
                {order.status !== "pending" && (
                  <div className="mt-4">
                    <p className="font-medium mb-1">Payment Method</p>
                    <p className="text-muted-foreground">
                      {order.paymentMethod || 'Not specified'}
                    </p>
                    {order.paymentId && (
                      <p className="text-sm text-muted-foreground">
                        Transaction ID: {order.paymentId}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Feedback Card (if feedback exists) */}
            {order.feedback?.farmerRating && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (order.feedback?.farmerRating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-medium">
                      {order.feedback?.farmerRating}/5
                    </span>
                  </div>
                  
                  {order.feedback?.farmerComment && (
                    <div className="mt-2">
                      <p className="italic text-muted-foreground">
                        "{order.feedback.farmerComment}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Feedback Dialog */}
        <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Rate Your Experience</DialogTitle>
              <DialogDescription>
                How was your experience with the product and the farmer?
              </DialogDescription>
            </DialogHeader>
            
            <Form {...feedbackForm}>
              <form onSubmit={feedbackForm.handleSubmit(onSubmitFeedback)} className="space-y-6">
                <FormField
                  control={feedbackForm.control}
                  name="farmerRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          className="flex space-x-1"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="flex flex-col items-center">
                              <RadioGroupItem
                                value={rating.toString()}
                                id={`rating-${rating}`}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={`rating-${rating}`}
                                className={`p-2 cursor-pointer rounded-full hover:bg-muted ${
                                  field.value >= rating ? 'text-yellow-400' : 'text-muted-foreground'
                                }`}
                              >
                                <Star className={`h-6 w-6 ${field.value >= rating ? 'fill-yellow-400' : ''}`} />
                              </Label>
                              <span className="sr-only">{rating} star{rating > 1 ? 's' : ''}</span>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={feedbackForm.control}
                  name="farmerComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience with the product and the farmer..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Feedback
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

// These components are needed but were missing in the import
function Check(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
}

function DollarSign(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}

function Home(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

function X(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
