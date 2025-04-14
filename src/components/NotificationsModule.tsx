
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  metadata?: any;
  created_at: string;
}

export const NotificationsModule = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!profile?.id) return;
    
    try {
      // Check if notifications table exists first
      const { count, error: checkError } = await supabase
        .from('notification_settings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id);

      if (checkError) {
        console.log('Notification settings table might not exist');
        return;
      }

      // Now try to fetch notifications
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.read).length || 0);
      } catch (error) {
        console.log('Notifications table might not exist yet');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: string) => {
    if (!profile?.id) return;
    
    try {
      if (id) {
        // Mark single notification as read
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
          
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      } else {
        // Mark all as read
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('user_id', profile.id)
          .eq('read', false);
          
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true }))
        );
      }
      
      setUnreadCount(0);
      
      toast({
        description: id ? "Notification marked as read" : "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
        
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (notifications.find(n => n.id === id)?.read === false) {
        setUnreadCount(prev => prev - 1);
      }
      
      toast({
        description: "Notification deleted",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for notifications
    if (profile?.id) {
      const channel = supabase.channel('notification-changes')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid':
        return 'Gavel';
      case 'order':
        return 'ShoppingCart';
      case 'payment':
        return 'CreditCard';
      case 'appointment':
        return 'Calendar';
      default:
        return 'Bell';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAsRead()}
              className="text-xs h-8"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notification => (
              <Card key={notification.id} className={`rounded-none border-x-0 border-t-0 ${!notification.read ? 'bg-muted/30' : ''}`}>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {notification.metadata && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => {
                                setOpen(false);
                                // Navigate based on notification type and metadata
                                // Example: navigate to order details, etc.
                              }}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex justify-center p-8">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
