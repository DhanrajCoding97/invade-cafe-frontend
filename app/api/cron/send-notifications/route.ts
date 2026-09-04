// // app/api/cron/send-notifications/route.ts
// import { NextResponse } from 'next/server';
// import webpush from 'web-push';
// import { createClient } from '@supabase/supabase-js';
// import { createServiceRoleClient } from '@/lib/supabase/service-role';
// // webpush.setVapidDetails(
// //   process.env.VAPID_SUBJECT!,
// //   process.env.VAPID_PUBLIC_KEY!,
// //   process.env.VAPID_PRIVATE_KEY!,
// // );

// // const supabase = createClient(
// //   process.env.SUPABASE_URL!,
// //   process.env.SUPABASE_SERVICE_ROLE_KEY!,
// // );

// const MESSAGES: Record<string, (b: any) => { title: string; body: string }> = {
//   new_booking: (b) => ({
//     title: 'New booking',
//     body: `${b.customer_name ?? 'Guest'} booked ${b.device} at ${b.start_time}`,
//   }),
//   upcoming_booking: (b) => ({
//     title: 'Booking starting soon',
//     body: `${b.customer_name ?? 'Guest'} starts in 10 min on ${b.device}`,
//   }),
//   session_not_started: (b) => ({
//     title: 'Session not started',
//     body: `${b.device} booking hasn't checked in yet`,
//   }),
//   session_ending: (b) => ({
//     title: 'Session ending soon',
//     body: `${b.device} session ends in 5 min`,
//   }),
//   session_ended: (b) => ({
//     title: 'Session ended',
//     body: `${b.device} session has ended`,
//   }),
//   booking_cancelled: (b) => ({
//     title: 'Booking cancelled',
//     body: `${b.customer_name ?? 'Guest'}'s booking was cancelled`,
//   }),
//   no_show: (b) => ({
//     title: 'No-show',
//     body: `${b.customer_name ?? 'Guest'} did not show up for ${b.device}`,
//   }),
// };

// // export async function POST(req: Request) {
// //   if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
// //     return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
// //   }

// //   const { data: pending, error } = await supabase
// //     .from('booking_notifications')
// //     .select(
// //       'id, event_type, attempts, bookings(customer_name, device, start_time, end_time)',
// //     )
// //     .eq('status', 'pending')
// //     .lt('attempts', 3)
// //     .limit(50);

// //   if (error)
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   if (!pending?.length) return NextResponse.json({ processed: 0 });

// //   const ids = pending.map((p) => p.id);
// //   await supabase
// //     .from('booking_notifications')
// //     .update({ status: 'processing' })
// //     .in('id', ids);

// //   const { data: subs } = await supabase.from('push_subscriptions').select('*');

// //   let sent = 0;
// //   for (const row of pending) {
// //     const booking = row.bookings as any;
// //     const build = MESSAGES[row.event_type];
// //     const payload = build
// //       ? build(booking)
// //       : { title: 'Booking update', body: row.event_type };

// //     let ok = false;
// //     let lastError = '';

// //     for (const sub of subs ?? []) {
// //       try {
// //         await webpush.sendNotification(
// //           {
// //             endpoint: sub.endpoint,
// //             keys: { p256dh: sub.p256dh, auth: sub.auth },
// //           },
// //           JSON.stringify(payload),
// //         );
// //         ok = true;
// //       } catch (err: any) {
// //         lastError = err.message;
// //         if (err.statusCode === 410 || err.statusCode === 404) {
// //           await supabase.from('push_subscriptions').delete().eq('id', sub.id);
// //         }
// //       }
// //     }

// //     if (ok) {
// //       await supabase
// //         .from('booking_notifications')
// //         .update({ status: 'sent', sent_at: new Date().toISOString(), payload })
// //         .eq('id', row.id);
// //       sent++;
// //     } else {
// //       await supabase
// //         .from('booking_notifications')
// //         .update({
// //           status: 'pending',
// //           attempts: row.attempts + 1,
// //           error: lastError,
// //         })
// //         .eq('id', row.id);
// //     }
// //   }

// //   return NextResponse.json({ processed: pending.length, sent });
// // }
// export async function POST(req: Request) {
//   if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
//     return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
//   }

//   const vapidSubject = process.env.VAPID_SUBJECT;
//   const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
//   const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

//   if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
//     console.error('Missing VAPID environment variables');

//     return NextResponse.json(
//       { error: 'VAPID configuration missing' },
//       { status: 500 },
//     );
//   }

//   webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

//   const admin = await createServiceRoleClient();

