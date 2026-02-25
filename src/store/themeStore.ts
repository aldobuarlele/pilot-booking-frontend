import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface ThemeState {
  primaryColor: string;
  companyName: string;
  heroImageUrl: string;
  adminWa: string;
  paymentInfo: string;
  isLoading: boolean;
  fetchConfigs: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: '#1D4ED8', 
  companyName: 'Pilot Booking',
  heroImageUrl: '/images/default-hero.jpg',
  adminWa: '6281234567890',
  paymentInfo: 'Bank BCA: 123456789 a.n Pilot Booking', 
  isLoading: false,

  fetchConfigs: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/public/configs');
      const configs = response.data.data;
      
      let newPrimaryColor = '#1D4ED8';
      let newCompanyName = 'Pilot Booking';
      let newHeroImage = '/images/default-hero.jpg';
      let newAdminWa = '6281234567890';
      let newPaymentInfo = 'Bank BCA: 123456789 a.n Pilot Booking';

      configs.forEach((config: { key: string; value: string }) => {
        if (config.key === 'primary_color') newPrimaryColor = config.value;
        if (config.key === 'company_name') newCompanyName = config.value;
        if (config.key === 'hero_image_url') newHeroImage = config.value;
        if (config.key === 'admin_wa') newAdminWa = config.value;
        if (config.key === 'payment_info') newPaymentInfo = config.value;
      });

      set({
        primaryColor: newPrimaryColor,
        companyName: newCompanyName,
        heroImageUrl: newHeroImage,
        adminWa: newAdminWa,
        paymentInfo: newPaymentInfo,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch system configs:', error);
      set({ isLoading: false });
    }
  },
}));