import { create } from 'zustand';
import { apiClient } from '../lib/axios';

export interface ServiceFacility {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string | null;
}

interface ServiceState {
  services: ServiceFacility[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  isLoading: false,

  fetchServices: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/public/services');
      set({ services: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch services:', error);
      set({ isLoading: false });
    }
  },
}));