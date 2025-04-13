
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  GanttChartSquare, 
  Tag, 
  MapPin, 
  Trash2, 
  ShoppingBag,
  Gavel
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

type AuctionFormValues = {
  startPrice: number;
  minIncrement: number;
  duration: number;
};

export default function FarmerProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, deleteProduct, createAuction, isLoading } = useData();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [auctionDialogOpen, setAuctionDialogOpen] = useState(false);
  
  // Get product details
  const product = getProductById(id || "");
  
  // Form for auction creation
  const form = useForm<AuctionFormValues>({
    defaultValues: {
      startPrice: product?.price || 0,
      minIncrement: 1,
      duration: 24, // 24 hours
    },
  });
  
  if (!product) {
    return (
      <AuthGuard allowedRoles={["farmer"]}>
        <MainLayout>
          <div className="py-12 text-center">
            <div className="mb-4 text-muted-foreground">Product not found</div>
            <Button onClick={() => navigate("/farmer/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }
  
  // Handle delete confirmation
  const handleDelete = async () => {
    if (id) {
      const success = await deleteProduct(id);
      if (success) {
        navigate("/farmer/products");
      }
    }
  };
  
  // Handle auction creation
  const handleCreateAuction = async (values: AuctionFormValues) => {
    try {
      await createAuction(id || "", values);
      setAuctionDialogOpen(false);
      navigate("/farmer/auctions");
    } catch (error) {
      console.error("Failed to create auction:", error);
      // Form errors are handled by the form library
    }
  };
  
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
                onClick={() => navigate("/farmer/products")}
              >
                Products
              </Button>
              <span>/</span>
              <span>{product.name}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.status !== 'auction' && product.status !== 'sold' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/farmer/products/${id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            {product.status === 'pending' && (
              <Button 
                onClick={() => setAuctionDialogOpen(true)}
              >
                <Gavel className="mr-2 h-4 w-4" />
                Create Auction
              </Button>
            )}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <AspectRatio ratio={4/3} className="bg-muted">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="rounded-md object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                    <ShoppingBag className="h-16 w-16" />
                  </div>
                )}
              </AspectRatio>
              
              {/* Image thumbnails if multiple images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.images.map((img, index) => (
                    <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                      <img
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Product Information */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">₹{product.price}</div>
                <StatusBadge status={product.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Category</div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    {product.category}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Variety</div>
                  <div>{product.variety}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Quantity</div>
                  <div>{product.quantity} {product.unit}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Expected Price</div>
                  <div>₹{product.expectedPrice}</div>
                </div>
                {product.grade && (
                  <div>
                    <div className="text-muted-foreground mb-1">Grade</div>
                    <div>Grade {product.grade}</div>
                  </div>
                )}
                <div>
                  <div className="text-muted-foreground mb-1">Location</div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {product.location}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground mb-1">Listed On</div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(product.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-muted-foreground mb-1">Description</div>
                <p>{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product from your inventory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Create Auction Dialog */}
        <Dialog open={auctionDialogOpen} onOpenChange={setAuctionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Auction</DialogTitle>
              <DialogDescription>
                Set up an auction for this product. Once created, traders will be able to bid on it.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateAuction)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="startPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Bid Increment (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auction Duration (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAuctionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Auction
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
