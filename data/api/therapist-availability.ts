import axiosInstance from "./axios.instance";

export interface TherapistAvailability {
    date: string,
    dayOfWeek: number,
    available: boolean,
    reason: string | null,
    slots: Slot[],
}

export interface Slot {
    startTime: string;
    endTime: string;
}

interface TherapistAvailabilityResponse {
    data: TherapistAvailability[];
}

export const therapistAvailabilityApi = {
    getTherapistAvailability: (announcementId: number, daysAhead: number = 14) => axiosInstance
        .get<TherapistAvailabilityResponse>(`/api/v1/therapists/${announcementId}/availability?&days_ahead=${daysAhead}`),
}