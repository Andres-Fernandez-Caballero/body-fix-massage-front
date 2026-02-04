/* ===========================
   Service Worker – Web Push
   =========================== */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  try {
    if (!event.data) {
      console.warn('[SW] Push sin payload');
      return;
    }

    const payload = event.data.json();
    const data = payload.data || payload;

    const title = data.title || 'BodyFix';

    const options = {
      body: data.body || '',
      icon: '/icon.png',
      badge: '/icon.png',
      data: {
        id: data.id,
        url: data.url || '/',
      },
      vibrate: [100, 50, 100],
    };

    // ✅ Mostrar notificación fuera de la app
    await self.registration.showNotification(title, options);

    // Avisar a la app (si está abierta)
    const clientsList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    for (const client of clientsList) {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        payload: {
          title,
          body: options.body,
          data: options.data,
        },
      });
    }

  } catch (err) {
    console.error('[SW] Push error:', err);
  }
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url || '/')
  );
});
