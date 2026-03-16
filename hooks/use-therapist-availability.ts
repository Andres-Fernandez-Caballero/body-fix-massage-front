import { TherapistAvailability, therapistAvailabilityApi } from "@/data/api/therapist-availability";
import { useCallback, useEffect, useState } from "react";

export type TherapistAvailabilityDomain = Omit<TherapistAvailability, 'date'> & {
    date: Date;
    originalDateString: string;
};

export function useTherapistAvailability(announcementId: number, daysAhead: number = 14) {
    const [availabilities, setAvailabilities] = useState<TherapistAvailabilityDomain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchAvailability = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await therapistAvailabilityApi.getTherapistAvailability(announcementId, daysAhead);

            const domainData: TherapistAvailabilityDomain[] = response.data.data.map(item => {
                // Parse YYYY-MM-DD to local Date object to avoid UTC shifts
                const [year, month, day] = item.date.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);

                return {
                    ...item,
                    originalDateString: item.date,
                    date: dateObj
                };
            });

            setAvailabilities(domainData);
        } catch (error) {
            setError('Failed to fetch availability');
        } finally {
            setLoading(false);
        }
    }, [announcementId, daysAhead]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    return { availabilities, loading, error, dayOfWeek: ['', 'Lu', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'] };
}