//   // 1. Grab a batch of pending rows, claim them immediately to avoid
//   //    double-send if the poller and an event-trigger nudge overlap.
//   const { data: pending, error: fetchError } = await admin
//     .from('booking_notifications')
//     .select(
//       'id, event_type, attempts, bookings(customer_name, device, start_time, end_time)',
//     )
//     .eq('status', 'pending')
//     .lt('attempts', 3)
//     .limit(50);

//   if (fetchError)
//     return NextResponse.json({ error: fetchError.message }, { status: 500 });
//   if (!pending?.length) return NextResponse.json({ processed: 0, sent: 0 });

//   const ids = pending.map((p) => p.id);
//   await admin
//     .from('booking_notifications')
//     .update({ status: 'processing' })
//     .in('id', ids);

//   // 2. Staff + owner subscriptions (same lookup as sendPushToStaffAndOwners)
//   const { data: staffUsers } = await admin
//     .from('profiles')
//     .select('id')
//     .in('role', ['owner', 'staff']);

//   const { data: subs } = staffUsers?.length
//     ? await admin
//         .from('push_subscriptions')
//         .select('*')
//         .in(
//           'user_id',
//           staffUsers.map((u) => u.id),
//         )
//     : { data: [] };

//   let sent = 0;

//   for (const row of pending) {
//     const booking = row.bookings as any;
//     const build = MESSAGES[row.event_type];
//     const payload = build
//       ? { ...build(booking), url: '/dashboard/staff' }
//       : {
//           title: 'Booking update',
//           body: row.event_type,
//           url: '/dashboard/staff',
//         };

//     if (!subs?.length) {
//       // no one to notify — mark sent so it doesn't retry forever
//       await admin
//         .from('booking_notifications')
//         .update({ status: 'sent', sent_at: new Date().toISOString(), payload })
//         .eq('id', row.id);
//       continue;
//     }

//     const results = await Promise.allSettled(
//       subs.map((sub) =>
//         webpush
//           .sendNotification(
//             {
//               endpoint: sub.endpoint,
//               keys: { p256dh: sub.p256dh, auth: sub.auth },
//             },
//             JSON.stringify(payload),
//           )
//           .catch(async (err: any) => {
//             if (err.statusCode === 410 || err.statusCode === 404) {
//               await admin.from('push_subscriptions').delete().eq('id', sub.id);
//             }
//             throw err;
//           }),
//       ),
//     );

//     const anySucceeded = results.some((r) => r.status === 'fulfilled');

//     if (anySucceeded) {
//       await admin
//         .from('booking_notifications')
//         .update({ status: 'sent', sent_at: new Date().toISOString(), payload })
//         .eq('id', row.id);
//       sent++;
//     } else {
//       const lastError = results
//         .map((r) => (r.status === 'rejected' ? r.reason?.message : null))
//         .filter(Boolean)
//         .join('; ');
//       await admin
//         .from('booking_notifications')
//         .update({
//           status: 'pending',
//           attempts: row.attempts + 1,
//           error: lastError,
//         })
//         .eq('id', row.id);
//     }
//   }

//   return NextResponse.json({ processed: pending.length, sent });
// }
// app/api/cron/send-notifications/route.ts
// import { NextResponse } from 'next/server';
// import webpush from 'web-push';
// import { createServiceRoleClient } from '@/lib/supabase/service-role';

// function resolveCustomerName(b: any): string {
//   // Manual/staff-created bookings store the name directly on the booking.
//   // Online (Razorpay/Google-auth) bookings have no customer_name — the
//   // identity lives on the linked profile instead.
//   return b.customer_name ?? b.profiles?.full_name ?? 'Guest';
// }

// const MESSAGES: Record<string, (b: any) => { title: string; body: string }> = {
//   new_booking: (b) => ({
//     title: 'New booking',
//     body: `${resolveCustomerName(b)} booked ${b.device} at ${b.start_time}`,
//   }),
//   upcoming_booking: (b) => ({
//     title: 'Booking starting soon',
//     body: `${resolveCustomerName(b)} starts in 10 min on ${b.device}`,
//   }),
//   session_not_started: (b) => ({
//     title: 'Session not started',
//     body: `${b.device} booking hasn't checked in yet`,
//   }),
//   session_ending: (b) => ({
//     title: 'Session ending soon',
//     body: `${b.device} session ends in 5 min`,
//   }),
//   session_ended: (b) => ({
//     title: 'Session ended',
//     body: `${b.device} session has ended`,
//   }),
//   booking_cancelled: (b) => ({
//     title: 'Booking cancelled',
//     body: `${resolveCustomerName(b)}'s booking was cancelled`,
//   }),
//   no_show: (b) => ({
//     title: 'No-show',
//     body: `${resolveCustomerName(b)} did not show up for ${b.device}`,
//   }),
// };

// export async function POST(req: Request) {
//   try {
//     if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
//       return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
//     }

