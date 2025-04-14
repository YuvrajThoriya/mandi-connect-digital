
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/context/AuthContext';

export const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <DashboardLayout userRole="farmer">
      <DashboardHeader title="Farmer Dashboard" userName={profile?.name || "Farmer"} userRole="farmer" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/farmer/products')}>
              Manage Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/farmer/auctions')}>
              Manage Auctions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/farmer/bids')}>
              View Bids
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/farmer/orders')}>
              View Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/farmer/appointments')}>
              Manage Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
