
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export type UserRole = 'farmer' | 'trader' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export interface FarmerProfile {
  aadhaarNumber?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  produceTypes?: string[];
}

export interface TraderProfile {
  gstinNumber?: string;
  businessLicenseNumber?: string;
  interestCategories?: string[];
}

interface AuthContextType {
  user: User | null;
  farmerProfile: FarmerProfile | null;
  traderProfile: TraderProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  updateFarmerProfile: (updates: Partial<FarmerProfile>) => Promise<boolean>;
  updateTraderProfile: (updates: Partial<TraderProfile>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for users
const MOCK_USERS = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'farmer@example.com',
    password: 'password123',
    role: 'farmer' as UserRole,
    isVerified: true,
    profileImage: '/assets/farmer-avatar.jpg',
    phone: '9876543210',
    address: 'Village Sundarpur, District Patna, Bihar'
  },
  {
    id: '2',
    name: 'Vikram Singh',
    email: 'trader@example.com',
    password: 'password123',
    role: 'trader' as UserRole,
    isVerified: true,
    profileImage: '/assets/trader-avatar.jpg',
    phone: '8765432109',
    address: 'Plot 123, APMC Market, Sector 19, Mumbai'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin' as UserRole,
    isVerified: true,
    profileImage: '/assets/admin-avatar.jpg'
  }
];

const MOCK_FARMER_PROFILES: Record<string, FarmerProfile> = {
  '1': {
    aadhaarNumber: '1234 5678 9012',
    bankDetails: {
      accountNumber: '12345678901234',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India'
    },
    produceTypes: ['Rice', 'Wheat', 'Vegetables']
  }
};

const MOCK_TRADER_PROFILES: Record<string, TraderProfile> = {
  '2': {
    gstinNumber: '22AAAAA0000A1Z5',
    businessLicenseNumber: 'TRADE12345',
    interestCategories: ['Grains', 'Vegetables', 'Fruits']
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [traderProfile, setTraderProfile] = useState<TraderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('mandiConnectUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        
        // Load profile data based on role
        if (parsedUser.role === 'farmer' && parsedUser.id in MOCK_FARMER_PROFILES) {
          setFarmerProfile(MOCK_FARMER_PROFILES[parsedUser.id]);
        } else if (parsedUser.role === 'trader' && parsedUser.id in MOCK_TRADER_PROFILES) {
          setTraderProfile(MOCK_TRADER_PROFILES[parsedUser.id]);
        }
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('mandiConnectUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        toast.error('Invalid email or password');
        return false;
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('mandiConnectUser', JSON.stringify(userWithoutPassword));
      
      // Load profile data based on role
      if (userWithoutPassword.role === 'farmer' && userWithoutPassword.id in MOCK_FARMER_PROFILES) {
        setFarmerProfile(MOCK_FARMER_PROFILES[userWithoutPassword.id]);
      } else if (userWithoutPassword.role === 'trader' && userWithoutPassword.id in MOCK_TRADER_PROFILES) {
        setTraderProfile(MOCK_TRADER_PROFILES[userWithoutPassword.id]);
      }
      
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Email already in use');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role,
        isVerified: false,
      };
      
      // Store user (in a real app, this would be in a database)
      // For our mock, we'll just set the current user
      setUser(newUser);
      localStorage.setItem('mandiConnectUser', JSON.stringify(newUser));
      
      // Initialize empty profile based on role
      if (role === 'farmer') {
        const emptyFarmerProfile: FarmerProfile = {
          produceTypes: []
        };
        setFarmerProfile(emptyFarmerProfile);
      } else if (role === 'trader') {
        const emptyTraderProfile: TraderProfile = {
          interestCategories: []
        };
        setTraderProfile(emptyTraderProfile);
      }
      
      toast.success('Account created successfully! Please complete your profile.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('mandiConnectUser', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFarmerProfile = async (updates: Partial<FarmerProfile>): Promise<boolean> => {
    if (!user || user.role !== 'farmer') return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const updatedProfile = { ...farmerProfile, ...updates };
      setFarmerProfile(updatedProfile);
      toast.success('Farmer profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update farmer profile error:', error);
      toast.error('Failed to update farmer profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTraderProfile = async (updates: Partial<TraderProfile>): Promise<boolean> => {
    if (!user || user.role !== 'trader') return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const updatedProfile = { ...traderProfile, ...updates };
      setTraderProfile(updatedProfile);
      toast.success('Trader profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update trader profile error:', error);
      toast.error('Failed to update trader profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setFarmerProfile(null);
    setTraderProfile(null);
    localStorage.removeItem('mandiConnectUser');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        traderProfile,
        isLoading,
        login,
        signup,
        updateProfile,
        updateFarmerProfile,
        updateTraderProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