//     const vapidSubject = process.env.VAPID_SUBJECT;
//     const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
//     const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

//     if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
//       console.error('Missing VAPID environment variables');
//       return NextResponse.json(
//         { error: 'VAPID configuration missing' },
//         { status: 500 },
//       );
//     }

//     webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

//     const admin = await createServiceRoleClient();

//     // 1. Grab a batch of pending rows, claim them immediately to avoid
//     //    double-send if the poller and an event-trigger nudge overlap.
//     const { data: pending, error: fetchError } = await admin
//       .from('booking_notifications')
//       .select(
//         `id, event_type, attempts,
//      bookings(customer_name, device, start_time, duration_hours, user_id, profiles(full_name))`,
//       )
//       .eq('status', 'pending')
//       .lt('attempts', 3)
//       .limit(50);
//     if (fetchError) {
//       console.error('Fetch pending notifications failed:', fetchError);
//       return NextResponse.json({ error: fetchError.message }, { status: 500 });
//     }
//     if (!pending?.length) return NextResponse.json({ processed: 0, sent: 0 });

//     const ids = pending.map((p) => p.id);
//     await admin
//       .from('booking_notifications')
//       .update({ status: 'processing' })
//       .in('id', ids);

//     // 2. Staff + owner subscriptions (same lookup as sendPushToStaffAndOwners)
//     const { data: staffUsers } = await admin
//       .from('profiles')
//       .select('id')
//       .in('role', ['owner', 'staff']);

//     const { data: subs } = staffUsers?.length
//       ? await admin
//           .from('push_subscriptions')
//           .select('*')
//           .in(
//             'user_id',
//             staffUsers.map((u) => u.id),
//           )
//       : { data: [] };

//     let sent = 0;

//     for (const row of pending) {
//       const booking = row.bookings as any;
//       const build = MESSAGES[row.event_type];
//       const payload = build
//         ? { ...build(booking), url: '/dashboard/staff' }
//         : {
//             title: 'Booking update',
//             body: row.event_type,
//             url: '/dashboard/staff',
//           };

//       if (!subs?.length) {
//         // no one to notify — mark sent so it doesn't retry forever
//         await admin
//           .from('booking_notifications')
//           .update({
//             status: 'sent',
//             sent_at: new Date().toISOString(),
//             payload,
//           })
//           .eq('id', row.id);
//         continue;
//       }

//       const results = await Promise.allSettled(
//         subs.map((sub) =>
//           webpush
//             .sendNotification(
//               {
//                 endpoint: sub.endpoint,
//                 keys: { p256dh: sub.p256dh, auth: sub.auth },
//               },
//               JSON.stringify(payload),
//             )
//             .catch(async (err: any) => {
//               if (err.statusCode === 410 || err.statusCode === 404) {
//                 await admin
//                   .from('push_subscriptions')
//                   .delete()
//                   .eq('id', sub.id);
//               }
//               throw err;
//             }),
//         ),
//       );

//       const anySucceeded = results.some((r) => r.status === 'fulfilled');

//       if (anySucceeded) {
//         await admin
//           .from('booking_notifications')
//           .update({
//             status: 'sent',
//             sent_at: new Date().toISOString(),
//             payload,
//           })
//           .eq('id', row.id);
//         sent++;
//       } else {
//         const lastError = results
//           .map((r) => (r.status === 'rejected' ? r.reason?.message : null))
//           .filter(Boolean)
//           .join('; ');
//         await admin
//           .from('booking_notifications')
//           .update({
//             status: 'pending',
//             attempts: row.attempts + 1,
//             error: lastError,
//           })
//           .eq('id', row.id);
//       }
//     }

//     return NextResponse.json({ processed: pending.length, sent });
//   } catch (err) {
//     console.error('SEND-NOTIFICATIONS ROUTE ERROR:', err);
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : 'Unknown error' },
//       { status: 500 },
//     );
//   }
// }
// app/api/cron/send-notifications/route.ts
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

function resolveCustomerName(b: any): string {
  return b.customer_name ?? b.profiles?.full_name ?? 'Guest';
}

function resolveStationLabel(b: any): string {
  const primaryName = b.stations?.name ?? b.device;
  return b.linkedStationName
    ? `${primaryName} + ${b.linkedStationName}`
    : primaryName;
}

