import { Therapist } from "./therapists.interface";
import { User } from "./user.interface";
import { Announcement } from "./announcements.interface";

export interface Booking {
    id?: number
    therapist: Therapist,
    announcement: Announcement,
    client: User,
    date: string,
    startTime: string,
    endTime: string,
    status: string,
    notes: string,
    createdAt?: string,
    updatedAt?: string
}