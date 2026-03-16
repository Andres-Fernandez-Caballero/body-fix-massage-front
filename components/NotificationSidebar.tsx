import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Animated,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useNotifications } from '@/hooks/use-notifications';
import { Notification } from '@/contracts/models/notifications.interface';

interface NotificationSidebarProps {
    visible: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.85;

export function NotificationSidebar({ visible, onClose }: NotificationSidebarProps) {
    const slideAnim = useRef(new Animated.Value(width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { notifications, markAsRead, markAllAsRead, loadNotifications } = useNotifications();

    useEffect(() => {
        if (visible) {
            loadNotifications();
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: width - SIDEBAR_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: width,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        // Animate out before calling onClose? 
        // Usually we rely on parent keeping visible=true until animation done, or we accept the hard cut if modal creates unmount.
        // For smoother UX with Modal, usually we keep Modal visible while animating out, then set visible=false.
        // But since we are using a simple "visible" prop here, user expects immediate toggle.
        // To fix this commonly, we would handle internal "isVisible" state or use a delay.
        // For now, I'll allow the hard close, or if the user clicks "Backdrop", we call onClose.
        // If I want animation on close, I need to intercept onClose.
        // But then I need to signal parent when animation finishes.
        // Given the prompt "se despliegue... de derecha a izquierda", the opening is simpler.
        onClose();
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const isUnread = !item.readAt;

        return (
            <TouchableOpacity
                style={[styles.itemCallback, isUnread && styles.unreadItem]}
                onPress={() => markAsRead(item.id)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, isUnread && styles.unreadIconContainer]}>
                    <Ionicons
                        name={isUnread ? "notifications" : "notifications-outline"}
                        size={22}
                        color={isUnread ? '#fff' : Colors.light.icon}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.itemTitle, isUnread && styles.unreadTitle]}>{item.data.title}</Text>
                    <Text style={styles.itemBody} numberOfLines={3}>{item.data.body}</Text>
                    <Text style={styles.itemTime}>
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                {isUnread && (
                    <TouchableOpacity
                        style={styles.markReadButton}
                        onPress={() => markAsRead(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="checkmark" size={16} color={Colors.light.primary} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.sidebar,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Notifications</Text>
                        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => markAllAsRead()}>
                                <Ionicons name="checkmark-done-outline" size={24} color={Colors.light.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={26} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={notifications}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="notifications-off-outline" size={48} color={Colors.light.tabIconDefault} />
                                <Text style={styles.emptyText}>No notifications</Text>
                            </View>
                        }
                    />
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH, // We'll translate it.
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 20,
        zIndex: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    itemCallback: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
        // Soft shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unreadItem: {
        backgroundColor: '#FFF8E1', // Light warm tint to match primary orange
        borderColor: Colors.light.primary,
        shadowColor: Colors.light.primary,
        shadowOpacity: 0.1,
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.card,
    },
    unreadIconContainer: {
        backgroundColor: Colors.light.primary,
    },
    markReadButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        alignSelf: 'center',
        // Shadow for the button to make it pop slightly
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255,157,12,0.1)',
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    unreadTitle: {
        color: Colors.light.primary,
        fontWeight: '700',
    },
    itemBody: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    itemTime: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.primary,
        position: 'absolute',
        top: 16,
        right: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.light.text,
    }
});
