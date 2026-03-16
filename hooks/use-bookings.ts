import { useCallback } from 'react';
import { bookingsApi, CreateBookingRequest } from '@/data/api/bookings.api';
import { useBookingsStore } from '@/data/store/bookings.storage';

export function useBookings() {
    const { 
        bookings, 
        loading, 
        isCreating,
        error, 
        setBookings, 
        addBooking, 
        setLoading, 
        setIsCreating,
        setError 
    } = useBookingsStore();

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingsApi.getBookings();
            setBookings(response.data.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error fetching bookings';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [setBookings, setLoading, setError]);

    const createBooking = useCallback(async (bookingData: CreateBookingRequest) => {
        setIsCreating(true);
        setError(null);
        try {
            const response = await bookingsApi.makeBooking(bookingData);
            // Assuming the API returns the created booking in response.data.data
            if (response.data && response.data.data) {
                addBooking(response.data.data);
            } else {
                // If not, we might need to refetch
                await fetchBookings();
            }
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error creating booking';
            setError(errorMessage);
            console.error('Create booking error:', err);
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, [addBooking, fetchBookings, setIsCreating, setError]);

    return {
        bookings,
        loading,
        isCreating,
        error,
        fetchBookings,
        createBooking,
    };
}
