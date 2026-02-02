import { registerWebPush } from "@/lib/web_push";
import { axiosInstance } from "./axios.instance";
import { Platform } from "react-native";
import { arrayBuffer } from "stream/consumers";

export const NotificationApi = {
    registerWebPush: async () => {
        try {
            const subscription = await registerWebPush();

            const payload = {
                platform: Platform.OS,
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.toJSON()?.keys?.p256dh,
                    auth: subscription.toJSON()?.keys?.auth
                }
            }
            console.log("Push Subscription data:", payload);
            await axiosInstance.post('/api/v1/notifications/register-token', payload);
            console.log("Notification token registered successfully with backend");
        } catch (error) {
            console.error("Error in NotificationApi.registerWebPush:", error);
            throw error;
        }
    }
}