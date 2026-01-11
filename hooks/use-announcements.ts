import { useState, useEffect, useCallback } from 'react';
import { annuncementsApi } from '@/data/api/annuncements';
import { Announcement } from '@/contracts/models/announcements.interface';
export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [destacates, setDestacates] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await annuncementsApi.getAnnuncements();
            setAnnouncements(response.data.data);
        } catch (err) {
            setError('Error fetching announcements');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);
     const fetchDestacates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await annuncementsApi.getAnnuncementsDestacates();
            setDestacates(response.data.data);
        } catch (err) {
             // Optional: handle error separately or merge
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchAnnouncements();
        fetchDestacates();
    }, [fetchAnnouncements, fetchDestacates]);
    return {
        announcements,
        destacates,
        loading,
        error,
        refresh: fetchAnnouncements, // or a combined refresh
    };
}