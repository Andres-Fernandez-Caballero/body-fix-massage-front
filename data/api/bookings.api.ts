import { Booking } from "@/contracts/models/booking.interface";
import { MetaCollection, MetaPaginationLinks } from "@/contracts/models/user.interface";
import { axiosInstance } from "./axios.instance";

export interface BookingsResponse {
    meta: MetaCollection;
    links: MetaPaginationLinks;
    data: Booking[];
}

export interface CreateBookingRequest {
    therapistId: string;
    announcementId?: string;
    especialidadId?: number | null;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export const bookingsApi = {
    getBookings: () => axiosInstance.get<BookingsResponse>('/api/v1/bookings/client'),
    makeBooking: (data: CreateBookingRequest) => axiosInstance.post('/api/v1/bookings', {
        therapist_id: data.therapistId,
        announcement_id: data.announcementId,
        especialidad_id: data.especialidadId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        notes: data.notes,
    }),
}
