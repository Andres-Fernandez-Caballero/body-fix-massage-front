export interface Notification {
    id: string,
    data: {
        title: string,
        body: string,
        url: string,
    },
    readAt: string| null,
    createdAt: string,
    updatedAt: string,
}