import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid if it's not a Google token
        // and only if we're not in offline mode
        if (!storedToken.startsWith('google_')) {
          try {
            // Use Promise.race with timeout instead of AbortController
            try {
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), 3000);
              });
              
              const fetchPromise = fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/me`, {
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                  'Content-Type': 'application/json'
                }
              });
              
              const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
              
              if (!response.ok) {
                throw new Error('Token validation failed');
              }
              
            } catch (fetchError: any) {
              console.warn('Token validation error:', fetchError);
              // Only logout for non-network errors
              if (fetchError.message !== 'Request timeout' && 
                  fetchError.message !== 'Failed to fetch') {
                logout();
              }
            }
          } catch (error) {
            console.error('Error during token validation:', error);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Production login - use API only
      const response = await apiService.login({ email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Use Promise.race with timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Registration request timed out')), 5000);
      });
      
      const registerPromise = apiService.register(userData);
      
      const response = await Promise.race([registerPromise, timeoutPromise]) as any;
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    setUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};