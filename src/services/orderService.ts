
import { supabase } from '@/integrations/supabase/client';
import { Order, CreateOrderDto, UpdateOrderDto } from '../types/order';

export const orderService = {
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
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
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        price: orderData.price,
        total_amount: totalAmount,
        trader_id: supabase.auth.getUser().then(res => res.data.user?.id) || '',
        farmer_id: productData.farmer_id,
        shipping_address: orderData.shipping_address || '',
        notes: orderData.notes || '',
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Order;
  },

  async getOrderById(id: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as Order;
  },

  async getFarmerOrders(farmerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Order[];
  },

  async getTraderOrders(traderId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('trader_id', traderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as Order[];
  },

  async updateOrder(id: string, updates: UpdateOrderDto): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Order;
  },

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Order;
  },

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Order;
  }
};