const MESSAGES: Record<string, (b: any) => { title: string; body: string }> = {
  new_booking: (b) => ({
    title: 'New booking',
    body: `${resolveCustomerName(b)} booked ${resolveStationLabel(b)} at ${b.start_time}`,
  }),
  upcoming_booking: (b) => ({
    title: 'Booking starting soon',
    body: `${resolveCustomerName(b)} starts in 10 min on ${resolveStationLabel(b)}`,
  }),
  session_not_started: (b) => ({
    title: 'Session not started',
    body: `${resolveStationLabel(b)} booking hasn't checked in yet`,
  }),
  session_ending: (b) => ({
    title: 'Session ending soon',
    body: `${resolveStationLabel(b)} session ends in 5 min`,
  }),
  session_ended: (b) => ({
    title: 'Session ended',
    body: `${resolveStationLabel(b)} session has ended`,
  }),
  booking_cancelled: (b) => ({
    title: 'Booking cancelled',
    body: `${resolveCustomerName(b)}'s booking was cancelled`,
  }),
  no_show: (b) => ({
    title: 'No-show',
    body: `${resolveCustomerName(b)} did not show up for ${resolveStationLabel(b)}`,
  }),
};

export async function POST(req: Request) {
  try {
    if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const vapidSubject = process.env.VAPID_SUBJECT;
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
      console.error('Missing VAPID environment variables');
      return NextResponse.json(
        { error: 'VAPID configuration missing' },
        { status: 500 },
      );
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const admin = await createServiceRoleClient();

    // 1. Grab a batch of pending rows, claim them immediately to avoid
    //    double-send if the poller and an event-trigger nudge overlap.
    const { data: pending, error: fetchError } = await admin
      .from('booking_notifications')
      .select(
        `id, event_type, attempts,
     bookings(customer_name, device, start_time, duration_hours, user_id, group_id, station_id, stations(name), profiles(full_name))`,
      )
      .eq('status', 'pending')
      .lt('attempts', 3)
      .limit(50);
    if (fetchError) {
      console.error('Fetch pending notifications failed:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (!pending?.length) return NextResponse.json({ processed: 0, sent: 0 });

    const ids = pending.map((p) => p.id);
    await admin
      .from('booking_notifications')
      .update({ status: 'processing' })
      .in('id', ids);

    // 1b. For group bookings (racing multiplayer combo), fetch the linked
    // secondary station's name so notifications can say "PC1 + PC2" instead
    // of just the primary station.
    const groupIds = [
      ...new Set(
        pending
          .map((p) => (p.bookings as any)?.group_id)
          .filter((id): id is string => !!id),
      ),
    ];

    const linkedNameByGroupId = new Map<string, string>();
    if (groupIds.length) {
      const { data: secondaryRows } = await admin
        .from('bookings')
        .select('group_id, stations(name)')
        .in('group_id', groupIds)
        .eq('is_group_primary', false);

      (secondaryRows ?? []).forEach((r: any) => {
        if (r.group_id && r.stations?.name) {
          linkedNameByGroupId.set(r.group_id, r.stations.name);
        }
      });
    }

    // 2. Staff + owner subscriptions (same lookup as sendPushToStaffAndOwners)
    const { data: staffUsers } = await admin
      .from('profiles')
      .select('id')
      .in('role', ['owner', 'staff']);

    const { data: subs } = staffUsers?.length
      ? await admin
          .from('push_subscriptions')
          .select('*')
          .in(
            'user_id',
            staffUsers.map((u) => u.id),
          )
      : { data: [] };

    let sent = 0;

    for (const row of pending) {
      const booking = row.bookings as any;
      if (booking?.group_id) {
        booking.linkedStationName =
          linkedNameByGroupId.get(booking.group_id) ?? null;
      }

      const build = MESSAGES[row.event_type];
      const payload = build
        ? { ...build(booking), url: '/dashboard/staff' }
        : {
            title: 'Booking update',
            body: row.event_type,
            url: '/dashboard/staff',
          };

      if (!subs?.length) {
        await admin
          .from('booking_notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            payload,
          })
          .eq('id', row.id);
        continue;
      }

      const results = await Promise.allSettled(
        subs.map((sub) =>
          webpush
            .sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth },
              },
              JSON.stringify(payload),
            )
            .catch(async (err: any) => {
              if (err.statusCode === 410 || err.statusCode === 404) {
                await admin
                  .from('push_subscriptions')
                  .delete()
                  .eq('id', sub.id);
              }
              throw err;
            }),
        ),
      );

      const anySucceeded = results.some((r) => r.status === 'fulfilled');

      if (anySucceeded) {
        await admin
          .from('booking_notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            payload,
          })
          .eq('id', row.id);
        sent++;
      } else {
        const lastError = results
          .map((r) => (r.status === 'rejected' ? r.reason?.message : null))
          .filter(Boolean)
          .join('; ');
        await admin
          .from('booking_notifications')
          .update({
            status: 'pending',
            attempts: row.attempts + 1,
            error: lastError,
          })
          .eq('id', row.id);
      }
    }

    return NextResponse.json({ processed: pending.length, sent });
  } catch (err) {
    console.error('SEND-NOTIFICATIONS ROUTE ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
