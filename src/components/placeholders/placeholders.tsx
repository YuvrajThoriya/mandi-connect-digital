
import { Package, FileText, User, Calendar, Bell, Settings, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="bg-muted/30 p-8 rounded-lg border-2 border-dashed border-muted">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            This page is under construction
          </p>
          <p className="text-muted-foreground">
            The {title.toLowerCase()} functionality will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ProfilePlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-muted h-32 w-32 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="font-medium">Account settings coming soon</p>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array(5).fill(null).map((_, i) => (
                <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
              ))}
              <div className="mt-6">
                <Button disabled>Update Profile</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ProductsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted/50 flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <CardHeader>
              <CardTitle className="h-6 bg-muted/50 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
              </div>
              <div className="mt-4">
                <Button variant="outline" disabled className="w-full">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AuctionsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="h-6 bg-muted/50 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-20 bg-muted/50 rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
                </div>
                <div className="pt-4 flex justify-between">
                  <Button disabled size="sm">View Details</Button>
                  <Button disabled size="sm" variant="outline">Place Bid</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const OrdersPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(null).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-16" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 bg-muted/50 rounded animate-pulse w-16" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button disabled size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AppointmentsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-muted/50 h-10 w-10 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="h-5 bg-muted/50 rounded animate-pulse w-40" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button disabled size="sm" variant="outline">Cancel</Button>
                <Button disabled size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const NotificationsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg border">
                <div className="bg-muted/50 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="h-5 bg-muted/50 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const SettingsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings Menu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array(5).fill(null).map((_, i) => (
                  <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array(3).fill(null).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
                    <div className="h-10 bg-muted/50 rounded animate-pulse" />
                  </div>
                ))}
                <div className="pt-4">
                  <Button disabled>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const ReportsPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg h-6 bg-muted/50 rounded animate-pulse w-32" />
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted/50 rounded-lg flex items-center justify-center">
                <Receipt className="h-12 w-12 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-muted/50 rounded animate-pulse w-1/2" />
            <div className="space-y-2">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="h-4 bg-muted/50 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <Button disabled>Download Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const InvoicePlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoice</h1>
        <Button disabled>Print Invoice</Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Invoice #12345</h3>
              <div className="h-4 bg-muted/50 rounded animate-pulse w-32 mt-2" />
            </div>
            <div className="text-right">
              <div className="h-4 bg-muted/50 rounded animate-pulse w-24 mb-2" />
              <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-medium mb-2">Bill To:</h4>
              <div className="space-y-1">
                <div className="h-4 bg-muted/50 rounded animate-pulse w-40" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-64" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Ship To:</h4>
              <div className="space-y-1">
                <div className="h-4 bg-muted/50 rounded animate-pulse w-40" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-64" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
              </div>
            </div>
          </div>
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Item</th>
                <th className="text-left pb-2">Quantity</th>
                <th className="text-left pb-2">Unit Price</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array(3).fill(null).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
                  </td>
                  <td className="py-2">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-16" />
                  </td>
                  <td className="py-2">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-16" />
                  </td>
                  <td className="py-2 text-right">
                    <div className="h-4 bg-muted/50 rounded animate-pulse w-20 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-20" />
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (5%):</span>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-16" />
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <div className="h-6 bg-muted/50 rounded animate-pulse w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
