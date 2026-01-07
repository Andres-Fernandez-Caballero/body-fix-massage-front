export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    token: string;
}

export interface Booking {
    id: string;
}