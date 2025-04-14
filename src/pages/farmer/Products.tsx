
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Plus, Search, Trash2, Filter } from "lucide-react";
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

export default function FarmerProducts() {
  const { user } = useAuth();
  const { getMyProducts, deleteProduct, isLoading } = useData();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  
  // Get all products for this farmer
  const products = getMyProducts();
  
  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variety.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      categoryFilter === "" || 
      product.category === categoryFilter;
      
    const matchesStatus = 
      statusFilter === "" || 
      product.status === statusFilter;
      
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category))];
  
  // Product statuses
  const statuses = ["draft", "pending", "auction", "sold", "canceled"];
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteProductId) {
      await deleteProduct(deleteProductId);
      setDeleteProductId(null);
    }
  };
  
  return (
    <AuthGuard allowedRoles={["farmer"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory and listings
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
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Product Filters</CardTitle>
            <CardDescription>Find products by name, category, or status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="h-9"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setStatusFilter("");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Products</CardTitle>
            <CardDescription>
              You have {products.length} products in your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs border-b bg-muted/50">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price (₹)</th>
                      <th className="px-4 py-3 font-medium">Quantity</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/40">
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">₹{product.price}</td>
                        <td className="px-4 py-3">{product.quantity} {product.unit}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/farmer/products/${product.id}`)}
                              title="View Product"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {product.status !== 'auction' && product.status !== 'sold' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/farmer/products/${product.id}/edit`)}
                                  title="Edit Product"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteProductId(product.id)}
                                  title="Delete Product"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mb-4 text-muted-foreground">
                  {products.length > 0 
                    ? "No products match your filters"
                    : "You haven't added any products yet"}
                </div>
                <Button onClick={() => navigate("/farmer/products/add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={deleteProductId !== null} 
          onOpenChange={() => setDeleteProductId(null)}
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
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </AuthGuard>
  );
}
