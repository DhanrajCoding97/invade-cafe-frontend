// // lib/push-subscribe.ts
// 'use client';

// function urlBase64ToUint8Array(base64String: string) {
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
//   const rawData = atob(base64);
//   return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
// }

// export async function subscribeToPush() {
//   if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
//     throw new Error('Push notifications not supported on this device/browser');
//   }

//   const registration = await navigator.serviceWorker.register('/sw.js');
//   await navigator.serviceWorker.ready;

//   const permission = await Notification.requestPermission();
//   if (permission !== 'granted') {
//     throw new Error('Notification permission denied');
//   }

//   const subscription = await registration.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: urlBase64ToUint8Array(
//       process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//     ),
//   });

//   const res = await fetch('/api/push/subscribe', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(subscription),
//   });

//   if (!res.ok) throw new Error('Failed to save subscription');
//   return subscription;
// }
'use client';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeToPush() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported');
  }

  if (!('PushManager' in window)) {
    throw new Error('Push notifications are not supported');
  }

  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');

  // Check if this browser already has a subscription
  let subscription = await registration.pushManager.getSubscription();

  // Ask for permission only if needed
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }
  }

  // Create subscription if one doesn't exist
  if (!subscription) {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidKey) {
      throw new Error('VAPID public key is not configured');
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  // Always send the subscription to our backend.
  // This is useful if the backend previously removed
  // an expired subscription.
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);

    throw new Error(data?.error || 'Failed to save push subscription');
  }

  return subscription;
}
