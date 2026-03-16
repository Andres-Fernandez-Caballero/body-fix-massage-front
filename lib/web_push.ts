export async function registerWebPush() {
    if (!('serviceWorker' in navigator)) {
        throw new Error("Service workers are not supported in this browser");
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        throw new Error("Permission not granted");
    }

    await navigator.serviceWorker.register('/sw.js');
    const reg = await navigator.serviceWorker.ready;

    if (!process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error("VAPID public key is missing");
    }

    console.log("VAPID public key", process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY);
    
    const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY
    });

    return subscription;
}
