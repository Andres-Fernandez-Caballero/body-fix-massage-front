export interface BookingState {
    /**
     * - `pending_payment` → awaiting MP payment (never shown in client "Mis turnos")
     * - `pending`         → (legacy) new bookings skip this and go straight to `confirmed`
     * - `confirmed`       → payment approved; booking is active
     * - `completed`       → session finished
     * - `cancelled`       → cancelled (with or without refund)
     * - `expired`         → booking date passed without confirmation
     */
    name: 'pending_payment' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
    label: string;
    description: string;
}

export interface Booking {
    id: number;
    therapistId: number | null;
    announcementId: number | null;
    localId: number | null;
    especialidadId: number | null;
    date: string;
    startTime: string;
    endTime: string;
    price: number | null;
    notes: string | null;
    state: BookingState;
    hasReview: boolean;
    reviewLocalScore: number | null;
    localName: string | null;
    localDireccion: string | null;
    localLocalidad: string | null;
    especialidadNombre: string | null;
    therapistName: string | null;
    createdAt?: string;
    updatedAt?: string;
}
