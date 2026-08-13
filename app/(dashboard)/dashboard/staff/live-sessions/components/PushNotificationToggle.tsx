'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { subscribeToPush } from '@/lib/push-subscribe';

export function PushNotificationToggle() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function checkSubscription() {
  //     try {
  //       if (!('serviceWorker' in navigator)) return;

  //       const registration = await navigator.serviceWorker.ready;

  //       const subscription = await registration.pushManager.getSubscription();

  //       setSubscribed(!!subscription);
  //     } catch (error) {
  //       console.error('Failed to check push subscription:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   checkSubscription();
  // }, []);

  useEffect(() => {
    async function checkSubscription() {
      try {
        if (!('serviceWorker' in navigator)) return;

        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          setSubscribed(false);
          return;
        }

        const subscription = await registration.pushManager.getSubscription();
        setSubscribed(!!subscription);
      } catch (error) {
        console.error('Failed to check push subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSubscription();
  }, []);

  async function handleEnable() {
    setLoading(true);

    try {
      await subscribeToPush();

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setSubscribed(!!subscription);

      toast.success('Push notifications enabled');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to enable notifications');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
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
      className='rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-300 transition-colors hover:bg-cyan-400/20'
    >
      🔔 Enable push notifications
    </button>
  );
}
