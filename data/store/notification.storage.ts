import { Notification } from "@/contracts/models/notifications.interface";
import { create } from "zustand";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    getNotifications: () => void;
    setNotifications: (notifications: Notification[]) => void;
    setUnreadCount: (unreadCount: number) => void;
    clearNotifications: () => void;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifications: Notification[]) => set({ notifications }),
    setUnreadCount: (unreadCount: number) => set({ unreadCount }),
    getNotifications: () =>
        set((state) => ({ notifications: [...state.notifications] })),
    clearNotifications: () => set({ notifications: [] }),
    markAsRead: (notificationId: string) =>
        set((state) => {
            const notificationIndex = state.notifications.findIndex((n) => n.id === notificationId);
            if (notificationIndex === -1) return state;

            const notification = state.notifications[notificationIndex];
            if (notification.readAt) return state;

            const updatedNotifications = [...state.notifications];
            updatedNotifications[notificationIndex] = { ...notification, readAt: new Date().toISOString() };

            return {
                notifications: updatedNotifications,
                unreadCount: Math.max(0, state.unreadCount - 1)
            };
        }),
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((notification) => ({ ...notification, readAt: new Date().toISOString() })),
            unreadCount: 0
        })),
}));
