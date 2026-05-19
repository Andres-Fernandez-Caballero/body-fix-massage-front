import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    Animated,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useNotifications } from '@/hooks/use-notifications';
import { Notification } from '@/contracts/models/notifications.interface';
import { SIDEBAR_WIDTH, styles, width } from './style';


interface NotificationSidebarProps {
    showNotifications: boolean;
    onClose: () => void;
}

export function NotificationSidebar({ showNotifications, onClose }: NotificationSidebarProps) {
    const slideAnim = useRef(new Animated.Value(width)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { notifications, markAsRead, markAllAsRead, loadNotifications } 
    = useNotifications();

    useEffect(() => {
        if (showNotifications) {
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
    }, [showNotifications]);

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
            visible={showNotifications}
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

