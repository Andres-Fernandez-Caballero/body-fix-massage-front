export interface BookingCreateRequest {
    announcementId: number;
    therapistId: number;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}