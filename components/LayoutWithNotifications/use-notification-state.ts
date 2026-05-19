import { useNotifications } from "@/hooks/use-notifications";
import { useState } from "react";


export function useNotificationState() {
    const [showNotifications, setShowNotifications] = useState(false)
    const { unreadCount } = useNotifications();
    const onClose = () => setShowNotifications(false);
    const onOpen = () => setShowNotifications(true);
    return {
        showNotifications,
        unreadCount,
        onClose,
        onOpen
    }
}