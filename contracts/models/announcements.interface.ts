import { Dicipline } from "./dicipline.interface";
import { Therapist } from "./therapists.interface";


export interface Announcement {
    id: number;
    scoring: number;
    title: string;
    content: string;
    currency: 'ARG' | 'USD';
    therapist: Therapist;
    dicipline: Dicipline;
    price: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiSlot {
    startTime: string;
    endTime: string;
}

export interface ApiAvailability {
    id: number;
    date: string;
    dayOfWeek: number;
    reason: string | null;
    slots: ApiSlot[];
}

export interface Slot {
    startTime: Date;
    endTime: Date;
}

export interface Availability {
    id: number;
    date: Date;
    dayOfWeek: number;
    reason: string | null;
    slots: ApiSlot[];
}