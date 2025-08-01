// Service Worker for Push Notifications and PWA functionality
const CACHE_NAME = 'mindflow-ai-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/brain-icon.svg',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from MindFlow AI',
    icon: '/brain-icon.svg',
    badge: '/brain-icon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/brain-icon.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/brain-icon.svg'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('MindFlow AI', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close()
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync for offline mood logging
self.addEventListener('sync', (event) => {
  if (event.tag === 'mood-log-sync') {
    event.waitUntil(syncMoodLogs())
  }
})

async function syncMoodLogs() {
  // Get offline mood logs from IndexedDB
  const db = await openDB()
  const transaction = db.transaction(['offlineLogs'], 'readonly')
  const store = transaction.objectStore('offlineLogs')
  const logs = await store.getAll()

  // Sync each log to server
  for (const log of logs) {
    try {
      const response = await fetch('/api/mood-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(log.data)
      })

      if (response.ok) {
        // Remove from offline storage
        const deleteTransaction = db.transaction(['offlineLogs'], 'readwrite')
        const deleteStore = deleteTransaction.objectStore('offlineLogs')
        await deleteStore.delete(log.id)
      }
    } catch (error) {
      console.error('Failed to sync mood log:', error)
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MindFlowDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('offlineLogs')) {
        db.createObjectStore('offlineLogs', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}