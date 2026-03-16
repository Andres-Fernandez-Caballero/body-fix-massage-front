import { useState } from "react"
import AwesomeAlert from "react-native-awesome-alerts"

interface AlertProps {
    title: string
    message: string
    cancelText: string
    onClose: () => void
    onCancelPressed?: () => void
    onConfirmPressed?: () => void
}

export function useAlert() {
    const [alert, setAlert] = useState<AlertProps | null>(null)
    const showAlert = (alertProps: AlertProps) => {
        setAlert(alertProps)
    }
    const hideAlert = () => {
        setAlert(null)
    }
    return { showAlert, hideAlert, alert }
}

export const Alert = ({ title, message, cancelText, onClose }: AlertProps) => {
    return (
        <AwesomeAlert
            show={true}
            title={title}
            message={message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText={cancelText}
            confirmText="OK"
            onCancelPressed={() => {
                onClose()
            }}
            onConfirmPressed={() => {
                onClose()
            }}
        />
    )
}