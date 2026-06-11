import { Review } from "@/contracts/models/review.interface";
import { axiosInstance } from "./axios.instance";

export interface StoreReviewRequest {
    local_score: number;
    therapist_score?: number | null;
    comment?: string | null;
}

export const reviewsApi = {
    store: (bookingId: number, data: StoreReviewRequest) =>
        axiosInstance.post<Review>(`/api/v1/bookings/${bookingId}/review`, data),
};
