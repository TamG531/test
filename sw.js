// This minimal Service Worker is required to pass PWA installation criteria
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (e) => {
    // Leaves all network requests alone so Firebase and Google Sheets work normally
});
