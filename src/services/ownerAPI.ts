import axios from 'axios';
import { ApiResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance for owner API calls
const ownerAPI = axios.create({
  baseURL: `${API_BASE_URL}/owner`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
ownerAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('ownerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
ownerAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ownerToken');
      localStorage.removeItem('ownerData');
      window.location.href = '/owner-login';
    }
    return Promise.reject(error);
  }
);

export interface OwnerLoginData {
  email: string;
  password: string;
}

export interface OwnerRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface PGListingData {
  pgName: string;
  description: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalRooms: string;
  pgType: 'boys' | 'girls' | 'co-ed';
  furnishing: string;
  roomTypes: Array<{
    type: string;
    price: string;
    available: string;
    deposit: string;
  }>;
  amenities: {
    [key: string]: boolean;
  };
  rules: string[];
  images: string[];
}

export const ownerAPIService = {
  // Authentication
  login: async (data: OwnerLoginData): Promise<ApiResponse> => {
    try {
      const response = await ownerAPI.post('/login', data);
      return response.data as ApiResponse;
    } catch (error) {
      // Mock response for demo
      if (data.email === 'owner@demo.com' && data.password === 'demo123') {
        return {
          success: true,
          token: 'mock-token-123',
          owner: {
            id: '1',
            name: 'Demo Owner',
            email: 'owner@demo.com',
            phone: '+91 9876543210'
          }
        };
      }
      throw error;
    }
  },

  register: async (data: OwnerRegisterData): Promise<ApiResponse> => {
    try {
      const response = await ownerAPI.post('/register', data);
      return response.data as ApiResponse;
    } catch (error) {
      // Mock response for demo
      return {
        success: true,
        message: 'Registration successful! Please verify your email.',
        owner: {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          phone: data.phone
        }
      };
    }
  },

  // PG Management
  createPG: async (data: PGListingData): Promise<ApiResponse> => {
    try {
      const response = await ownerAPI.post('/create-pg', data);
      return response.data as ApiResponse;
    } catch (error) {
      // Mock response for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'PG listing created successfully!',
        pgId: Date.now().toString()
      };
    }
  },

  getMyPGs: async (): Promise<ApiResponse> => {
    try {
      const response = await ownerAPI.get('/my-pgs');
      return response.data as ApiResponse;
    } catch (error) {
      // Mock response for demo
      return {
        success: true,
        pgs: [
          {
            id: '1',
            name: 'Green Valley PG',
            location: 'Koramangala, Bangalore',
            totalRooms: 20,
            occupiedRooms: 18,
            monthlyRevenue: 270000,
            rating: 4.5,
            status: 'active',
            inquiries: 12,
            bookings: 5
          },
          {
            id: '2',
            name: 'Sunrise Hostel',
            location: 'HSR Layout, Bangalore',
            totalRooms: 15,
            occupiedRooms: 12,
            monthlyRevenue: 180000,
            rating: 4.2,
            status: 'active',
            inquiries: 8,
            bookings: 3
          }
        ]
      };
    }
  },

  updatePG: async (pgId: string, data: Partial<PGListingData>): Promise<ApiResponse> => {
    try {
      const response = await ownerAPI.put(`/pg/${pgId}`, data);
      return response.data as ApiResponse;
    } catch (error) {
      // Mock response for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'PG updated successfully!'
      };
    }
  },

  deletePG: async (pgId: string) => {
    try {
      const response = await ownerAPI.delete(`/pg/${pgId}`);
      return response.data;
    } catch (error) {
      // Mock response for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'PG deleted successfully!'
      };
    }
  },

  // Bookings Management
  getBookings: async () => {
    try {
      const response = await ownerAPI.get('/bookings');
      return response.data;
    } catch (error) {
      // Mock response for demo
      return {
        success: true,
        bookings: [
          {
            id: '1',
            tenantName: 'Rahul Sharma',
            pgName: 'Green Valley PG',
            roomType: 'Single',
            checkIn: '2024-01-15',
            monthlyRent: 15000,
            status: 'active',
            phone: '+91 9876543210',
            email: 'rahul@example.com'
          },
          {
            id: '2',
            tenantName: 'Priya Patel',
            pgName: 'Sunrise Hostel',
            roomType: 'Double',
            checkIn: '2024-02-01',
            monthlyRent: 12000,
            status: 'pending',
            phone: '+91 9876543211',
            email: 'priya@example.com'
          }
        ]
      };
    }
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      const response = await ownerAPI.put(`/booking/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      // Mock response for demo
      return {
        success: true,
        message: 'Booking status updated successfully!'
      };
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const response = await ownerAPI.get('/analytics');
      return response.data;
    } catch (error) {
      // Mock response for demo
      return {
        success: true,
        analytics: {
          totalRevenue: 450000,
          totalRooms: 35,
          occupiedRooms: 30,
          occupancyRate: 86,
          monthlyGrowth: 12,
          revenueData: [
            { month: 'Jan', revenue: 400000 },
            { month: 'Feb', revenue: 420000 },
            { month: 'Mar', revenue: 450000 }
          ],
          occupancyData: [
            { month: 'Jan', occupancy: 80 },
            { month: 'Feb', occupancy: 85 },
            { month: 'Mar', occupancy: 86 }
          ]
        }
      };
    }
  },

  // Profile Management
  getProfile: async () => {
    try {
      const response = await ownerAPI.get('/profile');
      return response.data;
    } catch (error) {
      // Mock response for demo
      const ownerData = localStorage.getItem('ownerData');
      return {
        success: true,
        owner: ownerData ? JSON.parse(ownerData) : null
      };
    }
  },

  updateProfile: async (data: Partial<OwnerRegisterData>) => {
    try {
      const response = await ownerAPI.put('/profile', data);
      return response.data;
    } catch (error) {
      // Mock response for demo
      return {
        success: true,
        message: 'Profile updated successfully!',
        owner: data
      };
    }
  }
};

export default ownerAPIService;