
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  expectedPrice: number;
  images: string[];
  description: string;
  grade?: 'A' | 'B' | 'C';
  createdAt: string;
  status: 'draft' | 'pending' | 'auction' | 'sold' | 'canceled';
  location: string;
}

export interface Auction {
  id: string;
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  startPrice: number;
  currentBid: number;
  minIncrement: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed' | 'canceled';
  bids: Bid[];
  winnerId?: string;
  winnerName?: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  traderId: string;
  traderName: string;
  amount: number;
  timestamp: string;
  isAutoBid: boolean;
  maxAutoBidAmount?: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  auctionId: string;
  farmerId: string;
  farmerName: string;
  traderId: string;
  traderName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'canceled';
  paymentMethod?: string;
  paymentId?: string;
  createdAt: string;
  shippingAddress?: string;
  trackingInfo?: string;
  deliveryDate?: string;
  feedback?: {
    farmerRating?: number;
    farmerComment?: string;
    traderRating?: number;
    traderComment?: string;
  };
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  farmerId?: string;
  farmerName?: string;
  traderId?: string;
  traderName?: string;
  location?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  createdAt: string;
  createdBy: string;
  type: 'inspection' | 'meeting' | 'delivery' | 'other';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
  link?: string;
}

interface DataContextType {
  products: Product[];
  auctions: Auction[];
  orders: Order[];
  appointments: Appointment[];
  notifications: Notification[];
  getMyProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getMyAuctions: () => Auction[];
  getActiveAuctions: () => Auction[];
  getAuctionById: (id: string) => Auction | undefined;
  createAuction: (productId: string, auction: { 
    startPrice: number, 
    minIncrement: number, 
    duration: number 
  }) => Promise<Auction>;
  placeBid: (auctionId: string, amount: number, isAutoBid?: boolean, maxAutoBidAmount?: number) => Promise<boolean>;
  getMyOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingInfo?: string) => Promise<boolean>;
  generateInvoice: (orderId: string) => string;
  getMyAppointments: () => Appointment[];
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'createdBy'>) => Promise<Appointment>;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => Promise<boolean>;
  getMyNotifications: () => Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  isLoading: boolean;
}

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    name: 'Premium Basmati Rice',
    category: 'Grains',
    variety: 'Basmati',
    quantity: 500,
    unit: 'kg',
    price: 75,
    expectedPrice: 80,
    images: ['/assets/rice.jpg'],
    description: 'High-quality basmati rice, newly harvested.',
    grade: 'A',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'auction',
    location: 'Patna, Bihar'
  },
  {
    id: '2',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    name: 'Organic Wheat',
    category: 'Grains',
    variety: 'Sharbati',
    quantity: 1000,
    unit: 'kg',
    price: 30,
    expectedPrice: 32,
    images: ['/assets/wheat.jpg'],
    description: 'Organically grown wheat, no pesticides used.',
    grade: 'B',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'pending',
    location: 'Patna, Bihar'
  },
  {
    id: '3',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    variety: 'Roma',
    quantity: 200,
    unit: 'kg',
    price: 40,
    expectedPrice: 45,
    images: ['/assets/tomatoes.jpg'],
    description: 'Fresh, ripe tomatoes ready for market.',
    grade: 'A',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'sold',
    location: 'Patna, Bihar'
  },
  {
    id: '4',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    name: 'Red Potatoes',
    category: 'Vegetables',
    variety: 'Red',
    quantity: 300,
    unit: 'kg',
    price: 25,
    expectedPrice: 28,
    images: ['/assets/potatoes.jpg'],
    description: 'Premium quality red potatoes.',
    grade: 'B',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'auction',
    location: 'Patna, Bihar'
  }
];

