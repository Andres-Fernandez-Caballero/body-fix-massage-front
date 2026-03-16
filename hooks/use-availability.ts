import { useState, useCallback, useEffect } from 'react';
import { annuncementsApi } from '@/data/api/annuncements';
import { Availability, ApiAvailability } from '@/contracts/models/announcements.interface';

export function useAvailability(initialAnnouncementId?: number, initialDaysAhead?: number) {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [currentAvailability, setCurrentAvailability] = useState<Availability | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailability = useCallback(async (announcementId: number, daysAhead?: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await annuncementsApi.getAvailability(announcementId, daysAhead);
            // Dependiendo de cómo devuelve la data tu backend, asumo response.data.data o response.data
            const rawAvailability: ApiAvailability[] = response.data.data || response.data;
            const parsedAvailability: Availability[] = rawAvailability.map(a => ({
                ...a,
                date: new Date(a.date),
            }))


            setAvailabilities(parsedAvailability);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error fetching availability';
            setError(errorMessage);
            console.error('Fetch availability error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const selectAvailability = useCallback((availability: Availability) => {
        setCurrentAvailability(availability);
    }, []);

    useEffect(() => {
        if (initialAnnouncementId !== undefined) {
            fetchAvailability(initialAnnouncementId, initialDaysAhead);
        }
    }, [initialAnnouncementId, initialDaysAhead, fetchAvailability]);

    return {
        availabilities,
        currentAvailability,
        selectAvailability,
        loading,
        error,
        fetchAvailability,
    };
}
