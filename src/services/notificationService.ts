
import { safeTableOperation } from '@/utils/safeTableUtil';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface CreateNotificationDto {
  user_id: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  async createNotification(notification: CreateNotificationDto): Promise<Notification | null> {
    try {
      // Mock implementation until the table is created
      console.log("Creating notification:", notification);
      return null;

      /* Uncomment when notifications table is created
      // @ts-ignore - Using safeTableOperation for notifications
      const { data, error } = await safeTableOperation<Notification>('notifications')
        .insert({
          ...notification,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;
      return data as Notification;
      */
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      // Mock implementation until the table is created
      return [];
      
      /* Uncomment when notifications table is created
      // @ts-ignore - Using safeTableOperation for notifications
      const { data, error } = await safeTableOperation<Notification>('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Notification[];
      */
    } catch (error) {
      console.error("Error getting user notifications:", error);
      return [];
    }
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    try {
      // Mock implementation until the table is created
      return true;
      
      /* Uncomment when notifications table is created
      // @ts-ignore - Using safeTableOperation for notifications
      const { error } = await safeTableOperation('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return true;
      */
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  },

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      // Mock implementation until the table is created
      return true;
      
      /* Uncomment when notifications table is created
      // @ts-ignore - Using safeTableOperation for notifications
      const { error } = await safeTableOperation('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
      */
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  },

  async deleteNotification(id: string): Promise<boolean> {
    try {
      // Mock implementation until the table is created
      return true;
      
      /* Uncomment when notifications table is created
      // @ts-ignore - Using safeTableOperation for notifications
      const { error } = await safeTableOperation('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
      */
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }
};
