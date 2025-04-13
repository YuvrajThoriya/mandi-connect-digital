
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, MapPin, Package, ShoppingCart, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function TraderProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, isLoading } = useData();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  const product = getProductById(id || "");
  
  const orderForm = useForm({
    defaultValues: {
      quantity: 0,
      shippingAddress: "",
      contactNumber: "",
    },
  });
  
  if (!product) {
    return (
      <AuthGuard allowedRoles={["trader"]}>
        <MainLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">
              The product you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate("/trader/products")}>
              View All Products
            </Button>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }

  const placeOrder = (data: any) => {
    // In a real app, this would call the API to place an order
    toast.success("Order placed successfully!");
    setIsOrderDialogOpen(false);
    navigate("/trader/orders");
  };
  
  const handleBookAppointment = () => {
    navigate(`/appointments/add?farmerId=${product.farmerId}&productId=${product.id}`);
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
            onClick={() => navigate("/trader/products")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <AspectRatio ratio={4/3}>
                <img
                  src={product.images[selectedImage] || '/assets/product-placeholder.jpg'}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </Card>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded overflow-hidden flex-shrink-0 w-20 h-20 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <StatusBadge status={product.status} />
            </div>
            
            <div className="flex items-center text-muted-foreground mb-4">
              <Package className="h-4 w-4 mr-1" />
              <span>{product.category} • {product.variety}</span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold mb-1">
                  ₹{product.price} <span className="text-base font-normal text-muted-foreground">per {product.unit}</span>
                </div>
                {product.expectedPrice > product.price && (
                  <div className="text-sm text-muted-foreground">
                    Expected price: ₹{product.expectedPrice} per {product.unit}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">Available</div>
                <div className="text-xl font-bold">{product.quantity} <span className="text-base font-normal text-muted-foreground">{product.unit}</span></div>
              </div>
            </div>
            
            {product.grade && (
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold">
                  Grade {product.grade}
                </span>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Farmer Details</h3>
                <div className="flex items-center gap-4">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{product.farmerName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" /> {product.location}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row gap-4">
                {product.status === "auction" ? (
                  <Button 
                    className="flex-1"
                    onClick={() => navigate(`/auctions?productId=${product.id}`)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Auction
                  </Button>
                ) : (
                  <Button 
                    className="flex-1"
                    disabled={product.status !== "pending"}
                    onClick={() => setIsOrderDialogOpen(true)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleBookAppointment}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Inspection
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center mb-1">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping available to major market yards
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Listed on {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
              <DialogDescription>
                Complete the following details to place an order for {product.name}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...orderForm}>
              <form onSubmit={orderForm.handleSubmit(placeOrder)} className="space-y-4">
                <FormField
                  control={orderForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity ({product.unit})</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={1} 
                          max={product.quantity} 
                        />
                      </FormControl>
                      <FormDescription>
                        Available: {product.quantity} {product.unit}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orderForm.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your shipping address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orderForm.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your contact number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Confirm Order
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
