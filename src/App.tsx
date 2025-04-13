
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Main Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmerProducts from "./pages/farmer/Products";
import FarmerProductDetail from "./pages/farmer/ProductDetail";
import FarmerProductAdd from "./pages/farmer/ProductAdd";
import FarmerProductEdit from "./pages/farmer/ProductEdit";
import FarmerAuctions from "./pages/farmer/Auctions";
import FarmerAuctionDetail from "./pages/farmer/AuctionDetail";
import FarmerOrders from "./pages/farmer/Orders";
import FarmerOrderDetail from "./pages/farmer/OrderDetail";

// Trader Pages
import TraderDashboard from "./pages/trader/Dashboard";
import TraderProducts from "./pages/trader/Products";
import TraderProductDetail from "./pages/trader/ProductDetail";
import TraderAuctions from "./pages/trader/Auctions";
import TraderAuctionDetail from "./pages/trader/AuctionDetail";
import TraderOrders from "./pages/trader/Orders";
import TraderOrderDetail from "./pages/trader/OrderDetail";

// Common Pages
import Appointments from "./pages/common/Appointments";
import AppointmentAdd from "./pages/common/AppointmentAdd";
import AppointmentDetail from "./pages/common/AppointmentDetail";
import Notifications from "./pages/common/Notifications";
import Profile from "./pages/common/Profile";
import Settings from "./pages/common/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Farmer Routes */}
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/products" element={<FarmerProducts />} />
              <Route path="/farmer/products/add" element={<FarmerProductAdd />} />
              <Route path="/farmer/products/:id" element={<FarmerProductDetail />} />
              <Route path="/farmer/products/:id/edit" element={<FarmerProductEdit />} />
              <Route path="/farmer/auctions" element={<FarmerAuctions />} />
              <Route path="/farmer/auctions/:id" element={<FarmerAuctionDetail />} />
              <Route path="/farmer/orders" element={<FarmerOrders />} />
              <Route path="/farmer/orders/:id" element={<FarmerOrderDetail />} />
              
              {/* Trader Routes */}
              <Route path="/trader/dashboard" element={<TraderDashboard />} />
              <Route path="/trader/products" element={<TraderProducts />} />
              <Route path="/products/:id" element={<TraderProductDetail />} />
              <Route path="/trader/auctions" element={<TraderAuctions />} />
              <Route path="/auctions/:id" element={<TraderAuctionDetail />} />
              <Route path="/trader/orders" element={<TraderOrders />} />
              <Route path="/trader/orders/:id" element={<TraderOrderDetail />} />
              
              {/* Common Routes */}
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointments/add" element={<AppointmentAdd />} />
              <Route path="/appointments/:id" element={<AppointmentDetail />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
