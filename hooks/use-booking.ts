// hooks/use-bookings.ts
import { useState, useCallback } from 'react';
import { bookingsApi, BookingCreateRequest } from '@/data/api/bookings.api';
import { parseApiError, ApiError } from '@/data/api/api-errors';

export interface CreateDateForm {
  announcementId: number;
  therapistId: number;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createBooking = useCallback(async (data: CreateDateForm) => {
    setLoading(true);
    setError(null);

    try {
      const isoDate = data.date.toISOString().split('T')[0];

      const payload: BookingCreateRequest = {
        announcementId: data.announcementId,
        therapistId: data.therapistId,
        date: isoDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
      };

      const response = await bookingsApi.createBooking(payload);
      return response.data;
    } catch (e) {
      const apiError = parseApiError(e);
      setError(apiError);
      throw apiError; // 🔥 error tipado hacia la UI
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBooking,
    loading,
    error,
  };
}
