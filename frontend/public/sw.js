self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon.png', // Fallback icon
    badge: '/badge.png', // Fallback badge
    tag: data.type || 'admin-notification',
    data: data,
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'View' },
      { action: 'close', title: 'Dimiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Al Fattah Nikkah', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/admin/messages')
    );
  }
});
