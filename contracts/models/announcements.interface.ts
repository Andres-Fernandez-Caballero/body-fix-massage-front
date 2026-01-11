import { Therapist } from "./therapists.interface";


export interface Announcement {
    id: number;
    scoring: number;
    title: string;
    content: string;
    description: string;
    therapist: Therapist;
    diciplines: string[];
    price: number;
    createdAt: string;
    updatedAt: string;
}