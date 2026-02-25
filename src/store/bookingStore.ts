import { create } from 'zustand';
import { apiClient } from '../lib/axios';

interface BookingState {
  startDate: string;
  endDate: string;
  notes: string;
  isSubmitting: boolean;
  setDates: (start: string, end: string) => void;
  setNotes: (notes: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  startDate: '',
  endDate: '',
  notes: '',
  isSubmitting: false,

  setDates: (start, end) => set({ startDate: start, endDate: end }),
  setNotes: (notes) => set({ notes }),
}));