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