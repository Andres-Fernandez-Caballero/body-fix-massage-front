import { useState, useCallback } from 'react';
import {
    getLocals,
    getLocalEspecialidades,
    getLocalSlots,
    getLocalMasajistas,
    createLocalBooking,
    type CreateLocalBookingParams,
    type CreateBookingResponse,
} from '@/data/api/locals.api';
import type { Local, Especialidad, Masajista, LocalAvailabilityDay } from '@/contracts/models/local.interface';
import { parseApiError } from '@/data/api/api-errors';

export function useLocals() {
    const [locals, setLocals] = useState<Local[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getLocals();
            setLocals(Array.isArray(result) ? result : []);
        } catch (e: unknown) {
            setError(parseApiError(e).message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { locals, loading, error, fetchLocals };
}

export function useLocalBooking(localId: number) {
    const [especialidades, setEspecialidades]       = useState<Especialidad[]>([]);
    const [slots, setSlots]                         = useState<LocalAvailabilityDay[]>([]);
    const [masajistas, setMasajistas]               = useState<Masajista[]>([]);
    const [slotsLoading, setSlotsLoading]           = useState(false);
    const [masajistasLoading, setMasajistasLoading] = useState(false);
    const [isBooking, setIsBooking]                 = useState(false);
    const [slotsError, setSlotsError]               = useState<string | null>(null);
    const [masajistasError, setMasajistasError]     = useState<string | null>(null);

    const fetchEspecialidades = useCallback(async () => {
        try {
            const result = await getLocalEspecialidades(localId);
            setEspecialidades(Array.isArray(result) ? result : []);
        } catch {
            // error no crítico, la reserva puede continuar sin especialidades
        }
    }, [localId]);

    const fetchSlots = useCallback(async () => {
        setSlotsLoading(true);
        setSlotsError(null);
        try {
            const result = await getLocalSlots(localId);
            setSlots(Array.isArray(result) ? result : []);
        } catch {
            setSlotsError('No se pudo cargar la disponibilidad. Intentá de nuevo.');
        } finally {
            setSlotsLoading(false);
        }
    }, [localId]);

    const fetchMasajistas = useCallback(async (
        date: string,
        time: string,
        especialidadId?: number,
    ) => {
        setMasajistasLoading(true);
        setMasajistas([]);
        setMasajistasError(null);
        try {
            const result = await getLocalMasajistas(localId, date, time, especialidadId);
            setMasajistas(Array.isArray(result) ? result : []);
        } catch {
            setMasajistasError('No se pudo cargar los masajistas disponibles. Intentá de nuevo.');
        } finally {
            setMasajistasLoading(false);
        }
    }, [localId]);

    const confirmBooking = useCallback(async (params: CreateLocalBookingParams): Promise<CreateBookingResponse> => {
        setIsBooking(true);
        try {
            return await createLocalBooking(localId, params);
        } finally {
            setIsBooking(false);
        }
    }, [localId]);

    return {
        especialidades,
        slots,
        masajistas,
        slotsLoading,
        masajistasLoading,
        isBooking,
        slotsError,
        masajistasError,
        fetchEspecialidades,
        fetchSlots,
        fetchMasajistas,
        confirmBooking,
    };
}
