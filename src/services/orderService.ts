
import { supabase } from '@/integrations/supabase/client';
import { Order, CreateOrderDto, UpdateOrderDto } from '../types/order';

export const orderService = {
  async createOrder(orderData: CreateOrderDto): Promise<Order | null> {
    try {
      // Calculate total amount
      const totalAmount = orderData.quantity * orderData.price;
      
      // Get the farmer_id from the product
      const { data: productData } = await supabase
        .from('products')
        .select('farmer_id')
        .eq('id', orderData.product_id)
        .single();
      
      if (!productData?.farmer_id) {
        throw new Error('Product not found');
      }
      
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data.user?.id || '';
      
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .insert({
          product_id: orderData.product_id,
          quantity: orderData.quantity,
          price: orderData.price,
          total_amount: totalAmount,
          trader_id: userId,
          farmer_id: productData.farmer_id,
          shipping_address: orderData.shipping_address || '',
          notes: orderData.notes || '',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error("Error getting order:", error);
      return null;
    }
  },

  async getFarmerOrders(farmerId: string): Promise<Order[]> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error("Error getting farmer orders:", error);
      return [];
    }
  },

  async getTraderOrders(traderId: string): Promise<Order[]> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .select('*')
        .eq('trader_id', traderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error("Error getting trader orders:", error);
      return [];
    }
  },

  async updateOrder(id: string, updates: UpdateOrderDto): Promise<Order | null> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error("Error updating order:", error);
      return null;
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { error } = await supabase.from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order | null> {
    try {
      // @ts-ignore - We're intentionally allowing dynamic table operations
      const { data, error } = await supabase.from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } catch (error) {
      console.error("Error updating payment status:", error);
      return null;
    }
  }
};
