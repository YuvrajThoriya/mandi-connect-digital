
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Notifications() {
  const navigate = useNavigate();
  const { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, isLoading } = useData();
  
  // Get all notifications for the current user
  const notifications = getMyNotifications();
  
  // Group notifications by date
  type GroupedNotifications = {
    [key: string]: typeof notifications;
  };
  
  const groupedNotifications: GroupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString('en-IN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as GroupedNotifications);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return 'Today';
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      toast.success("All notifications marked as read");
    }
  };
  
  // Handle notification click
  const handleNotificationClick = async (notificationId: string, link?: string) => {
    await markNotificationAsRead(notificationId);
    
    if (link) {
      navigate(link);
    }
  };
  
  return (
    <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest activities
            </p>
          </div>
          
          {notifications.some(n => !n.isRead) && (
            <Button 
              className="mt-4 md:mt-0" 
              variant="outline"
              onClick={handleMarkAllAsRead}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>
        
        {Object.keys(groupedNotifications).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <Card key={date}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {dateNotifications.map((notification, i) => (
                      <div key={notification.id}>
                        {i > 0 && <Separator className="my-3" />}
                        <div 
                          className={`p-3 -mx-3 rounded-md flex items-start gap-4 cursor-pointer transition-colors ${
                            notification.isRead 
                              ? 'hover:bg-muted/40' 
                              : 'bg-primary/5 hover:bg-primary/10'
                          }`}
                          onClick={() => handleNotificationClick(notification.id, notification.link)}
                        >
                          <div className={`rounded-full p-2 ${getNotificationBgColor(notification.type)}`}>
                            <Bell className={`h-5 w-5 ${getNotificationIconColor(notification.type)}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium flex items-center gap-2">
                                {notification.title}
                                {!notification.isRead && (
                                  <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(notification.createdAt)}
                              </div>
                            </div>
                            <p className="text-sm mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any notifications at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </MainLayout>
    </AuthGuard>
  );
}

// Helper functions for notification styling
function getNotificationBgColor(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'error':
      return 'bg-destructive/10';
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'info':
    default:
      return 'bg-primary/10';
  }
}

function getNotificationIconColor(type: string): string {
  switch (type) {
    case 'success':
      return 'text-green-800 dark:text-green-400';
    case 'error':
      return 'text-destructive';
    case 'warning':
      return 'text-yellow-800 dark:text-yellow-400';
    case 'info':
    default:
      return 'text-primary';
  }
}
