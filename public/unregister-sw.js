// Script to unregister service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Service Worker unregistered');
    }
    document.getElementById('status').textContent = 'Service Worker successfully unregistered';
  }).catch(error => {
    console.error('Service Worker unregistration failed:', error);
    document.getElementById('status').textContent = 'Service Worker unregistration failed: ' + error;
  });
}