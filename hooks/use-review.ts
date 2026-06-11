import { useState } from "react";
import { reviewsApi } from "@/data/api/reviews.api";
import { parseApiError } from "@/data/api/api-errors";

export function useReview(bookingId: number) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submitReview = async (data: {
        local_score: number;
        therapist_score?: number | null;
        comment?: string | null;
    }) => {
        setLoading(true);
        setError(null);
        try {
            await reviewsApi.store(bookingId, data);
            setSuccess(true);
        } catch (e) {
            const parsed = parseApiError(e);
            setError(parsed.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, submitReview };
}
