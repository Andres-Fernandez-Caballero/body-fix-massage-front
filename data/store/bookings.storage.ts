import { create } from 'zustand';
import { Booking } from '@/contracts/models/user.interface';

interface BookingsState {
    bookings: Booking[];
    loading: boolean;
    isCreating: boolean;
    error: string | null;
    setBookings: (bookings: Booking[]) => void;
    addBooking: (booking: Booking) => void;
    setLoading: (loading: boolean) => void;
    setIsCreating: (isCreating: boolean) => void;
    setError: (error: string | null) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
    bookings: [],
    loading: false,
    isCreating: false,
    error: null,
    setBookings: (bookings: Booking[]) => set({ bookings, error: null }),
    addBooking: (booking: Booking) => set((state) => ({ 
        bookings: [booking, ...state.bookings] 
    })),
    setLoading: (loading: boolean) => set({ loading }),
    setIsCreating: (isCreating: boolean) => set({ isCreating }),
    setError: (error: string | null) => set({ error }),
}));
