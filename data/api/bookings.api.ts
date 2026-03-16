import { Booking, MetaCollection, MetaPaginationLinks } from "@/contracts/models/user.interface";
import axiosInstance from "./axios.instance";

export interface BookingsResponse {
    meta: MetaCollection;
    links: MetaPaginationLinks;
    data: Booking[];
}

export interface CreateBookingRequest {
    therapistId: string,
    announcementId: string,
    date: string,
    startTime: string,
    endTime: string,
    notes?: string
}


export const bookingsApi = {
    getBookings: () => axiosInstance.get<BookingsResponse>('/api/v1/bookings'),
    makeBooking: (data: CreateBookingRequest) => axiosInstance.post('/api/v1/bookings', {
        ...data,
        therapist_id: data.therapistId,
        announcement_id: data.announcementId,
        start_time: data.startTime,
        end_time: data.endTime,
    })
}
