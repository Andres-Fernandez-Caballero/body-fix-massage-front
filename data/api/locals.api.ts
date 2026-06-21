import { axiosInstance } from './axios.instance';
import type { Local, Especialidad, Masajista, LocalAvailabilityDay } from '@/contracts/models/local.interface';
import type { Booking } from '@/contracts/models/booking.interface';

export const getLocals = async (): Promise<Local[]> => {
    const res = await axiosInstance.get('/api/v1/locals');
    return res.data.data;
};

export const getLocalEspecialidades = async (localId: number): Promise<Especialidad[]> => {
    const res = await axiosInstance.get(`/api/v1/locals/${localId}/especialidades`);
    return res.data.data;
};

export const getLocalSlots = async (localId: number, daysAhead = 14): Promise<LocalAvailabilityDay[]> => {
    const res = await axiosInstance.get(`/api/v1/locals/${localId}/slots`, {
        params: { days_ahead: daysAhead },
    });
    return res.data.data;
};

export const getLocalMasajistas = async (
    localId: number,
    date: string,
    time: string,
    especialidadId?: number,
): Promise<Masajista[]> => {
    const res = await axiosInstance.get(`/api/v1/locals/${localId}/masajistas`, {
        params: { date, time, especialidad_id: especialidadId },
    });
    return res.data.data;
};

export interface CreateLocalBookingParams {
    masajistaId: number;
    especialidadId: number | null;
    date: string;
    startTime: string;
    notes?: string;
}

export interface CreateBookingResponse {
    data: Booking;
}

export const createLocalBooking = async (
    localId: number,
    params: CreateLocalBookingParams,
): Promise<CreateBookingResponse> => {
    const res = await axiosInstance.post(`/api/v1/locals/${localId}/bookings`, {
        masajista_id:    params.masajistaId,
        especialidad_id: params.especialidadId,
        date:            params.date,
        start_time:      params.startTime,
        notes:           params.notes ?? '',
    });
    return res.data as CreateBookingResponse;
};

export interface BookingPaymentStatusResponse {
    state: string;
    payment_status: 'approved' | 'rejected' | 'pending';
}

/**
 * Consulta el estado de pago de una reserva en pending_payment.
 * El backend hace polling de la API de Mercado Pago directamente.
 * Usar después de que el usuario regresa del checkout externo.
 */
export const getBookingPaymentStatus = async (
    bookingId: number,
): Promise<BookingPaymentStatusResponse> => {
    const res = await axiosInstance.get(`/api/v1/bookings/${bookingId}/payment-status`);
    return res.data as BookingPaymentStatusResponse;
};

export const cancelPendingBooking = async (bookingId: number): Promise<void> => {
    await axiosInstance.post(`/api/v1/bookings/${bookingId}/cancel-pending`);
};
