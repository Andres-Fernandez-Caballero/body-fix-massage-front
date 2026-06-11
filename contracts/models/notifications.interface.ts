export interface Notification {
    id: string,
    data: {
        title: string,
        body: string,
        url: string | null,
        data?: {
            screen?: string,
            bookingId?: number,
        },
    },
    readAt: string | null,
    createdAt: string,
    updatedAt: string,
}