import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data as { user: any; token: string };
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data as { user: any; token: string };
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  googleLogin: async (credential: string) => {
    try {
      // Check if API is available using the connection handler
      if (window.connectionState && window.connectionState.api.available === false) {
        throw new Error('API_SERVER_DOWN');
      }
      
      // Use a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });
      
      const responsePromise = api.post('/auth/google', { credential });
      
      // Race between the request and the timeout
      const response = await Promise.race([responsePromise, timeoutPromise]) as any;
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      
      // Check for specific error types
      if (error.message === 'API_SERVER_DOWN' || 
          (error.message && error.message.includes('Network Error')) ||
          (error.message && error.message.includes('Failed to fetch'))) {
        // Update connection state if available
        if (window.connectionState) {
          window.connectionState.api.available = false;
          window.connectionState.api.error = error.message;
        }
      }
      
      // Parse the JWT token for fallback authentication
      try {
        const payload = JSON.parse(atob(credential.split('.')[1]));
        
        // Return a mock response for development
        return {
          data: {
            user: {
              id: payload.sub,
              name: payload.name,
              email: payload.email,
              role: 'user',
              phone: '',
              createdAt: new Date().toISOString()
            },
            token: 'google_' + Date.now(),
            fallback: true,
            error: error.message || 'Connection error'
          }
        };
      } catch (parseError) {
        console.error('Failed to parse Google credential:', parseError);
        throw error; // Re-throw the original error if we can't parse the credential
      }
    }
  },

  facebookLogin: async (data: any) => {
    const response = await api.post('/auth/facebook', data);
    return response;
  },
};

// PG API
export const pgAPI = {
  getAllPGs: async (filters?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    wifi?: boolean;
    food?: boolean;
    parking?: boolean;
    gym?: boolean;
    ac?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/pgs?${params.toString()}`);
    return response.data;
  },

  getPGById: async (id: string) => {
    const response = await api.get(`/pgs/${id}`);
    return response.data;
  },

  createPG: async (pgData: any) => {
    const response = await api.post('/pgs', pgData);
    return response.data;
  },

  updatePG: async (id: string, pgData: any) => {
    const response = await api.put(`/pgs/${id}`, pgData);
    return response.data;
  },

  deletePG: async (id: string) => {
    const response = await api.delete(`/pgs/${id}`);
    return response.data;
  },

  getPGReviews: async (id: string, page = 1, limit = 10) => {
    const response = await api.get(`/pgs/${id}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  },

  addReview: async (id: string, reviewData: { rating: number; comment: string }) => {
    const response = await api.post(`/pgs/${id}/reviews`, reviewData);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  createBooking: async (bookingData: {
    pgId: string;
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
    extraAmenities?: {[key: string]: number};
    totalAmount?: number;
  }) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await api.get(`/bookings?${params.toString()}`);
    const data = response.data as { bookings?: any[]; pagination?: any };
    return { 
      data: { 
        bookings: data.bookings || [], 
        pagination: data.pagination || {}
      } 
    };
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string, reason?: string) => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  getOwnerBookings: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await api.get(`/bookings/owner/dashboard?${params.toString()}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: { name?: string; phone?: string; avatar?: string }) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: async (bookingId: string) => {
    const response = await api.post('/payments/create-payment-intent', { bookingId });
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post('/payments/confirm-payment', { paymentIntentId });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllPGs: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await api.get(`/admin/pgs?${params.toString()}`);
    return response.data as { pgs: any[]; total: number; page: number; limit: number };
  },

  approvePG: async (id: string) => {
    const response = await api.put(`/admin/pgs/${id}/approve`);
    return response.data;
  },

  rejectPG: async (id: string, reason: string) => {
    const response = await api.put(`/admin/pgs/${id}/reject`, { reason });
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10, role?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (role) {
      params.append('role', role);
    }
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  getAllBookings: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await api.get(`/admin/bookings?${params.toString()}`);
    return response.data;
  },

  // Analytics endpoints
  getRevenueAnalytics: async () => {
    const response = await api.get('/admin/analytics/revenue');
    return response.data;
  },

  getUserGrowthAnalytics: async () => {
    const response = await api.get('/admin/analytics/users');
    return response.data;
  },

  getBookingAnalytics: async () => {
    const response = await api.get('/admin/analytics/bookings');
    return response.data;
  },

  // System management
  getSystemAlerts: async () => {
    const response = await api.get('/admin/system/alerts');
    return response.data;
  },

  resolveAlert: async (id: string) => {
    const response = await api.put(`/admin/system/alerts/${id}/resolve`);
    return response.data;
  },
};

export default api;
