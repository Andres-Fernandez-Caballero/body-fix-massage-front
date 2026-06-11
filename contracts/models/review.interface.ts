export interface Review {
    id: number;
    bookingId: number;
    localScore: number;
    therapistScore: number | null;
    comment: string | null;
    createdAt: string;
}
