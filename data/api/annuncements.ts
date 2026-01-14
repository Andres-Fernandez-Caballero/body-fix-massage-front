import { Announcement } from "@/contracts/models/announcements.interface";
import axiosInstance from "./axios.instance";

interface AnnuncementsResponse {
    data: Announcement[];
}

export const annuncementsApi = {
    getAnnuncements: () => axiosInstance.get('/api/v1/announcements'),
    getAnnuncementsDestacates: () => axiosInstance.get('/api/v1/announcements/destacates'),
}