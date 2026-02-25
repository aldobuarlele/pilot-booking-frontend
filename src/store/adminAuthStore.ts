import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface AdminAuthState {
  adminToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  adminToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/admin/login', {
        username,
        password,
      });
      
      const token = response.data.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', token);
      }
      
      set({ adminToken: token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      console.error('Admin login failed:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    set({ adminToken: null, isAuthenticated: false });
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        set({ adminToken: token, isAuthenticated: true });
      }
    }
  }
}));