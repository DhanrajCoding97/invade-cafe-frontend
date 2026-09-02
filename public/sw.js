self.addEventListener('push', (event) => {
  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.error('❌ Failed to parse push payload as JSON:', error);

    data = {
      title: 'Invade Gaming Cafe',
      body: event.data?.text() || 'You have a new notification',
      url: '/dashboard/staff',
    };
  }

  const title = data.title || 'Invade Gaming Cafe';

  const options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: data.url || '/dashboard/staff',
    },
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((err) => {
      console.error('showNotification failed:', err);
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard/staff/bookings';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});
