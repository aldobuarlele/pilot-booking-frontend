import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface DashboardMetrics {
  totalActiveServices: number;
  totalPendingApprovals: number;
  totalSoftBookings: number;
  totalCompletedBookings: number;
  totalRevenue: number;
}

interface AdminState {
  bookings: any[];
  services: any[];
  metrics: DashboardMetrics | null;
  fetchBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<boolean>;
  fetchServices: () => Promise<void>;
  saveService: (service: any, isEdit: boolean, imageFile?: File | null) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  updateConfig: (key: string, value: string) => Promise<boolean>;
  fetchMetrics: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  bookings: [],
  services: [],
  metrics: null,

  fetchBookings: async () => {
    try {
      const res = await apiClient.get('/admin/bookings');
      set({ bookings: res.data.data });
    } catch (error) { console.log('Error fetching bookings:', error); }
  },

  updateBookingStatus: async (id, status) => {
    try {
      await apiClient.put(`/admin/bookings/${id}/status`, { status });
      await get().fetchBookings(); 
      await get().fetchMetrics();
      return true;
    } catch (error) { return false; }
  },

  fetchServices: async () => {
    try {
      const res = await apiClient.get('/admin/services');
      set({ services: res.data.data });
    } catch (error) { console.log('Error fetching services:', error); }
  },

  saveService: async (service, isEdit, imageFile) => {
    try {
      const parsedPrice = parseFloat(service.basePrice);
      const finalPrice = isNaN(parsedPrice) || parsedPrice <= 0 ? 1000 : parsedPrice;
      
      const parsedQuota = parseInt(service.quota);
      const finalQuota = isNaN(parsedQuota) || parsedQuota < 1 ? 1 : parsedQuota;

      const finalName = service.name ? String(service.name).trim() : 'Layanan Baru';
      const finalDesc = service.description ? String(service.description).trim() : 'Deskripsi Layanan';

      const payload = {
        name: finalName,
        description: finalDesc,
        basePrice: finalPrice,
        isActive: service.isActive !== undefined ? Boolean(service.isActive) : true,
        quota: finalQuota
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const axiosConfig = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (isEdit && service.id) {
        await apiClient.put(`/admin/services/${service.id}`, formData, axiosConfig);
      } else {
        await apiClient.post('/admin/services', formData, axiosConfig);
      }
      
      await get().fetchServices();
      await get().fetchMetrics();
      return true;
    } catch (error: any) { 
      console.log('Save service detail error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Kesalahan validasi input / Upload Gagal';
      alert(`Gagal menyimpan: ${errorMessage}`);
      return false; 
    }
  },

  deleteService: async (id) => {
    try {
      await apiClient.delete(`/admin/services/${id}`);
      await get().fetchServices();
      await get().fetchMetrics();
      return true;
    } catch (error) { return false; }
  },

  updateConfig: async (key, value) => {
    try {
      await apiClient.post('/admin/configs', { key, value });
      return true;
    } catch (error) { return false; }
  },

  fetchMetrics: async () => {
    try {
      const res = await apiClient.get('/admin/dashboard/metrics');
      set({ metrics: res.data.data });
    } catch (error) { console.log('Error fetching metrics:', error); }
  }
}));