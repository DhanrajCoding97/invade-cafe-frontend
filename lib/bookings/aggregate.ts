// // import { type BookingRow } from '@/types';
// // export function aggregateBookingTotals(booking: BookingRow) {
// //   const extensions = booking.session_extensions ?? [];

// //   const extensionMinutes = extensions.reduce(
// //     (sum, ext) => sum + Number(ext.minutes),
// //     0,
// //   );
// //   const extensionAmount = extensions.reduce(
// //     (sum, ext) => sum + Number(ext.amount),
// //     0,
// //   );
// //   const hasPendingExtension = extensions.some(
// //     (ext) => ext.payment_status === 'pending',
// //   );

// //   const totalDurationHours =
// //     Number(booking.duration_hours ?? 0) + extensionMinutes / 60;
// //   const totalAmount = Number(booking.amount ?? 0) + extensionAmount;

// //   return { totalDurationHours, totalAmount, hasPendingExtension, extensions };
// // }
// import { type BookingRow } from '@/types';

// export function aggregateBookingTotals(booking: BookingRow) {
//   const extensions = booking.session_extensions ?? [];

//   const extensionMinutes = extensions.reduce(
//     (sum, ext) => sum + Number(ext.minutes),
//     0,
//   );

//   const extensionAmount = extensions.reduce(
//     (sum, ext) => sum + Number(ext.amount),
//     0,
//   );

//   const paidExtensionAmount = extensions
//     .filter((ext) => ext.payment_status === 'paid')
//     .reduce((sum, ext) => sum + Number(ext.amount), 0);

//   const pendingExtensionAmount = extensions
//     .filter((ext) => ext.payment_status === 'pending')
//     .reduce((sum, ext) => sum + Number(ext.amount), 0);

//   const hasPendingExtension = extensions.some(
//     (ext) => ext.payment_status === 'pending',
//   );

//   const totalDurationHours =
//     Number(booking.duration_hours ?? 0) + extensionMinutes / 60;

//   // Original booking + ALL extensions
//   const totalAmount = Number(booking.amount ?? 0) + extensionAmount;

//   // Original booking + only extensions already paid
//   const paidAmount = Number(booking.amount ?? 0) + paidExtensionAmount;

//   // Amount still outstanding from extensions
//   const pendingAmount = pendingExtensionAmount;

//   return {
//     extensions,
//     extensionMinutes,
//     extensionAmount,
//     paidExtensionAmount,
//     pendingExtensionAmount,
//     totalDurationHours,
//     totalAmount,
//     paidAmount,
//     pendingAmount,
//     hasPendingExtension,
//   };
// }
import { type BookingRow } from '@/types';

export function aggregateBookingTotals(booking: BookingRow) {
  const extensions = booking.session_extensions ?? [];

  const extensionMinutes = extensions.reduce(
    (sum, ext) => sum + Number(ext.minutes),
    0,
  );

  const extensionAmount = extensions.reduce(
    (sum, ext) => sum + Number(ext.amount),
    0,
  );

  const hasPendingExtension = extensions.some(
    (ext) => ext.payment_status === 'pending',
  );

  const totalDurationHours =
    Number(booking.duration_hours ?? 0) + extensionMinutes / 60;

  const totalAmount = Number(booking.amount ?? 0) + extensionAmount;

  // Original booking is paid only when booking.payment_status is paid
  const bookingPaidAmount =
    booking.payment_status === 'paid' ? Number(booking.amount ?? 0) : 0;

  // Only paid extensions count toward paid amount
  const paidExtensionAmount = extensions.reduce(
    (sum, ext) =>
      ext.payment_status === 'paid' ? sum + Number(ext.amount) : sum,
    0,
  );

  const paidAmount = bookingPaidAmount + paidExtensionAmount;

  const pendingAmount = Math.max(0, totalAmount - paidAmount);

  return {
    extensions,
    extensionMinutes,
    extensionAmount,
    totalDurationHours,
    totalAmount,
    paidAmount,
    pendingAmount,
    hasPendingExtension,
  };
}
