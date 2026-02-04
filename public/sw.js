// Force immediate activation
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
    if (event.data) {
        let data;
        try {
            data = event.data.json();
        } catch (e) {
            // Fallback for non-JSON payloads (like DevTools test)
            console.log('Push data is not JSON, using as text:', event.data.text());
            data = {
                title: 'Notification Edusky',
                body: event.data.text(),
                url: '/'
            };
        }

        const options = {
            body: data.body || 'Nouveau message',
            icon: data.icon || '/icons/icon-192x192.png',
            badge: data.badge || '/icons/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                url: data.url || '/'
            },
        };

        event.waitUntil(self.registration.showNotification(data.title || 'Edusky', options));
    }
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.')
    event.notification.close()
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    )
})
