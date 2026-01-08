export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    role: 'admin' | 'client' | 'massage_therapist';
    profilePicture: string | null;
}

export interface Booking {
    id: string;
}