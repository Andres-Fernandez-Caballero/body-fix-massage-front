/* ===========================
   Service Worker – Web Push
   =========================== */

/**
 * IndexedDB helper
 */
importScripts('https://unpkg.com/idb-keyval@6/dist/idb-keyval.iife.js');

/**
 * Instalar inmediato
 */
self.addEventListener('install', e => {
  self.skipWaiting();
});

/**
 * Activar inmediato
 */
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

/**
 * PUSH = SIGNAL
 */
self.addEventListener('push', event => {
  event.waitUntil(handlePush());
});

/**
 * Manejar push
 */
async function handlePush() {

  try {

    // 🔐 Leer token desde IndexedDB
    const token = await idbKeyval.get('auth_token');

    if (!token) {
      console.warn('[SW] No auth token');
      return;
    }

    // 🌐 Llamar a Laravel
    const res = await fetch(
      'https://localhost/api/notifications',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );

    if (res.status === 401) {
      console.warn('[SW] Token expirado');
      return;
    }

    if (!res.ok) {
      console.error('[SW] API error', res.status);
      return;
    }

    const notif = await res.json();

    if (!notif || !notif.data) return;

    // 📬 Datos reales
    const title = notif.data.title ?? 'Notificación';

    const options = {
      body: notif.data.body ?? '',
      icon: '/icon.png',
      badge: '/icon.png',

      data: {
        id: notif.id,
        url: notif.data.url ?? '/',
      },

      vibrate: [100, 50, 100],
    };

    console.log('Mostrando notificación', options);
    // 🔔 Mostrar
    await self.registration.showNotification(title, options);

  } catch (err) {
    console.error('[SW] Push error:', err);
  }
}

/**
 * Click en notificación
 */
self.addEventListener('notificationclick', event => {

  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(openOrFocus(url));
});

/**
 * Abrir o enfocar ventana
 */
async function openOrFocus(url) {

  const clientsList = await clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  for (const client of clientsList) {
    if (client.url === url && 'focus' in client) {
      return client.focus();
    }
  }

  return clients.openWindow(url);
}
