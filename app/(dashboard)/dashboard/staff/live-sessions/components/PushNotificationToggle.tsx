'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { subscribeToPush } from '@/lib/push-subscribe';

// export function PushNotificationToggle() {
//   const [subscribed, setSubscribed] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [checking, setChecking] = useState(true);

//   // useEffect(() => {
//   //   async function checkSubscription() {
//   //     try {
//   //       if (!('serviceWorker' in navigator)) return;

//   //       const registration = await navigator.serviceWorker.ready;

//   //       const subscription = await registration.pushManager.getSubscription();

//   //       setSubscribed(!!subscription);
//   //     } catch (error) {
//   //       console.error('Failed to check push subscription:', error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   checkSubscription();
//   // }, []);

//   // useEffect(() => {
//   //   async function checkSubscription() {
//   //     try {
//   //       if (!('serviceWorker' in navigator)) return;

//   //       const registration = await navigator.serviceWorker.getRegistration();
//   //       if (!registration) {
//   //         setSubscribed(false);
//   //         return;
//   //       }

//   //       const subscription = await registration.pushManager.getSubscription();
//   //       setSubscribed(!!subscription);
//   //     } catch (error) {
//   //       console.error('Failed to check push subscription:', error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   checkSubscription();
//   // }, []);

//   useEffect(() => {
//     async function checkPushSubscription() {
//       try {
//         console.log('🔔 Checking notifications...');

//         if (!('serviceWorker' in navigator)) {
//           console.log('❌ Service workers not supported');
//           return;
//         }

//         if (!('PushManager' in window)) {
//           console.log('❌ PushManager not supported');
//           return;
//         }

//         const registration =
//           await navigator.serviceWorker.getRegistration('/sw.js');

//         console.log('SW registration:', registration);

//         if (!registration) {
//           console.log('No SW registration yet');
//           return;
//         }

//         const subscription = await registration.pushManager.getSubscription();

//         console.log('Existing subscription:', subscription);

//         if (subscription) {
//           setSubscribed(true);
//         }
//       } catch (error) {
//         console.error('❌ Failed to check push subscription:', error);
//       } finally {
//         setChecking(false);
//       }
//     }

//     checkPushSubscription();
//   }, []);
//   async function handleEnable() {
//     setLoading(true);

//     try {
//       await subscribeToPush();

//       const registration = await navigator.serviceWorker.ready;
//       const subscription = await registration.pushManager.getSubscription();

//       setSubscribed(!!subscription);

//       toast.success('Push notifications enabled');
//     } catch (err: any) {
//       toast.error(err?.message ?? 'Failed to enable notifications');
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return (
//       <span className='font-mono text-xs text-white/40'>
//         Checking notifications...
//       </span>
//     );
//   }

//   if (subscribed) {
//     return (
//       <span className='font-mono text-xs text-emerald-400'>
//         ● Push notifications enabled
//       </span>
//     );
//   }

//   return (
//     <button
//       onClick={handleEnable}
//       disabled={loading}
//       className='rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400/20'
//     >
//       🔔 Enable push notifications
//     </button>
//   );
// }

export function PushNotificationToggle() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkPushSubscription() {
      try {
        console.log('🔔 Checking existing push subscription...');

        if (!('serviceWorker' in navigator)) {
          console.log('❌ Service workers not supported');
          return;
        }

        if (!('PushManager' in window)) {
          console.log('❌ PushManager not supported');
          return;
        }

        // IMPORTANT:
        // Do NOT call Notification.requestPermission() here.
        const permission = Notification.permission;

        console.log('Notification permission:', permission);

        // Get existing SW registration only.
        const registration =
          await navigator.serviceWorker.getRegistration('/sw.js');

        console.log('SW registration:', registration);

        if (!registration) {
          console.log('No SW registration yet');
          return;
        }

        const subscription = await registration.pushManager.getSubscription();

        console.log('Existing subscription:', subscription);

        setSubscribed(!!subscription);
      } catch (error) {
        console.error('❌ Failed to check push subscription:', error);
      } finally {
        setChecking(false);
      }
    }

    checkPushSubscription();
  }, []);

  async function handleEnable() {
    setLoading(true);

    try {
      // Permission request happens here,
      // because this function is triggered by the button click.
      await subscribeToPush();

      const registration =
        await navigator.serviceWorker.getRegistration('/sw.js');

      const subscription = await registration?.pushManager.getSubscription();

      setSubscribed(!!subscription);

      if (subscription) {
        toast.success('Push notifications enabled');
      } else {
        throw new Error('Push subscription was not created');
      }
    } catch (err: any) {
      console.error('❌ Push enable failed:', err);

      toast.error(err?.message ?? 'Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <span className='font-mono text-xs text-white/40'>
        Checking notifications...
      </span>
    );
  }

  if (subscribed) {
    return (
      <span className='font-mono text-xs text-emerald-400'>
        ● Push notifications enabled
      </span>
    );
  }

  return (
    <button
      onClick={handleEnable}
      disabled={loading}
      className='rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400/20 disabled:opacity-50'
    >
      {loading ? 'Enabling...' : '🔔 Enable push notifications'}
    </button>
  );
}
