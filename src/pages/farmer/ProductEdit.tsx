
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingOverlay } from "@/components/ui/loader";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Grains", "Vegetables", "Fruits", "Pulses", "Spices", "Other"];
const UNITS = ["kg", "quintal", "ton", "pieces"];

type ProductFormValues = {
  name: string;
  category: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  expectedPrice: number;
  description: string;
  location: string;
};

export default function FarmerProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, updateProduct, isLoading } = useData();
  const product = getProductById(id || "");
  
  const [images, setImages] = useState<string[]>([]);
  
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      category: "",
      variety: "",
      quantity: 0,
      unit: "kg",
      price: 0,
      expectedPrice: 0,
      description: "",
      location: "",
    },
  });
  
  // Load product data when component mounts
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        variety: product.variety,
        quantity: product.quantity,
        unit: product.unit,
        price: product.price,
        expectedPrice: product.expectedPrice,
        description: product.description,
        location: product.location,
      });
      
      setImages(product.images || ["/assets/product-placeholder.jpg"]);
    }
  }, [product, form]);
  
  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    if (!id) return;
    
    try {
      // Update product with new data
      const success = await updateProduct(id, {
        ...data,
        images: images,
      });
      
      if (success) {
        toast.success("Product updated successfully");
        navigate(`/farmer/products/${id}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };
  
  // Mock image upload function
  const handleImageUpload = () => {
    // In a real app, this would handle actual file uploads
    // For now, we'll just use a placeholder image
    toast.info("Image upload functionality will be implemented with backend integration");
  };
  
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
  
  return (
    <AuthGuard allowedRoles={["farmer"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header */}
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
              <Button 
                variant="link" 
                className="p-0 h-auto text-muted-foreground" 
                onClick={() => navigate(`/farmer/products/${id}`)}
              >
                {product.name}
              </Button>
              <span>/</span>
              <span>Edit</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/farmer/products/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
              <CardDescription>
                Upload clear images of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className="aspect-square relative rounded-md overflow-hidden border bg-muted/40"
                  >
                    <img
                      src={img}
                      alt="Product"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
                <div 
                  className="aspect-square flex items-center justify-center border border-dashed rounded-md cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={handleImageUpload}
                >
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Add Image</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                You can upload up to 4 images of your product. Clear images help traders evaluate the quality.
              </div>
            </CardContent>
          </Card>
          
          {/* Product Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
              <CardDescription>
                Edit the details of your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Product name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Premium Basmati Rice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="variety"
                      rules={{ required: "Variety is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variety</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Basmati, Roma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      rules={{ required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" } }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unit"
                      rules={{ required: "Unit is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      rules={{ 
                        required: "Price is required", 
                        min: { value: 1, message: "Price must be at least ₹1" } 
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="expectedPrice"
                      rules={{ 
                        required: "Expected price is required", 
                        min: { value: 1, message: "Expected price must be at least ₹1" } 
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Price (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            The price you hope to get
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    rules={{ required: "Location is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Patna, Bihar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your product in detail..." 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(`/farmer/products/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Product
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
