
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Farmer pages
import FarmerDashboard from "@/pages/FarmerDashboard";
import FarmerProducts from "@/pages/FarmerProducts";
import FarmerProfile from "@/pages/FarmerProfile";
import FarmerAuctions from "@/pages/FarmerAuctions";
import FarmerOrders from "@/pages/FarmerOrders";
import FarmerAppointments from "@/pages/FarmerAppointments";

// Trader pages
import TraderDashboard from "@/pages/TraderDashboard";
import TraderProfile from "@/pages/TraderProfile";
import TraderMarket from "@/pages/TraderMarket";
import TraderAuctions from "@/pages/TraderAuctions";
import TraderOrders from "@/pages/TraderOrders";
import TraderAppointments from "@/pages/TraderAppointments";
import TraderOrderCreate from "@/pages/TraderOrderCreate";
import TraderOrderDetails from "@/pages/TraderOrderDetails";
import TraderBids from "@/pages/TraderBids";

// Common pages
import Settings from "@/pages/Settings";
import ProductForm from "@/pages/ProductForm";
import ProductDetail from "@/pages/ProductDetail";
import AuctionForm from "@/pages/AuctionForm";
import AuctionPage from "@/pages/AuctionPage";
import AppointmentForm from "@/pages/AppointmentForm";
import OrderDetail from "@/pages/OrderDetail";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Index />} />

          {/* Farmer routes */}
          <Route
            path="/farmer"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <Navigate to="/farmer/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products/new"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/profile"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/auctions"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerAuctions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/auctions/new"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <AuctionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/auctions/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <AuctionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/appointments"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/appointments/new"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <AppointmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/settings"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Trader routes */}
          <Route
            path="/trader"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <Navigate to="/trader/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/dashboard"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/profile"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/market"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderMarket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/products/:id"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/auctions"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderAuctions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/auctions/:id"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <AuctionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/orders"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/orders/new"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderOrderCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderOrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/bids"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderBids />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/appointments"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <TraderAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/appointments/new"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <AppointmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trader/settings"
            element={
              <ProtectedRoute allowedRoles={["trader"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
