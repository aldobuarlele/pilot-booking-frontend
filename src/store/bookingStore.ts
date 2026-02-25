import { create } from 'zustand';
import { apiClient } from '../lib/axios';
import { format } from 'date-fns';

interface BookingState {
  startDate: Date | null;
  endDate: Date | null;
  userName: string;
  userEmail: string;
  userPhone: string;
  notes: string;
  unavailableDates: Date[];
  isSubmitting: boolean;
  isLoadingDates: boolean;
  otpToken: string | null; 
  
  setDates: (start: Date | null, end: Date | null) => void;
  setUserData: (name: string, email: string, phone: string) => void;
  setNotes: (notes: string) => void;
  fetchUnavailableDates: (serviceId: string) => Promise<void>;  
  requestOtp: () => Promise<boolean>;
  verifyOtp: (otpCode: string) => Promise<boolean>;
  submitBooking: (serviceId: string, bookingType: 'SOFT' | 'HARD', paymentImage?: File) => Promise<boolean>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  startDate: null,
  endDate: null,
  userName: '',
  userEmail: '',
  userPhone: '',
  notes: '',
  unavailableDates: [],
  isSubmitting: false,
  isLoadingDates: false,
  otpToken: null,

  setDates: (start, end) => set({ startDate: start, endDate: end }),
  setUserData: (name, email, phone) => set({ userName: name, userEmail: email, userPhone: phone }),
  setNotes: (notes) => set({ notes }),

  fetchUnavailableDates: async (serviceId: string) => {
    set({ isLoadingDates: true });
    try {
      const response = await apiClient.get(`/public/services/${serviceId}/unavailable-dates`);
      const dates = response.data.data?.map((item: { date: string }) => new Date(item.date)) || [];
      set({ unavailableDates: dates, isLoadingDates: false });
    } catch (error) {
      console.error('Failed to fetch unavailable dates:', error);
      set({ isLoadingDates: false });
    }
  },

  requestOtp: async () => {
    const { userName, userEmail, userPhone } = get();
    set({ isSubmitting: true });
    try {
      await apiClient.post('/auth/otp/request', {
        name: userName,
        email: userEmail,
        phone: userPhone 
      });
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      console.error('Failed to request OTP:', error);
      set({ isSubmitting: false });
      return false;
    }
  },

  verifyOtp: async (otpCode: string) => {
    const { userEmail } = get();
    set({ isSubmitting: true });
    try {
      const response = await apiClient.post('/auth/otp/verify', {
        email: userEmail,
        otp: otpCode
      });
      const token = response.data.data.token;
      set({ otpToken: token, isSubmitting: false });
      return true;
    } catch (error) {
      console.error('Invalid OTP:', error);
      set({ isSubmitting: false });
      return false;
    }
  },

  submitBooking: async (serviceId: string, bookingType: 'SOFT' | 'HARD', paymentImage?: File) => {
    const { startDate, endDate, notes, otpToken } = get();
    if (!startDate || !endDate || !otpToken) return false;

    set({ isSubmitting: true });
    
    const formattedStart = format(startDate, 'yyyy-MM-dd');
    const formattedEnd = format(endDate, 'yyyy-MM-dd');

    const bookingData = {
      serviceId,
      startDate: formattedStart,
      endDate: formattedEnd,
      notes
    };

    const config = {
      headers: {
        Authorization: `Bearer ${otpToken}`
      }
    };

    try {
      if (bookingType === 'SOFT') {
        await apiClient.post('/bookings/soft', bookingData, config);
      } else if (bookingType === 'HARD' && paymentImage) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(bookingData)], { type: 'application/json' }));
        formData.append('image', paymentImage);
        
        await apiClient.post('/bookings/hard', formData, {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      console.error('Booking failed:', error);
      set({ isSubmitting: false });
      return false;
    }
  }
}));