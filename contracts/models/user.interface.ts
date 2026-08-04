export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    state: State;
    role: 'admin' | 'client' | 'massage_therapist';
    profilePicture: string | null;
}

export interface State {
    color: string;
    label: string;
    description: string
    isActive: boolean;
}

export interface MetaLink {
    url: string;
    label: string;
    active: boolean;
}

export interface MetaCollection {
    current_page: number;
    from: number;
    last_page: number;
    links: MetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface MetaPaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface Booking {
    id: string;
    therapistId: string;
    announcementId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
    state: State;
    createdAt: string;
    updatedAt: string;
}