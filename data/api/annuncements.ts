import { Announcement, ApiAvailability } from "@/contracts/models/announcements.interface";
import axiosInstance from "./axios.instance";

interface AnnuncementsResponse {
    data: Announcement[];
}

interface AnnouncementResponse {
    data: Announcement;
}

interface AvailabilityResponse {
    data: ApiAvailability[];
}

export const annuncementsApi = {
    getAnnuncements: () => axiosInstance.get<AnnuncementsResponse>('/api/v1/announcements'),
    getAnnouncementById: (id: number) => axiosInstance.get<AnnouncementResponse>(`/api/v1/announcements/${id}`),
    getAnnuncementsDestacates: () => axiosInstance.get<AnnuncementsResponse>('/api/v1/announcements/destacates'),
    getAvailability: (annoucementId: number, daysAhead: number = 14) => axiosInstance.get<AvailabilityResponse>(`/api/v1/therapists/${annoucementId}/availability?&days_ahead=${daysAhead}`),
}