import { registerWebPush } from "@/lib/web_push";
import { axiosInstance } from "./axios.instance";
import { Platform } from "react-native";
import { Notification } from "@/contracts/models/notifications.interface";

export interface GetNotificationsResponse {
    data: Notification[];
    meta: {
        unreadCount: number;
    }
}

export const NotificationApi = {
    registerWebPushSubscription: async (subscription: any) => {
        try {
            const payload = {
                platform: Platform.OS,
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.toJSON()?.keys?.p256dh,
                    auth: subscription.toJSON()?.keys?.auth
                }
            }
            console.log("DEBUG: registerWebPushSubscription payload:", payload);
            console.log("Push Subscription data:", payload);
            await axiosInstance.post('/api/v1/notifications/register-token', payload);
            console.log("Notification token registered successfully with backend");
        } catch (error: any) {
            console.error("Error in NotificationApi.registerWebPushSubscription:", error.response?.data || error.message);
            throw error;
        }
    },
    registerNativeToken: async (token: string) => {
        try {
            await axiosInstance.post('/api/v1/notifications/register-token', {
                platform: Platform.OS,
                token
            });
            console.log("Native notification token registered successfully with backend");
        } catch (error: any) {
            console.error("Error in NotificationApi.registerNativeToken:", error.response?.data || error.message);
            throw error;
        }
    },
    getNotifications: async (): Promise<GetNotificationsResponse> => {
        try {
            const response = await axiosInstance.get('/api/v1/notifications');
            return response.data;
        } catch (error) {
            console.error("Error in NotificationApi.getNotifications:", error);
            throw error;
        }
    },
    markAsRead: async (id: string): Promise<void> => {
        try {
            await axiosInstance.patch(`/api/v1/notifications/${id}/read`);
        } catch (error) {
            console.error("Error in NotificationApi.markAsRead:", error);
            throw error;
        }
    },
    markAllAsRead: async (): Promise<void> => {
        try {
            await axiosInstance.patch('/api/v1/notifications/read-all');
        } catch (error) {
            console.error("Error in NotificationApi.markAllAsRead:", error);
            throw error;
        }
    }
}
