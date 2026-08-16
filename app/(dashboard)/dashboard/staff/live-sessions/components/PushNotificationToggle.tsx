'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { subscribeToPush } from '@/lib/push-subscribe';
import { BellIcon } from '@/components/svgs';

export function PushNotificationToggle() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkPushSubscription() {
      try {
        if (!('serviceWorker' in navigator)) {
          return;
        }

        if (!('PushManager' in window)) {
          return;
        }

        // IMPORTANT:
        // Do NOT call Notification.requestPermission() here.
        const permission = Notification.permission;

        // Get existing SW registration only.
        const registration =
          await navigator.serviceWorker.getRegistration('/sw.js');

        if (!registration) {
          return;
        }

        const subscription = await registration.pushManager.getSubscription();
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
      <div className='px-4 py-2 border border-gray-500 flex items-center gap-2'>
        <span className='text-base text-gray-500'>
          Checking notifications...
        </span>
      </div>
    );
  }

  if (subscribed) {
    return (
      <div className='px-4 py-2 border border-gray-500 flex items-center gap-2'>
        <span className='text-base text-gray-500'>Push_Notifications:</span>
        <span className='text-green-400'>ON</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnable}
      disabled={loading}
      className='group p-2 flex items-center gap-2 border border-gray-500 text-base text-gray-500 disabled:opacity-50'
    >
      {loading ? 'Enabling...' : 'Enable push notifications'}
      <BellIcon className='h-4.5 w-4.5 group-hover:motion-preset-seesaw-lg' />
    </button>
  );
}
