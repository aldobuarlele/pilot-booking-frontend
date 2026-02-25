import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface ThemeState {
  primaryColor: string;
  companyName: string;
  heroImageUrl: string;
  isLoading: boolean;
  fetchConfigs: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: '#1D4ED8', 
  companyName: 'Pilot Booking',
  heroImageUrl: '/images/default-hero.jpg',
  isLoading: false,

  fetchConfigs: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/public/configs');
      const configs = response.data.data;
      
      let newPrimaryColor = '#1D4ED8';
      let newCompanyName = 'Pilot Booking';
      let newHeroImage = '/images/default-hero.jpg';

      configs.forEach((config: { key: string; value: string }) => {
        if (config.key === 'primary_color') newPrimaryColor = config.value;
        if (config.key === 'company_name') newCompanyName = config.value;
        if (config.key === 'hero_image_url') newHeroImage = config.value;
      });

      set({
        primaryColor: newPrimaryColor,
        companyName: newCompanyName,
        heroImageUrl: newHeroImage,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch system configs:', error);
      set({ isLoading: false });
    }
  },
}));