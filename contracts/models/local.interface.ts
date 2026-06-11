export interface Local {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string | null;
    email: string;
    descripcion: string | null;
    instagram: string | null;
    localidad: string | null;
    latitude: number | null;
    longitude: number | null;
    imageUrl: string | null;
    slotDurationMinutes: number;
    avgLocalScore: number | null;
    reviewsCount: number;
}

export interface Especialidad {
    id: number;
    nombre: string;
    price: number | null;
}

export interface Masajista {
    id: number;
    nombre: string;
    descripcion: string | null;
    fotoUrl: string | null;
    especialidades?: string[];
}

export interface LocalSlot {
    startTime: string;
    endTime: string;
}

export interface LocalAvailabilityDay {
    date: string;
    dayOfWeek: number;
    slots: LocalSlot[];
}
