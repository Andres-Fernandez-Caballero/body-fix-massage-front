import axiosInstance from "./axios.instance"

export interface BookingCreateRequest {
    announcementId: number,
    therapistId: number,
    date: string,
    startTime: string,
    endTime: string,
    notes?: string
}

export const bookingsApi = {
    createBooking: (data: BookingCreateRequest) => axiosInstance.post('/api/v1/bookings', {
        announcement_id: data.announcementId,
        therapist_id: data.therapistId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        notes: data.notes
    })
}