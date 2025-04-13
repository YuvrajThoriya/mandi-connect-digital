
import { useState } from "react";
import {
  Building, 
  CreditCard, 
  Edit, 
  Mail, 
  MapPin, 
  Phone, 
  Save, 
  Upload, 
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  
  // In a real app, these would be set from the user object and would be editable
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    address: 'Village Sundarpur, Patna, Bihar',
    accountNumber: 'XXXX XXXX XXXX 4567',
    bankName: 'State Bank of India',
    ifsc: 'SBIN0001234',
    gstin: user?.role === 'trader' ? '29GGGGG1314R9Z6' : '',
    aadharNumber: user?.role === 'farmer' ? '1234 5678 9012' : '',
    panNumber: 'ABCDE1234F',
  });
  
  // Handle profile image change
  const handleProfileImageChange = () => {
    // In a real app, this would handle file upload
    toast.info("Profile image upload will be implemented with backend integration");
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to the database
    toast.success("Profile updated successfully");
    setEditMode(false);
  };
  
  return (
    <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
      <MainLayout>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              View and edit your personal information
            </p>
          </div>
          <Button 
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? "outline" : "default"}
          >
            {editMode ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="text-4xl">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {editMode && (
                  <div 
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow-sm"
                    onClick={handleProfileImageChange}
                  >
                    <Upload className="h-5 w-5" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <div className="capitalize text-muted-foreground mb-2">
                {user?.role}
              </div>
              
              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Details Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="financial">Financial Details</TabsTrigger>
              </TabsList>
              
              {/* Personal Details Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          {editMode ? (
                            <Input 
                              id="name" 
                              value={profileData.name} 
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          {editMode ? (
                            <Input 
                              id="email" 
                              type="email" 
                              value={profileData.email} 
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          {editMode ? (
                            <Input 
                              id="phone" 
                              value={profileData.phone} 
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          {editMode ? (
                            <Input 
                              id="address" 
                              value={profileData.address} 
                              onChange={(e) => setProfileData({...profileData, address: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {user?.role === 'farmer' && (
                        <div className="space-y-2">
                          <Label htmlFor="aadharNumber">Aadhaar Number</Label>
                          {editMode ? (
                            <Input 
                              id="aadharNumber" 
                              value={profileData.aadharNumber} 
                              onChange={(e) => setProfileData({...profileData, aadharNumber: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.aadharNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {user?.role === 'trader' && (
                        <div className="space-y-2">
                          <Label htmlFor="gstin">GSTIN</Label>
                          {editMode ? (
                            <Input 
                              id="gstin" 
                              value={profileData.gstin} 
                              onChange={(e) => setProfileData({...profileData, gstin: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.gstin}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {editMode && (
                        <div className="flex justify-end">
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Financial Details Tab */}
              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>
                      Your bank details and financial information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Bank Account Number</Label>
                        {editMode ? (
                          <Input 
                            id="accountNumber" 
                            value={profileData.accountNumber} 
                            onChange={(e) => setProfileData({...profileData, accountNumber: e.target.value})} 
                          />
                        ) : (
                          <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{profileData.accountNumber}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          {editMode ? (
                            <Input 
                              id="bankName" 
                              value={profileData.bankName} 
                              onChange={(e) => setProfileData({...profileData, bankName: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>{profileData.bankName}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ifsc">IFSC Code</Label>
                          {editMode ? (
                            <Input 
                              id="ifsc" 
                              value={profileData.ifsc} 
                              onChange={(e) => setProfileData({...profileData, ifsc: e.target.value})} 
                            />
                          ) : (
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                              <span>{profileData.ifsc}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        {editMode ? (
                          <Input 
                            id="panNumber" 
                            value={profileData.panNumber} 
                            onChange={(e) => setProfileData({...profileData, panNumber: e.target.value})} 
                          />
                        ) : (
                          <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/40">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{profileData.panNumber}</span>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div className="text-sm text-muted-foreground">
                        Your financial information is secure and only used for transactions related to your sales or purchases.
                      </div>
                      
                      {editMode && (
                        <div className="flex justify-end">
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
