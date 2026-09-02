// lib/send-push.ts
import webpush from 'web-push';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendPushToStaffAndOwners(payload: {
  title: string;
  body: string;
  url?: string;
}) {
  const admin = createServiceRoleClient();

  const { data: staffUsers } = await admin
    .from('profiles')
    .select('id')
    .in('role', ['owner', 'staff']);

  if (!staffUsers?.length) return;

  const { data: subs } = await admin
    .from('push_subscriptions')
    .select('*')
    .in(
      'user_id',
      staffUsers.map((u) => u.id),
    );

  if (!subs?.length) return;

  const results = await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        const result = await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload),
        );

        return result;
      } catch (err: any) {
        if (err.statusCode === 410) {
          await admin.from('push_subscriptions').delete().eq('id', sub.id);
        }

        throw err;
      }
    }),
  );
}
