// public/sw.js
self.addEventListener('push', (event) => {
  console.log('🔥 PUSH EVENT RECEIVED', event);
  const data = event.data ? event.data.json() : {};
  console.log('Push data:', data);

  const title = data.title || 'Invade Gaming Cafe';
  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/dashboard/staff' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard/staff';
  event.waitUntil(clients.openWindow(url));
});
