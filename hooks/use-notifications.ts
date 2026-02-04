import { useNotificationStore } from "@/data/store/notification.storage";
import { NotificationApi } from "@/data/api/notifications.api";

export function useNotifications() {
    const setNotifications = useNotificationStore((state) => state.setNotifications);
    const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
    const notifications = useNotificationStore((state) => state.notifications);
    const unreadCount = useNotificationStore((state) => state.unreadCount);


    const loadNotifications = async () => {
        try {
            const response = await NotificationApi.getNotifications();
            console.log("notifications", response)
            setNotifications(response.data);
            setUnreadCount(response.meta.unreadCount);
        } catch (error) {
            console.error("Error loading notifications:", error);
        }
    }

    const handleMarkAsRead = async (id: string) => {
        try {
            // Optimistic update
            markAsRead(id);
            await NotificationApi.markAsRead(id);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }finally{
            loadNotifications();
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            // Optimistic update
            markAllAsRead();
            await NotificationApi.markAllAsRead();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }finally{
            loadNotifications();
        }
    };

    return {
        notifications,
        unreadCount,
        loadNotifications,
        clearNotifications,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
    };
}