
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Grid, List, Search, SlidersHorizontal } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { CATEGORIES } from "@/types";

export default function TraderProducts() {
  const navigate = useNavigate();
  const { products, isLoading } = useData();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("auction");

  // Filter products based on search, category and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = categoryFilter 
      ? product.category === categoryFilter 
      : true;
    
    const matchesStatus = statusFilter 
      ? product.status === statusFilter 
      : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AuthGuard allowedRoles={["trader"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Products</h1>
            <p className="text-muted-foreground">
              Browse and purchase products from local farmers
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-row gap-2">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="auction">For Auction</SelectItem>
                <SelectItem value="pending">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView("grid")}>
                  <Grid className="h-4 w-4 mr-2" /> Grid View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("list")}>
                  <List className="h-4 w-4 mr-2" /> List View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* View Switcher */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all" onClick={() => setStatusFilter("")}>All Products</TabsTrigger>
            <TabsTrigger value="auction" onClick={() => setStatusFilter("auction")}>For Auction</TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>Coming Soon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                    <div 
                      className="cursor-pointer h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.images[0] || '/assets/product-placeholder.jpg'})` }}
                      onClick={() => navigate(`/products/${product.id}`)}
                    />
                    <CardContent className="pt-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <StatusBadge status={product.status} />
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {product.category} • {product.variety}
                      </p>
                      <p className="font-medium mb-2">
                        ₹{product.price} per {product.unit}
                      </p>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {product.description}
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>From: {product.farmerName}</p>
                        <p className="text-xs">{product.location}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 pb-3">
                      <div className="flex justify-between w-full">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          View Details
                        </Button>
                        {product.status === "auction" && (
                          <Button onClick={() => navigate(`/auctions?productId=${product.id}`)}>
                            Bid Now
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div 
                        className="h-40 md:w-48 bg-cover bg-center cursor-pointer"
                        style={{ backgroundImage: `url(${product.images[0] || '/assets/product-placeholder.jpg'})` }}
                        onClick={() => navigate(`/products/${product.id}`)}
                      />
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <StatusBadge status={product.status} />
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {product.category} • {product.variety}
                        </p>
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">
                            ₹{product.price} per {product.unit}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Available: {product.quantity} {product.unit}
                          </p>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {product.description}
                        </p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>From: {product.farmerName}, {product.location}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            View Details
                          </Button>
                          {product.status === "auction" && (
                            <Button onClick={() => navigate(`/auctions?productId=${product.id}`)}>
                              Bid Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 && (
              <Card className="p-12 text-center">
                <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="auction" className="mt-0">
            {/* Content is dynamically filtered and rendered */}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            {/* Content is dynamically filtered and rendered */}
          </TabsContent>
        </Tabs>
      </MainLayout>
    </AuthGuard>
  );
}
