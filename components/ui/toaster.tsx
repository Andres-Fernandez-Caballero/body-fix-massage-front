import { View } from 'react-native';
import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <ToastViewport>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          if (!props.open) return null;
          return (
            <Toast key={id} {...props}>
              <View style={{ gap: 4 }}>
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </View>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
      </ToastViewport>
    </ToastProvider>
  )
}
