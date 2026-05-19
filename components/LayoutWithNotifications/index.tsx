
import { useNotificationState } from "./use-notification-state";
import { styles } from "./style";
import { NotificationButton } from "./NotificationButton";
import { NotificationSidebar } from "./NotificationSidebar";
import { ScrollView, View } from "react-native";


export function LayoutWithNotifications({
    headerView,
    children,
}: {
    headerView?: React.ReactNode;
    children: React.ReactNode;
}) {
    const notificationStates = useNotificationState();
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                {headerView}
                <NotificationButton {...notificationStates} />
            </View>

            {children}


            <NotificationSidebar {...notificationStates} />
        </ScrollView>
    )
}