const MOCK_AUCTIONS: Auction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Premium Basmati Rice',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    startPrice: 75,
    currentBid: 78,
    minIncrement: 1,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'active',
    bids: [
      {
        id: '1',
        auctionId: '1',
        traderId: '2',
        traderName: 'Vikram Singh',
        amount: 76,
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        isAutoBid: false
      },
      {
        id: '2',
        auctionId: '1',
        traderId: '2',
        traderName: 'Vikram Singh',
        amount: 78,
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        isAutoBid: false
      }
    ]
  },
  {
    id: '2',
    productId: '4',
    productName: 'Red Potatoes',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    startPrice: 25,
    currentBid: 27,
    minIncrement: 0.5,
    startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    endTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'active',
    bids: [
      {
        id: '3',
        auctionId: '2',
        traderId: '2',
        traderName: 'Vikram Singh',
        amount: 25.5,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isAutoBid: false
      },
      {
        id: '4',
        auctionId: '2',
        traderId: '2',
        traderName: 'Vikram Singh',
        amount: 27,
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        isAutoBid: false
      }
    ]
  },
  {
    id: '3',
    productId: '3',
    productName: 'Fresh Tomatoes',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    startPrice: 40,
    currentBid: 45,
    minIncrement: 1,
    startTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    endTime: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    bids: [
      {
        id: '5',
        auctionId: '3',
        traderId: '2',
        traderName: 'Vikram Singh',
        amount: 42,
        timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(),
        isAutoBid: false
      },
      {
        id: '6',
        auctionId: '3',
        traderId: '2',
        traderName: 'Vikram Singh',
        amount: 45,
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        isAutoBid: false
      }
    ],
    winnerId: '2',
    winnerName: 'Vikram Singh'
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    productId: '3',
    productName: 'Fresh Tomatoes',
    auctionId: '3',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    traderId: '2',
    traderName: 'Vikram Singh',
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 45,
    totalAmount: 9000,
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentId: 'PAY1234567',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    shippingAddress: 'Plot 123, APMC Market, Mumbai',
    trackingInfo: 'Dispatched from Patna warehouse, estimated delivery in 2 days',
    feedback: {
      farmerRating: 5,
      farmerComment: 'Great quality!',
    }
  }
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Wheat Inspection',
    description: 'Inspection of the new wheat harvest before listing',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '10:00',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    location: 'Farm at Village Sundarpur',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'admin',
    type: 'inspection'
  },
  {
    id: '2',
    title: 'Rice Delivery',
    description: 'Delivery of rice order to Mumbai market',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    time: '14:00',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    traderId: '2',
    traderName: 'Vikram Singh',
    location: 'APMC Market, Mumbai',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: '1', // Farmer created
    type: 'delivery'
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'New Bid Received',
    message: 'You have received a new bid of ₹78 for your Premium Basmati Rice auction.',
    type: 'success',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    isRead: false,
    link: '/auctions/1'
  },
  {
    id: '2',
    userId: '1',
    title: 'Product Approved',
    message: 'Your product "Organic Wheat" has been approved for auction.',
    type: 'info',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    link: '/products/2'
  },
  {
    id: '3',
    userId: '2',
    title: 'Auction Ended',
    message: 'Congratulations! You won the auction for Fresh Tomatoes.',
    type: 'success',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
    link: '/auctions/3'
  },
  {
    id: '4',
    userId: '2',
    title: 'Payment Confirmation',
    message: 'Your payment of ₹9000 for Fresh Tomatoes has been received.',
    type: 'info',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    isRead: true,
    link: '/orders/1'
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [auctions, setAuctions] = useState<Auction[]>(MOCK_AUCTIONS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Get products that belong to the current farmer
  const getMyProducts = () => {
    if (!user) return [];
    if (user.role === 'farmer') {
      return products.filter(product => product.farmerId === user.id);
    } else if (user.role === 'trader' || user.role === 'admin') {
      return products;
    }
    return [];
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const addProduct = async (
    productData: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'createdAt'>
  ): Promise<Product> => {
    if (!user || user.role !== 'farmer') {
      throw new Error('Only farmers can add products');
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const newProduct: Product = {
        ...productData,
        id: `${products.length + 1}`,
        farmerId: user.id,
        farmerName: user.name,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      
      setProducts(prevProducts => [...prevProducts, newProduct]);
      toast.success('Product added successfully! Waiting for approval.');
      
      // Add notification for admin
      const newNotification: Notification = {
        id: `${notifications.length + 1}`,
        userId: '3', // Admin ID
        title: 'New Product Added',
        message: `${user.name} added a new product: ${newProduct.name}`,
        type: 'info',
        createdAt: new Date().toISOString(),
        isRead: false,
        link: `/admin/products/${newProduct.id}`
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      return newProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const productIndex = products.findIndex(product => product.id === id);
      
      if (productIndex === -1) {
        toast.error('Product not found');
        return false;
      }
      
      // If user is a farmer, check ownership
      if (user.role === 'farmer' && products[productIndex].farmerId !== user.id) {
        toast.error('You can only update your own products');
        return false;
      }
      
      const updatedProducts = [...products];
      updatedProducts[productIndex] = { ...updatedProducts[productIndex], ...updates };
      
      setProducts(updatedProducts);
      toast.success('Product updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    try {
      const product = products.find(p => p.id === id);
      
      if (!product) {
        toast.error('Product not found');
        return false;
      }
      
      // If user is a farmer, check ownership
      if (user.role === 'farmer' && product.farmerId !== user.id) {
        toast.error('You can only delete your own products');
        return false;
      }
      
      // Check if the product is in an auction
      if (product.status === 'auction') {
        toast.error('Cannot delete a product that is currently in auction');
        return false;
      }
      
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getMyAuctions = () => {
    if (!user) return [];
    
    if (user.role === 'farmer') {
      return auctions.filter(auction => auction.farmerId === user.id);
    } else if (user.role === 'trader') {
      // Get auctions where trader has placed a bid
      return auctions.filter(auction => 
        auction.bids.some(bid => bid.traderId === user.id)
      );
    } else if (user.role === 'admin') {
      return auctions;
    }
    
    return [];
  };

  const getActiveAuctions = () => {
    return auctions.filter(auction => auction.status === 'active' || auction.status === 'upcoming');
  };

  const getAuctionById = (id: string) => {
    return auctions.find(auction => auction.id === id);
  };

  const createAuction = async (
    productId: string,
    auctionData: { startPrice: number, minIncrement: number, duration: number }
  ): Promise<Auction> => {
    if (!user || (user.role !== 'farmer' && user.role !== 'admin')) {
      throw new Error('Only farmers or admins can create auctions');
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (user.role === 'farmer' && product.farmerId !== user.id) {
        throw new Error('You can only create auctions for your own products');
      }
      
      if (product.status === 'auction' || product.status === 'sold') {
        throw new Error('This product is already in auction or sold');
      }
      
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + auctionData.duration * 60 * 60 * 1000);
      
      const newAuction: Auction = {
        id: `${auctions.length + 1}`,
        productId: product.id,
        productName: product.name,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        startPrice: auctionData.startPrice,
        currentBid: auctionData.startPrice,
        minIncrement: auctionData.minIncrement,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'active',
        bids: []
      };
      
      setAuctions(prev => [...prev, newAuction]);
      
      // Update product status
      await updateProduct(productId, { status: 'auction' });
      
      toast.success('Auction created successfully!');
      
      // Create notification for traders
      const newNotification: Notification = {
        id: `${notifications.length + 1}`,
        userId: '2', // For traders - in a real app, would notify all traders
        title: 'New Auction Available',
        message: `New auction for ${product.name} started!`,
        type: 'info',
        createdAt: new Date().toISOString(),
        isRead: false,
        link: `/auctions/${newAuction.id}`
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      return newAuction;
    } catch (error) {
      console.error('Failed to create auction:', error);
      toast.error(`Failed to create auction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const placeBid = async (
    auctionId: string,
    amount: number,
    isAutoBid: boolean = false,
    maxAutoBidAmount?: number
  ): Promise<boolean> => {
    if (!user || user.role !== 'trader') {
      toast.error('Only traders can place bids');
      return false;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const auctionIndex = auctions.findIndex(a => a.id === auctionId);
      
      if (auctionIndex === -1) {
        toast.error('Auction not found');
        return false;
      }
      
      const auction = auctions[auctionIndex];
      
      if (auction.status !== 'active') {
        toast.error('This auction is not active');
        return false;
      }
      
      if (new Date(auction.endTime) < new Date()) {
        toast.error('This auction has ended');
        
        // Update auction status if it's ended
        const updatedAuctions = [...auctions];
        updatedAuctions[auctionIndex] = { ...auction, status: 'completed' };
        setAuctions(updatedAuctions);
        
        return false;
      }
      
      if (amount <= auction.currentBid) {
        toast.error(`Bid must be higher than current bid (₹${auction.currentBid})`);
        return false;
      }
      
      if ((amount - auction.currentBid) < auction.minIncrement) {
        toast.error(`Minimum bid increment is ₹${auction.minIncrement}`);
        return false;
      }
      
      const newBid: Bid = {
        id: `${auction.bids.length + 1}`,
        auctionId,
        traderId: user.id,
        traderName: user.name,
        amount,
        timestamp: new Date().toISOString(),
        isAutoBid,
        ...(isAutoBid && { maxAutoBidAmount })
      };
      
      // Update auction
      const updatedAuctions = [...auctions];
      updatedAuctions[auctionIndex] = {
        ...auction,
        currentBid: amount,
        bids: [...auction.bids, newBid]
      };
      
      setAuctions(updatedAuctions);
      
      toast.success(`Bid of ₹${amount} placed successfully!`);
      
      // Create notification for farmer
      const notificationToFarmer: Notification = {
        id: `${notifications.length + 1}`,
        userId: auction.farmerId,
        title: 'New Bid Received',
        message: `You have received a new bid of ₹${amount} for your ${auction.productName} auction.`,
        type: 'success',
        createdAt: new Date().toISOString(),
        isRead: false,
        link: `/auctions/${auctionId}`
      };
      
      setNotifications(prev => [...prev, notificationToFarmer]);
      
      // Create notifications for other traders who bid on this auction
      const otherTraderIds = [...new Set(
        auction.bids
          .filter(bid => bid.traderId !== user.id)
          .map(bid => bid.traderId)
      )];
      
      otherTraderIds.forEach(traderId => {
        const outbidNotification: Notification = {
          id: `${notifications.length + 1 + otherTraderIds.indexOf(traderId)}`,
          userId: traderId,
          title: 'You have been outbid',
          message: `Someone has outbid you on the auction for ${auction.productName}.`,
          type: 'warning',
          createdAt: new Date().toISOString(),
          isRead: false,
          link: `/auctions/${auctionId}`
        };
        
        setNotifications(prev => [...prev, outbidNotification]);
      });
      
      return true;
    } catch (error) {
      console.error('Failed to place bid:', error);
      toast.error('Failed to place bid');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getMyOrders = () => {
    if (!user) return [];
    
    if (user.role === 'farmer') {
      return orders.filter(order => order.farmerId === user.id);
    } else if (user.role === 'trader') {
      return orders.filter(order => order.traderId === user.id);
    } else if (user.role === 'admin') {
      return orders;
    }
    
    return [];
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    trackingInfo?: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    try {
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) {
        toast.error('Order not found');
        return false;
      }
      
      const order = orders[orderIndex];
      
      // Check permissions
      if (user.role === 'farmer' && order.farmerId !== user.id) {
        toast.error('You can only update your own orders');
        return false;
      }
      
      if (user.role === 'trader' && order.traderId !== user.id) {
        toast.error('You can only update your own orders');
        return false;
      }
      
      // Update order
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = { 
        ...order, 
        status,
        ...(trackingInfo && { trackingInfo })
      };
      
      setOrders(updatedOrders);
      
      toast.success(`Order status updated to ${status}`);
      
      // Create notification
      const recipientId = user.role === 'farmer' ? order.traderId : order.farmerId;
      const senderName = user.name;
      
      const newNotification: Notification = {
        id: `${notifications.length + 1}`,
        userId: recipientId,
        title: 'Order Status Updated',
        message: `${senderName} has updated the order status to ${status}`,
        type: 'info',
        createdAt: new Date().toISOString(),
        isRead: false,
        link: `/orders/${orderId}`
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const generateInvoice = (orderId: string): string => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      toast.error('Order not found');
      return '';
    }
    
    // In a real app, this would generate a PDF or similar
    // For our mock, return a URL to a mock invoice
    return `/invoices/${orderId}`;
  };

  const getMyAppointments = () => {
    if (!user) return [];
    
    if (user.role === 'farmer') {
      return appointments.filter(apt => apt.farmerId === user.id);
    } else if (user.role === 'trader') {
      return appointments.filter(apt => apt.traderId === user.id);
    } else if (user.role === 'admin') {
      return appointments;
    }
    
    return [];
  };

  const createAppointment = async (
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<Appointment> => {
    if (!user) {
      throw new Error('You must be logged in to create an appointment');
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `${appointments.length + 1}`,
        createdAt: new Date().toISOString(),
        createdBy: user.id
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      
      toast.success('Appointment created successfully!');
      
      // Create notifications
      if (user.role === 'farmer' && appointmentData.traderId) {
        const notificationToTrader: Notification = {
          id: `${notifications.length + 1}`,
          userId: appointmentData.traderId,
          title: 'New Appointment Request',
          message: `${user.name} has requested an appointment: ${appointmentData.title}`,
          type: 'info',
          createdAt: new Date().toISOString(),
          isRead: false,
          link: `/appointments/${newAppointment.id}`
        };
        
        setNotifications(prev => [...prev, notificationToTrader]);
      } else if (user.role === 'trader' && appointmentData.farmerId) {
        const notificationToFarmer: Notification = {
          id: `${notifications.length + 1}`,
          userId: appointmentData.farmerId,
          title: 'New Appointment Request',
          message: `${user.name} has requested an appointment: ${appointmentData.title}`,
          type: 'info',
          createdAt: new Date().toISOString(),
          isRead: false,
          link: `/appointments/${newAppointment.id}`
        };
        
        setNotifications(prev => [...prev, notificationToFarmer]);
      }
      
      return newAppointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      toast.error('Failed to create appointment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: Appointment['status']
  ): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
      
      if (appointmentIndex === -1) {
        toast.error('Appointment not found');
        return false;
      }
      
      const appointment = appointments[appointmentIndex];
      
      // Check permissions
      if (user.role === 'farmer' && appointment.farmerId !== user.id) {
        toast.error('You can only update your own appointments');
        return false;
      }
      
      if (user.role === 'trader' && appointment.traderId !== user.id) {
        toast.error('You can only update your own appointments');
        return false;
      }
      
      // Update appointment
      const updatedAppointments = [...appointments];
      updatedAppointments[appointmentIndex] = { ...appointment, status };
      
      setAppointments(updatedAppointments);
      
      toast.success(`Appointment status updated to ${status}`);
      
      // Create notification
      const recipientId = 
        user.role === 'farmer' 
          ? appointment.traderId 
          : appointment.farmerId;
      
      if (recipientId) {
        const newNotification: Notification = {
          id: `${notifications.length + 1}`,
          userId: recipientId,
          title: 'Appointment Status Updated',
          message: `${user.name} has ${status === 'confirmed' ? 'confirmed' : status} the appointment: ${appointment.title}`,
          type: status === 'confirmed' ? 'success' : status === 'canceled' ? 'warning' : 'info',
          createdAt: new Date().toISOString(),
          isRead: false,
          link: `/appointments/${appointmentId}`
        };
        
        setNotifications(prev => [...prev, newNotification]);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      toast.error('Failed to update appointment status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getMyNotifications = () => {
    if (!user) return [];
    
    return notifications.filter(notification => notification.userId === user.id);
  };

  const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
    if (!user) return false;
    
    const notificationIndex = notifications.findIndex(n => n.id === notificationId && n.userId === user.id);
    
    if (notificationIndex === -1) return false;
    
    const updatedNotifications = [...notifications];
    updatedNotifications[notificationIndex] = {
      ...updatedNotifications[notificationIndex],
      isRead: true
    };
    
    setNotifications(updatedNotifications);
    return true;
  };

  const markAllNotificationsAsRead = async (): Promise<boolean> => {
    if (!user) return false;
    
    const updatedNotifications = notifications.map(notification => 
      notification.userId === user.id
        ? { ...notification, isRead: true }
        : notification
    );
    
    setNotifications(updatedNotifications);
    toast.success('All notifications marked as read');
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        products,
        auctions,
        orders,
        appointments,
        notifications,
        getMyProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getMyAuctions,
        getActiveAuctions,
        getAuctionById,
        createAuction,
        placeBid,
        getMyOrders,
        getOrderById,
        updateOrderStatus,
        generateInvoice,
        getMyAppointments,
        createAppointment,
        updateAppointmentStatus,
        getMyNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
