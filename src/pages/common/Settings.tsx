
import { useState } from "react";
import { Bell, Moon, Sun, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { user } = useAuth();
  
  // Theme settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    auctionAlerts: true,
    priceAlerts: true,
    orderUpdates: true,
    marketingEmails: false,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfileToPublic: true,
    showContactInfo: true,
    shareActivityData: false,
  });
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    
    // In a real app, this would toggle dark mode
    toast.info(`${darkMode ? 'Light' : 'Dark'} mode will be fully implemented in future updates`);
  };
  
  // Handle notification setting toggle
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
    
    toast.success("Notification preference updated");
  };
  
  // Handle privacy setting toggle
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
    
    toast.success("Privacy preference updated");
  };
  
  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success(`Language preference set to ${value}`);
  };
  
  return (
    <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
      <MainLayout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>
        
        <Tabs defaultValue="appearance">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64">
              <TabsList className="flex flex-col h-auto p-0 bg-transparent gap-1">
                <TabsTrigger 
                  value="appearance" 
                  className="justify-start w-full data-[state=active]:bg-muted"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Display
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start w-full data-[state=active]:bg-muted"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="justify-start w-full data-[state=active]:bg-muted"
                >
                  <User className="h-4 w-4 mr-2" />
                  Privacy & Security
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1">
              {/* Display Settings */}
              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>
                      Control how the Mandi Connect app looks on your device
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="theme-mode">Dark Mode</Label>
                        <div className="text-sm text-muted-foreground">
                          Switch between light and dark themes
                        </div>
                      </div>
                      <Switch 
                        id="theme-mode" 
                        checked={darkMode} 
                        onCheckedChange={handleThemeToggle}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="language-select">Language</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        Select your preferred language
                      </div>
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger id="language-select" className="w-full md:w-[240px]">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="marathi">Marathi</SelectItem>
                          <SelectItem value="gujarati">Gujarati</SelectItem>
                          <SelectItem value="punjabi">Punjabi</SelectItem>
                          <SelectItem value="bengali">Bengali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Control what you are notified about
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </div>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notificationSettings.emailNotifications} 
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </div>
                      </div>
                      <Switch 
                        id="sms-notifications" 
                        checked={notificationSettings.smsNotifications} 
                        onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                      />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="font-medium">Notification Categories</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auction-alerts">Auction Alerts</Label>
                        <div className="text-sm text-muted-foreground">
                          Get updates on bids and auction changes
                        </div>
                      </div>
                      <Switch 
                        id="auction-alerts" 
                        checked={notificationSettings.auctionAlerts} 
                        onCheckedChange={() => handleNotificationToggle('auctionAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="price-alerts">Price Alerts</Label>
                        <div className="text-sm text-muted-foreground">
                          Notifications about price changes in market
                        </div>
                      </div>
                      <Switch 
                        id="price-alerts" 
                        checked={notificationSettings.priceAlerts} 
                        onCheckedChange={() => handleNotificationToggle('priceAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="order-updates">Order Updates</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications about your orders
                        </div>
                      </div>
                      <Switch 
                        id="order-updates" 
                        checked={notificationSettings.orderUpdates} 
                        onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive emails about new features and special offers
                        </div>
                      </div>
                      <Switch 
                        id="marketing-emails" 
                        checked={notificationSettings.marketingEmails} 
                        onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Privacy Settings */}
              <TabsContent value="privacy" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage your privacy and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-profile">Public Profile</Label>
                        <div className="text-sm text-muted-foreground">
                          Allow others to view your profile information
                        </div>
                      </div>
                      <Switch 
                        id="show-profile" 
                        checked={privacySettings.showProfileToPublic} 
                        onCheckedChange={() => handlePrivacyToggle('showProfileToPublic')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-contact">Contact Information</Label>
                        <div className="text-sm text-muted-foreground">
                          Show your contact details to traders/farmers you interact with
                        </div>
                      </div>
                      <Switch 
                        id="show-contact" 
                        checked={privacySettings.showContactInfo} 
                        onCheckedChange={() => handlePrivacyToggle('showContactInfo')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="share-data">Data Sharing</Label>
                        <div className="text-sm text-muted-foreground">
                          Share your activity data to improve our services
                        </div>
                      </div>
                      <Switch 
                        id="share-data" 
                        checked={privacySettings.shareActivityData} 
                        onCheckedChange={() => handlePrivacyToggle('shareActivityData')}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Account Security</h3>
                      <Button
                        onClick={() => toast.info("Password change functionality will be implemented in future updates")}
                      >
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </MainLayout>
    </AuthGuard>
  );
}
