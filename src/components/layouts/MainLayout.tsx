
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Bell,
  Calendar,
  Home,
  LogOut, 
  Menu, 
  Package,
  Receipt,
  Settings, 
  ShoppingBag, 
  User, 
  X 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getMyNotifications } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifications = getMyNotifications().filter(n => !n.isRead).length;

  useEffect(() => {
    // Close the mobile menu when route changes
    setOpen(false);
  }, [location.pathname]);

  const farmerNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'My Products', path: '/farmer/products', icon: ShoppingBag },
    { name: 'My Auctions', path: '/farmer/auctions', icon: Package },
    { name: 'Orders', path: '/orders', icon: Receipt },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const traderNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/trader/products', icon: ShoppingBag },
    { name: 'Auctions', path: '/trader/auctions', icon: Package },
    { name: 'My Orders', path: '/orders', icon: Receipt },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = user?.role === 'farmer' ? farmerNavItems : traderNavItems;

  const onLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-card md:block md:w-64 lg:w-72">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <ShoppingBag className="h-6 w-6 text-mandi-green" />
              <span className="text-xl">Mandi Connect</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 py-2">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "flex w-full items-center gap-3 justify-start px-3 py-5 text-base",
                    location.pathname === item.path &&
                      "bg-primary/10 font-medium text-primary"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="flex w-full items-center gap-3 justify-start px-3 py-5 text-base text-red-500 hover:text-red-600"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <div className="font-medium">{user.name}</div>
                <div className="overflow-hidden text-ellipsis text-xs text-muted-foreground">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header and Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5 text-mandi-green" />
            <span>Mandi Connect</span>
          </div>
          {unreadNotifications > 0 && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="ml-auto relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              >
                {unreadNotifications}
              </Badge>
            </Button>
          )}
        </header>

        {/* Mobile Sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0">
            <div className="flex items-center border-b p-4">
              <ShoppingBag className="h-6 w-6 text-mandi-green" />
              <span className="ml-2 text-lg font-semibold">Mandi Connect</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-64px)]">
              <div className="px-2 py-2">
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center gap-3 justify-start px-3 py-6 text-base",
                      location.pathname === item.path &&
                        "bg-primary/10 font-medium text-primary"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="flex w-full items-center gap-3 justify-start px-3 py-6 text-base text-red-500 hover:text-red-600"
                  onClick={onLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
