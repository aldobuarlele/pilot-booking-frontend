import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface AdminState {
  bookings: any[];
  services: any[];
  fetchBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<boolean>;
  fetchServices: () => Promise<void>;
  saveService: (service: any, isEdit: boolean) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  updateConfig: (key: string, value: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  bookings: [],
  services: [],

  fetchBookings: async () => {
    try {
      const res = await apiClient.get('/admin/bookings');
      set({ bookings: res.data.data });
    } catch (error) { console.error('Error fetching bookings:', error); }
  },

  updateBookingStatus: async (id, status) => {
    try {
      await apiClient.put(`/admin/bookings/${id}/status`, { status });
      await get().fetchBookings(); 
      return true;
    } catch (error) { return false; }
  },

  fetchServices: async () => {
    try {
      const res = await apiClient.get('/admin/services');
      set({ services: res.data.data });
    } catch (error) { console.error('Error fetching services:', error); }
  },

  saveService: async (service, isEdit) => {
    try {
      const payload = { ...service };
      if (!payload.imageUrl || payload.imageUrl.trim() === '') {
        payload.imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
      }
      if (payload.basePrice <= 0) payload.basePrice = 1000;

      if (isEdit) {
        await apiClient.put(`/admin/services/${service.id}`, payload);
      } else {
        await apiClient.post('/admin/services', payload);
      }
      await get().fetchServices();
      return true;
    } catch (error: any) { 
      console.error('Save service failed:', error.response?.data || error.message);
      alert(`Gagal menyimpan: ${error.response?.data?.message || 'Terjadi kesalahan validasi di Backend'}`);
      return false; 
    }
  },

  deleteService: async (id) => {
    try {
      await apiClient.delete(`/admin/services/${id}`);
      await get().fetchServices();
      return true;
    } catch (error) { return false; }
  },

  updateConfig: async (key, value) => {
    try {
      await apiClient.post('/admin/configs', { key, value });
      return true;
    } catch (error) { return false; }
  }
}));