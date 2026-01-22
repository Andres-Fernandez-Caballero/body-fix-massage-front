// hooks/use-bookings.ts
import { BookingCreate, BookingCreateRequest, bookingsApi } from '@/data/api/bookings.api'
import { useState, useCallback } from 'react'

export interface CreateDateForm {
  announcementId: number,
  therapistId: number,
  date: Date,
  startTime: string,
  endTime: string,
  notes?: string
}

export function useBookings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  const createBooking = useCallback(async (data: CreateDateForm) => {
    setLoading(true)
    setError(null)
    try {
      const isoSringDate = data.date.toISOString().split('T')[0]

      const bookingData: BookingCreateRequest = {
        announcementId: data.announcementId,
        therapistId: data.therapistId,
        date: isoSringDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes
      }

      const response = await bookingsApi.createBooking(bookingData)
      
      return response.data
    } catch (e) {
      setError('Error creating booking')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createBooking,
    loading,
    error,
  }
}
