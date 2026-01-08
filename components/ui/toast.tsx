import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { Colors } from '@/constants/Colors';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <View style={StyleSheet.absoluteFill} pointerEvents="box-none">{children}</View>;
};

const ToastViewport = React.forwardRef<View, React.ComponentPropsWithoutRef<typeof View>>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.viewport, style]}
      {...props}
      pointerEvents="box-none"
    />
  )
);
ToastViewport.displayName = 'ToastViewport';

const toastVariants = cva('', {
  variants: {
    variant: {
      default: {},
      success: {},
      danger: {},
      warning: {},
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const ToastContext = React.createContext<{
  onOpenChange: (open: boolean) => void;
}>({
  onOpenChange: () => { },
});

const Toast = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View> & VariantProps<typeof toastVariants> & { open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ style, variant = 'default', open, onOpenChange, children, ...props }, ref) => {
  return (
    <ToastContext.Provider value={{ onOpenChange: onOpenChange || (() => { }) }}>
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutUp}
        ref={ref}
        style={[
          styles.toast,
          styles[variant ?? 'default'],
          style,
        ]}
        {...props}
      >
        {children}
      </Animated.View>
    </ToastContext.Provider>
  );
});
Toast.displayName = 'Toast';

const ToastAction = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof TouchableOpacity>
>(({ style, ...props }, ref) => (
  <TouchableOpacity
    ref={ref}
    style={[styles.action, style]}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

const ToastClose = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof TouchableOpacity>
>(({ style, ...props }, ref) => {
  const { onOpenChange } = React.useContext(ToastContext);
  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.close, style]}
      onPress={() => onOpenChange(false)}
      {...props}
    >
      <Ionicons name="close" size={20} color={styles.closeIcon.color} />
    </TouchableOpacity>
  );
});
ToastClose.displayName = 'ToastClose';

const ToastTitle = React.forwardRef<
  Text,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[styles.title, style]}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

const ToastDescription = React.forwardRef<
  Text,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[styles.description, style]}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 50, // Adjust based on safe area
    left: 20,
    right: 20,
    zIndex: 100,
    gap: 10,
  },
  toast: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  default: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
  },
  success: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  danger: {
    backgroundColor: Colors.light.error,
    borderColor: '#ef4444',
  },
  warning: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  action: {
    marginLeft: 16,
  },
  close: {
    marginLeft: 16,
  },
  closeIcon: {
    color: '#fff', // Dynamic based on variant?
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontSize: 12,
    color: '#dcdcdc',
  },
});

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
