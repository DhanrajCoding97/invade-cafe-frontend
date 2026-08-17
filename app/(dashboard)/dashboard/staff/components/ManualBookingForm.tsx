'use client';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import { useAvailableStations } from '@/hooks/UseAvailableStation';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import {
  manualBookingSchema,
  type ManualBookingValues,
} from '@/lib/schemas/ManualBookingFormSchema';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, TriangleAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';
import {
  createManualBooking,
  updateManualBooking,
} from '../actions/booking-action';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { WheelTimePicker } from '@/components/wheel-picker-time-input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useCafeSettings } from '@/hooks/use-cafe-settings';
import { getErrorMessages } from '@/lib/get-error-message';
import { Station } from '@/types';

type Device = z.infer<typeof manualBookingSchema>['device'];
type PAYMENT_METHOD = z.infer<typeof manualBookingSchema>['paymentMethod'];

const PAYMENT_METHODS: { value: PAYMENT_METHOD; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi_manual', label: 'upi' },
  { value: 'complimentary', label: 'complimentary' },
];

const DEVICES: { value: Device; label: string }[] = [
  { value: 'pc', label: 'PC' },
  { value: 'ps5', label: 'PS5' },
  { value: 'racing', label: 'Racing Sim' },
  { value: 'vr', label: 'VR' },
];

function nowDateAndTime() {
  const now = new Date();
  const startTime = now.toTimeString().slice(0, 5);
  return { date: now, startTime };
}

interface ManualBookingFormProps {
  mode: 'create' | 'edit';
  bookingId?: string;
  defaultValues?: Partial<ManualBookingValues>;
  isOnlineBooking?: boolean;
  onSuccess?: (bookingId: string) => void;
}

// export default function ManualBookingForm({
//   mode,
//   bookingId,
//   defaultValues,
//   isOnlineBooking,
//   onSuccess,
// }: ManualBookingFormProps) {
//   const queryClient = useQueryClient();
//   const [submitting, setSubmitting] = useState(false);
//   const [serverError, setServerError] = useState<string | null>(null);
//   const { startTime: nowTime } = nowDateAndTime();
//   const [open, setOpen] = useState(false);

//   const lockStructuralFields = mode === 'edit' && isOnlineBooking;

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<ManualBookingValues>({
//     resolver: zodResolver(manualBookingSchema),
//     defaultValues: defaultValues ?? {
//       customerName: '',
//       customerPhone: '',
//       device: 'pc',
//       duration: 1,
//       stationId: '',
//       players: 1,
//       tier: 'single',
//       startNow: mode === 'create',
//       date: new Date(),
//       startTime: nowTime,
//       paymentMethod: 'cash',
//     },
//   });

//   const startNow = watch('startNow');
//   const stationId = watch('stationId');

//   const device = watch('device');
//   const tier = watch('tier');
//   const paymentMethod = watch('paymentMethod');
//   const watchedDate = watch('date');
//   const watchedStartTime = watch('startTime');
//   const debouncedStartTime = useDebouncedValue(watchedStartTime, 400);

//   const showPlayersSelect = device === 'ps5';
//   const showTierSelect = device === 'racing';

//   const playersValue = Number(watch('players')) || 1;
//   const durationValue = Number(watch('duration')) || 0;
//   const rawAmountOverride = watch('amountOverride');

//   const dateStr = watchedDate ? format(watchedDate, 'yyyy-MM-dd') : '';
//   const watchedDevice = watch('device');
//   const { data: stations = [], isLoading: stationsLoading } =
//     useAvailableStations({
//       device: watchedDevice,
//       date: dateStr,
//       startTime: debouncedStartTime,
//       duration: durationValue,
//       excludeBookingId: mode === 'edit' ? bookingId : undefined,
//     });

//   const stationsForDevice = useMemo(
//     () =>
//       stations.filter((station) =>
//         device === 'vr' ? station.type === 'ps5' : station.type === device,
//       ),
//     [stations, device],
//   );

//   const noStationsAvailable =
//     !stationsLoading && stationsForDevice.length === 0;

//   const selectedStation = stationsForDevice.find((s) => s.id === stationId);
//   const rate = selectedStation
//     ? getDisplayRate({
//         device,
//         players: playersValue,
//         tier,
//         fallbackRate: selectedStation.hourly_rate,
//       })
//     : 0;
//   const computedTotal = calculateTotal(rate, durationValue);
//   const displayTotal =
//     paymentMethod === 'complimentary'
//       ? 0
//       : rawAmountOverride !== undefined
//         ? rawAmountOverride
//         : computedTotal;

//   async function onSubmit(values: ManualBookingValues) {
//     setSubmitting(true);
//     setServerError(null);
//     try {
//       if (mode === 'create') {
//         const newId = await createManualBooking(values);
//         onSuccess?.(newId);
//       } else {
//         await updateManualBooking(bookingId!, values);
//         onSuccess?.(bookingId!);
//       }
//     } catch (err) {
//       setServerError(
//         err instanceof Error ? err.message : 'Something went wrong',
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // Keep date/time pinned to "now" while startNow is checked
//   useEffect(() => {
//     if (startNow) {
//       const { date, startTime } = nowDateAndTime();
//       setValue('date', date);
//       setValue('startTime', startTime);
//     }
//   }, [startNow, setValue]);

//   //device → reset tier/players
//   useEffect(() => {
//     if (device === 'ps5') {
//       setValue('tier', undefined);
//     } else if (device === 'racing') {
//       setValue('players', 1);
//     } else {
//       // pc or vr
//       setValue('players', 1);
//       setValue('tier', undefined);
//     }
//   }, [device, setValue]);

//   useEffect(() => {
//     if (stationsLoading) return;
//     if (stationId && !stationsForDevice.some((s) => s.id === stationId)) {
//       setValue('stationId', '');
//     }
//   }, [stationsForDevice, stationId, stationsLoading, setValue]);

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className={cn(
//         'flex flex-col gap-4',
//         mode === 'create' &&
//           'rounded-xl border border-white/10 bg-white/3 p-5 w-full sm:max-w-3xl',
//       )}
//     >
//       <h3 className='text-lg font-bold text-white'>Manual Walk-in Booking</h3>
//       <FieldGroup>
//         {/* Customer details */}
//         <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//           <Controller
//             name='customerName'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <FieldLabel htmlFor='customerName'>Customer name</FieldLabel>
//                 <Input
//                   {...field}
//                   id='customerName'
//                   aria-invalid={fieldState.invalid}
//                   placeholder='John Doe'
//                   autoComplete='off'
//                 />
//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//           {/* phone input */}
//           <Controller
//             name='customerPhone'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <FieldLabel htmlFor='customerPhone'>Customer Phone</FieldLabel>

//                 <PhoneInput
//                   placeholder='8454994242'
//                   id='customerPhone'
//                   defaultCountry='IN'
//                   value={field.value}
//                   onChange={field.onChange}
//                   onBlur={field.onBlur}
//                   name={field.name}
//                 />

//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//         </div>

//         {/* Device / tier / players / duration */}
//         <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//           <Controller
//             name='device'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <FieldLabel htmlFor='device'>Select Device</FieldLabel>

//                 <Select
//                   value={field.value}
//                   onValueChange={field.onChange}
//                   disabled={lockStructuralFields}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder='Select device' />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {DEVICES.map((device) => (
//                       <SelectItem key={device.value} value={device.value}>
//                         {device.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//           {/* if device is ps5 */}
//           {showPlayersSelect && (
//             <Controller
//               name='players'
//               control={control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor='players'>Number of players</FieldLabel>
//                   <Select
//                     value={String(field.value ?? 1)}
//                     onValueChange={(v) => field.onChange(Number(v))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder='Select players' />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {[1, 2, 3, 4].map((n) => (
//                         <SelectItem key={n} value={String(n)}>
//                           {n} {n === 1 ? 'player' : 'players'}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//           )}
//           {/* if device is racing Sim */}
//           {showTierSelect && (
//             <Controller
//               name='tier'
//               control={control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor='tier'>Mode</FieldLabel>
//                   <Select value={field.value} onValueChange={field.onChange}>
//                     <SelectTrigger>
//                       <SelectValue placeholder='Select mode' />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value='single'>Singleplayer</SelectItem>
//                       <SelectItem value='multiplayer'>Multiplayer</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   {fieldState.invalid && (
//                     <FieldError errors={[fieldState.error]} />
//                   )}
//                 </Field>
//               )}
//             />
//           )}
//           <Controller
//             name='duration'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <FieldLabel htmlFor='duration'>Duration</FieldLabel>

//                 <Input
//                   id='duration'
//                   type='number'
//                   value={field.value ?? ''}
//                   onChange={(e) => {
//                     const val = e.target.valueAsNumber;
//                     field.onChange(Number.isNaN(val) ? 0 : val);
//                   }}
//                   onBlur={field.onBlur}
//                   name={field.name}
//                   ref={field.ref}
//                   disabled={lockStructuralFields}
//                 />

//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//         </div>

//         {/* Station */}
//         <Controller
//           name='stationId'
//           control={control}
//           render={({ field, fieldState }) => (
//             <Field data-invalid={fieldState.invalid}>
//               <FieldLabel htmlFor='stationId'>Station</FieldLabel>
//               {stationsLoading ? (
//                 <Skeleton className='h-10 w-full rounded-md' />
//               ) : (
//                 <Select
//                   value={field.value}
//                   onValueChange={(value) => {
//                     console.log('Selected:', value);
//                     field.onChange(value);
//                   }}
//                   disabled={lockStructuralFields}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder='Select a free station' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {stationsForDevice.map((s) => (
//                       <SelectItem key={s.id} value={s.id}>
//                         {s.name} ({s.type})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//               {noStationsAvailable && (
//                 <p className='mt-2 text-xs text-amber-400'>
//                   No {device === 'vr' ? 'VR' : device.toUpperCase()} station is
//                   available for the selected time.
//                   <br />
//                   Choose a different start time to make an advance booking.
//                 </p>
//               )}
//               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//             </Field>
//           )}
//         />

//         {/* Timing */}
//         <div className='flex flex-col gap-2'>
//           <Controller
//             name='startNow'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <div className='flex items-center gap-3'>
//                   <Checkbox
//                     disabled={lockStructuralFields}
//                     id='startNow'
//                     checked={field.value}
//                     onCheckedChange={(checked) => field.onChange(!!checked)}
//                     className='
//                       border-[#28F1FF]/40
//                       data-[state=checked]:bg-[#28F1FF]
//                       data-[state=checked]:border-[#28F1FF]
//                       data-[state=checked]:text-black
//                       '
//                   />
//                   <FieldLabel
//                     htmlFor='startNow'
//                     className='cursor-pointer text-xs text-white/60'
//                   >
//                     Start session now
//                   </FieldLabel>
//                 </div>

//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//           {!startNow && (
//             <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//               <Controller
//                 name='date'
//                 control={control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel htmlFor='date' onClick={() => setOpen(true)}>
//                       Select date
//                     </FieldLabel>
//                     <Popover open={open} onOpenChange={setOpen}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           type='button'
//                           variant='outline'
//                           className='w-full justify-start text-left font-normal bg-slate-950 text-[#dddddd]'
//                           disabled={lockStructuralFields}
//                         >
//                           <CalendarIcon className='mr-2 h-4 w-4' />
//                           {field.value
//                             ? format(field.value, 'PPP')
//                             : 'Pick a date'}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className='w-auto p-0' align='start'>
//                         <Calendar
//                           mode='single'
//                           selected={field.value}
//                           onSelect={(d) => {
//                             field.onChange(d);
//                             setValue('startTime', ''); // reset time when date changes
//                           }}
//                           disabled={(d) =>
//                             d < new Date(new Date().setHours(0, 0, 0, 0))
//                           }
//                           autoFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     {fieldState.invalid && (
//                       <FieldError errors={[fieldState.error]} />
//                     )}
//                   </Field>
//                 )}
//               />
//               {/* start time */}
//               <Controller
//                 name='startTime'
//                 control={control}
//                 render={({ field }) => {
//                   const [open, setOpen] = useState(false);

//                   return (
//                     <Field>
//                       <FieldLabel htmlFor='startTime'>Start Time</FieldLabel>
//                       <Popover open={open} onOpenChange={setOpen}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             type='button'
//                             id='startTime'
//                             disabled={lockStructuralFields}
//                             variant='outline'
//                             onBlur={field.onBlur}
//                             className='w-full justify-start text-left font-normal bg-slate-950 text-[#dddddd]'
//                           >
//                             {field.value || 'Select start time'}
//                           </Button>
//                         </PopoverTrigger>

//                         <PopoverContent align='start' className='p-0'>
//                           <WheelTimePicker
//                             value={field.value}
//                             onChange={field.onChange}
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </Field>
//                   );
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Payment */}
//         <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//           <Controller
//             name='paymentMethod'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <FieldLabel htmlFor='device'>Select Payment method</FieldLabel>

//                 <Select
//                   value={field.value}
//                   onValueChange={field.onChange}
//                   disabled={lockStructuralFields}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder='Select method' />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {PAYMENT_METHODS.map((method) => (
//                       <SelectItem key={method.value} value={method.value}>
//                         {method.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//           {/* amount field */}
//           <Controller
//             name='amountOverride'
//             control={control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <FieldLabel htmlFor='amountOverride'>Amount</FieldLabel>

//                 <Input
//                   id='amountOverride'
//                   type='number'
//                   value={field.value ?? ''}
//                   onChange={(e) => {
//                     const val = e.target.valueAsNumber;
//                     field.onChange(Number.isNaN(val) ? 0 : val);
//                   }}
//                   onBlur={field.onBlur}
//                   name={field.name}
//                   ref={field.ref}
//                   disabled={
//                     paymentMethod === 'complimentary' || lockStructuralFields
//                   }
//                   placeholder={String(computedTotal)}
//                 />

//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//         </div>
//         {/* Notes */}
//         <Controller
//           name='notes'
//           control={control}
//           render={({ field, fieldState }) => (
//             <Field data-invalid={fieldState.invalid}>
//               <FieldLabel htmlFor='notes'>Notes</FieldLabel>
//               <Textarea
//                 placeholder='add notes here..'
//                 id='notes'
//                 cols={4}
//                 className='resize-none'
//               />

//               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//             </Field>
//           )}
//         />
//       </FieldGroup>
//       {serverError && <p className='text-sm text-red-400'>{serverError}</p>}
//       <div className='flex flex-col gap-5'>
//         {/* total display */}
//         <div className='mt-2 rounded-xl border border-[#28F1FF]/20 bg-[#28F1FF]/5 px-4 py-4'>
//           <div className='flex items-center justify-between'>
//             <span className='text-lg sm:text-xl lg:text-3xl font-bold text-[#28F1FF] uppercase tracking-wider'>
//               Total
//             </span>

//             <span className='text-lg sm:text-xl lg:text-3xl font-bold text-[#28F1FF]'>
//               ₹{displayTotal}
//             </span>
//           </div>
//         </div>
//         {lockStructuralFields && (
//           <p className='text-xs text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded px-3 py-2'>
//             This is a paid online booking. Station, device, date, time, and
//             duration are locked to protect the customer's payment record —
//             cancel and rebook if these need to change.
//           </p>
//         )}
//         <CornerCutButton
//           type='submit'
//           disabled={submitting}
//           color='cyan'
//           variant='outline'
//           hoverEffect='scan'
//           fullWidthOnMobile={true}
//           className='ml-auto'
//         >
//           {submitting
//             ? mode === 'create'
//               ? 'Creating...'
//               : 'Saving...'
//             : mode === 'create'
//               ? 'Create Booking'
//               : 'Save Changes'}
//         </CornerCutButton>
//       </div>
//     </form>
//   );
// }

// import { useEffect, useMemo, useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useQueryClient } from '@tanstack/react-query';
// import { format } from 'date-fns';
// import { CalendarIcon } from 'lucide-react';

// import { cn } from '@/lib/utils';
// import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { Skeleton } from '@/components/ui/skeleton';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { PhoneInput } from '@/components/ui/phone-input';
// import { WheelTimePicker } from '@/components/wheel-time-picker';
// import CornerCutButton from '@/components/corner-cut-button';

// --- keep your existing imports/paths for these ---
// manualBookingSchema, ManualBookingValues, DEVICES, PAYMENT_METHODS,
// nowDateAndTime, getDisplayRate, calculateTotal, createManualBooking,
// updateManualBooking, useAvailableStations, useDebouncedValue

/* ------------------------------------------------------------------ */
/* Presentation-only helpers (local to this file)                      */
/* ------------------------------------------------------------------ */

const fieldCls =
  'h-11 rounded-none border-[#28F1FF]/15 bg-[#070a0c] px-4 text-sm text-white ' +
  'placeholder:text-white/20 focus-visible:border-[#28F1FF] focus-visible:ring-1 ' +
  'focus-visible:ring-[#28F1FF]/40 disabled:opacity-40';

const microLabel =
  'font-mono text-[9px] uppercase tracking-widest text-[#28F1FF]/60';

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className='flex items-center gap-2'>
      <span className='font-mono text-[10px] text-[#28F1FF]'>[{index}]</span>
      <h2 className='text-[11px] font-bold uppercase tracking-widest text-white'>
        {title}
      </h2>
      <div className='h-px flex-1 bg-[#28F1FF]/10' />
    </div>
  );
}

function Chip({
  active,
  disabled,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-11 items-center justify-center border px-2 font-mono text-[10px] uppercase transition-colors',
        active
          ? 'border-[#28F1FF] bg-[#28F1FF]/10 text-[#28F1FF]'
          : 'border-[#28F1FF]/15 text-white/60 hover:border-[#28F1FF]/40',
        disabled && 'cursor-not-allowed opacity-30 hover:border-[#28F1FF]/15',
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

export default function ManualBookingForm({
  mode,
  bookingId,
  defaultValues,
  isOnlineBooking,
  onSuccess,
}: ManualBookingFormProps) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { startTime: nowTime } = nowDateAndTime();
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false); // hoisted out of render()
  const { data: cafeSettings } = useCafeSettings();

  const lockStructuralFields = mode === 'edit' && isOnlineBooking;

  // Helper to flatten nested error messages into a string array

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualBookingValues>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: defaultValues ?? {
      customerName: '',
      customerPhone: '',
      device: 'pc',
      duration: 1,
      stationId: '',
      players: 1,
      tier: 'single',
      startNow: mode === 'create',
      date: new Date(),
      startTime: nowTime,
      paymentMethod: 'cash',
    },
  });

  const startNow = watch('startNow');
  const stationId = watch('stationId');

  const device = watch('device');
  const tier = watch('tier');
  const paymentMethod = watch('paymentMethod');
  const watchedDate = watch('date');
  const watchedStartTime = watch('startTime');
  const debouncedStartTime = useDebouncedValue(watchedStartTime, 400);

  const showPlayersSelect = device === 'ps5';
  const showTierSelect = device === 'racing';

  const playersValue = Number(watch('players')) || 1;
  const durationValue = Number(watch('duration')) || 0;
  const rawAmountOverride = watch('amountOverride');

  const errorMessages = getErrorMessages(errors);
  const hasErrors = errorMessages.length > 0;

  const dateStr = watchedDate ? format(watchedDate, 'yyyy-MM-dd') : '';
  const watchedDevice = watch('device');
  const stationParams = useMemo(
    () => ({
      device,
      date: dateStr,
      startTime: watchedStartTime,
      duration: durationValue,
    }),
    [device, dateStr, watchedStartTime, durationValue],
  );

  const debouncedStationParams = useDebouncedValue(stationParams, 400);
  const { data, isLoading: stationsLoading } = useAvailableStations({
    ...debouncedStationParams,
    excludeBookingId: mode === 'edit' ? bookingId : undefined,
  });
  const EMPTY_STATIONS: Station[] = [];
  const stationsForDevice = data ?? EMPTY_STATIONS;

  // const stationsForDevice = useMemo(
  //   () =>
  //     stations.filter((station) =>
  //       device === 'vr' ? station.type === 'ps5' : station.type === device,
  //     ),
  //   [stations, device],
  // );

  const noStationsAvailable =
    !stationsLoading && stationsForDevice.length === 0;

  const selectedStation = stationsForDevice.find((s) => s.id === stationId);

  const rate =
    selectedStation && cafeSettings
      ? getDisplayRate({
          device,
          players: playersValue,
          tier,
          fallbackRate: selectedStation.hourly_rate,
          settings: cafeSettings,
        })
      : 0;
  const computedTotal = calculateTotal(rate, durationValue);
  const displayTotal =
    paymentMethod === 'complimentary'
      ? 0
      : rawAmountOverride !== undefined
        ? rawAmountOverride
        : computedTotal;

  async function onSubmit(values: ManualBookingValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      if (mode === 'create') {
        const newId = await createManualBooking(values);
        onSuccess?.(newId);
      } else {
        await updateManualBooking(bookingId!, values);
        onSuccess?.(bookingId!);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong',
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Keep date/time pinned to "now" while startNow is checked
  useEffect(() => {
    if (startNow) {
      const { date, startTime } = nowDateAndTime();
      setValue('date', date);
      setValue('startTime', startTime);
    }
  }, [startNow, setValue]);

  // device → reset tier/players
  useEffect(() => {
    if (device === 'ps5') {
      setValue('tier', undefined);
    } else if (device === 'racing') {
      setValue('players', 1);
    } else {
      setValue('players', 1);
      setValue('tier', undefined);
    }
  }, [device, setValue]);

  useEffect(() => {
    if (stationsLoading) return;
    if (stationId && !stationsForDevice.some((s) => s.id === stationId)) {
      setValue('stationId', '');
    }
  }, [stationsForDevice, stationId, stationsLoading, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'relative flex w-full flex-col bg-black sm:max-w-3xl',
        mode === 'create' && 'border border-[#28F1FF]/15',
      )}
    >
      {/* ---------- Sticky terminal header ---------- */}
      <header className='sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#28F1FF]/15 bg-black/80 px-4 backdrop-blur-md'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex size-8 shrink-0 items-center justify-center border border-[#28F1FF]/40'>
            <div className='size-3 animate-pulse bg-[#28F1FF]' />
          </div>
          <div className='min-w-0'>
            <h3 className='truncate text-[11px] font-bold tracking-widest text-[#28F1FF]'>
              {mode === 'create' ? 'ADD_BOOKING' : 'EDIT_BOOKING'}
            </h3>
            <p className='font-mono text-[8px] uppercase leading-none text-[#28F1FF]/50'>
              Operator: System_01
            </p>
          </div>
        </div>
        <span className='shrink-0 border border-[#28F1FF]/15 px-3 py-1 font-mono text-[10px] text-white/50'>
          WALK-IN
        </span>
      </header>

      <FieldGroup className='gap-8 p-4'>
        {/* ---------- 01 CUSTOMER_INFO ---------- */}
        <section className='space-y-4'>
          <SectionHeader index='01' title='Customer_Info' />

          <Controller
            name='customerName'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='customerName' className={microLabel}>
                  Full name
                </FieldLabel>
                <Input
                  {...field}
                  id='customerName'
                  aria-invalid={fieldState.invalid}
                  placeholder='John Doe'
                  autoComplete='off'
                  className={fieldCls}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='customerPhone'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='customerPhone' className={microLabel}>
                  Phone number
                </FieldLabel>
                <PhoneInput
                  placeholder='8454994242'
                  id='customerPhone'
                  defaultCountry='IN'
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </section>

        {/* ---------- 02 SESSION_CONFIG ---------- */}
        <section className='space-y-4'>
          <SectionHeader index='02' title='Session_Config' />

          {/* Device as segmented chips */}
          <Controller
            name='device'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className={microLabel}>Device</FieldLabel>
                <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                  {DEVICES.map((d) => (
                    <Chip
                      key={d.value}
                      active={field.value === d.value}
                      disabled={lockStructuralFields}
                      onClick={() => field.onChange(d.value)}
                    >
                      {d.label}
                    </Chip>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Players (ps5) / Tier (racing) */}
          {showPlayersSelect && (
            <Controller
              name='players'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className={microLabel}>Players</FieldLabel>
                  <div className='grid grid-cols-4 gap-2'>
                    {[1, 2, 3, 4].map((n) => (
                      <Chip
                        key={n}
                        active={Number(field.value ?? 1) === n}
                        onClick={() => field.onChange(n)}
                      >
                        {n}P
                      </Chip>
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {showTierSelect && (
            <Controller
              name='tier'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className={microLabel}>Mode</FieldLabel>
                  <div className='grid grid-cols-2 gap-2'>
                    <Chip
                      active={field.value === 'single'}
                      onClick={() => field.onChange('single')}
                    >
                      Singleplayer
                    </Chip>
                    <Chip
                      active={field.value === 'multiplayer'}
                      onClick={() => field.onChange('multiplayer')}
                    >
                      Multiplayer
                    </Chip>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {/* Station chip grid */}
          <Controller
            name='stationId'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className='flex items-end justify-between'>
                  <FieldLabel className={microLabel}>Select station</FieldLabel>
                  {!stationsLoading && (
                    <span className='font-mono text-[8px] uppercase text-white/30'>
                      {stationsForDevice.length} available
                    </span>
                  )}
                </div>

                {stationsLoading ? (
                  <div className='grid grid-cols-4 gap-2 sm:grid-cols-5'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className='h-11 rounded-none' />
                    ))}
                  </div>
                ) : (
                  <div className='grid grid-cols-4 gap-2 sm:grid-cols-5'>
                    {stationsForDevice.map((s) => (
                      <Chip
                        key={s.id}
                        active={field.value === s.id}
                        disabled={lockStructuralFields}
                        onClick={() => field.onChange(s.id)}
                        className='flex-col gap-0.5 leading-none'
                      >
                        <span className='truncate'>{s.name}</span>
                        <span className='text-[7px] opacity-50'>{s.type}</span>
                      </Chip>
                    ))}
                  </div>
                )}

                {noStationsAvailable && (
                  <div className='rounded-none flex items-start gap-2 px-2 py-4 bg-black/80 border border-amber-400'>
                    <TriangleAlert size={24} className='text-amber-400' />
                    <p className='text-[12px] sm:text-base leading-relaxed text-amber-400'>
                      No {device === 'vr' ? 'VR' : device.toUpperCase()}
                      &nbsp;station is available for the selected time.
                      &nbsp;Choose a different start time to make an advance
                      booking.
                    </p>
                  </div>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </section>

        {/* ---------- 03 TIMELINE ---------- */}
        <section className='space-y-4'>
          <SectionHeader index='03' title='Timeline' />

          <Controller
            name='startNow'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className='flex items-center justify-between border border-[#28F1FF]/15 bg-[#070a0c]/60 p-4'>
                  <div className='space-y-1'>
                    <FieldLabel htmlFor='startNow' className={microLabel}>
                      Start session now
                    </FieldLabel>
                    <p className='text-[8px] uppercase text-white/40'>
                      Auto-activate station upon submit
                    </p>
                  </div>
                  <Checkbox
                    disabled={lockStructuralFields}
                    id='startNow'
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                    className='size-6 rounded-none border-[#28F1FF]/40 data-[state=checked]:border-[#28F1FF] data-[state=checked]:bg-[#28F1FF] data-[state=checked]:text-black'
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {!startNow && (
              <>
                <Controller
                  name='date'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='date' className={microLabel}>
                        Date
                      </FieldLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            disabled={lockStructuralFields}
                            className={cn(
                              fieldCls,
                              'w-full justify-start font-mono text-xs uppercase',
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4 text-[#28F1FF]/70' />
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={(d) => {
                              field.onChange(d);
                              setValue('startTime', '');
                            }}
                            disabled={(d) =>
                              d < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            autoFocus
                            className='pointer-events-auto p-3'
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name='startTime'
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='startTime' className={microLabel}>
                        Start time
                      </FieldLabel>
                      <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type='button'
                            id='startTime'
                            disabled={lockStructuralFields}
                            variant='outline'
                            onBlur={field.onBlur}
                            className={cn(
                              fieldCls,
                              'w-full justify-start font-mono text-xs uppercase',
                            )}
                          >
                            {field.value || 'Select start time'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align='start' className='p-0'>
                          <WheelTimePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </Field>
                  )}
                />
              </>
            )}

            <Controller
              name='duration'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='duration' className={microLabel}>
                    Duration (hrs)
                  </FieldLabel>
                  <Input
                    id='duration'
                    type='number'
                    inputMode='numeric'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(val) ? 0 : val);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={lockStructuralFields}
                    className={cn(fieldCls, 'font-mono')}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </section>

        {/* ---------- 04 PAYMENT_METHOD ---------- */}
        <section className='space-y-4'>
          <SectionHeader index='04' title='Payment_Method' />

          <Controller
            name='paymentMethod'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className={microLabel}>Method</FieldLabel>
                <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                  {PAYMENT_METHODS.map((m) => (
                    <Chip
                      key={m.value}
                      active={field.value === m.value}
                      disabled={lockStructuralFields}
                      onClick={() => field.onChange(m.value)}
                    >
                      {m.label}
                    </Chip>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='amountOverride'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='amountOverride' className={microLabel}>
                  Override amount (₹)
                </FieldLabel>
                <Input
                  id='amountOverride'
                  type='number'
                  inputMode='decimal'
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.valueAsNumber;
                    field.onChange(Number.isNaN(val) ? 0 : val);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  disabled={
                    paymentMethod === 'complimentary' || lockStructuralFields
                  }
                  placeholder={String(computedTotal)}
                  className={cn(fieldCls, 'font-mono')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='notes'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='notes' className={microLabel}>
                  Notes / requirements
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  id='notes'
                  rows={3}
                  placeholder='...ENTRY_LOG'
                  className='resize-none rounded-none border-[#28F1FF]/15 bg-[#070a0c] p-4 text-sm text-white placeholder:text-white/20 focus-visible:border-[#28F1FF] focus-visible:ring-1 focus-visible:ring-[#28F1FF]/40'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {hasErrors && (
            <div className='rounded-none px-2 py-4 bg-black/80 border border-red-800'>
              <div className='flex'>
                <div className='shrink-0'>
                  {/* Optional: Error icon */}
                  <svg
                    className='h-5 w-5 text-red-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>
                    Please fix the following errors:
                  </h3>
                  <ul className='mt-2 text-sm text-red-700 list-disc list-inside space-y-1'>
                    {errorMessages.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        {serverError && (
          <p className='border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400'>
            {serverError}
          </p>
        )}

        {lockStructuralFields && (
          <p className='border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-500/80'>
            This is a paid online booking. Station, device, date, time, and
            duration are locked to protect the customer's payment record —
            cancel and rebook if these need to change.
          </p>
        )}
      </FieldGroup>

      {/* ---------- Sticky bottom total + submit ---------- */}
      <footer className='sticky bottom-0 z-40 p-4'>
        <div className='border p-2 border-[#28F1FF] bg-black/95 shadow-[0_-8px_32px_rgba(40,241,255,0.15)] backdrop-blur-xl'>
          <div className='flex flex-col gap-2 xm:flex-row items-stretch'>
            <div className='flex gap-2 items-center sm:items-start flex-1 sm:flex-col justify-center sm:border-r border-[#28F1FF]/20 px-4 py-3'>
              <span className='font-mono text-[10px] uppercase tracking-widest text-[#28F1FF]/60'>
                Total_Payable
              </span>
              <span className='text-xl font-bold leading-tight text-[#28F1FF]'>
                ₹{displayTotal}
              </span>
            </div>
            <CornerCutButton
              type='submit'
              disabled={submitting}
              color='cyan'
              variant='outline'
              hoverEffect='scan'
              fullWidthOnMobile={true}
              className='flex-[1.2] rounded-none border-0 text-[11px] tracking-widest disabled:cursor-not-allowed'
            >
              {submitting
                ? mode === 'create'
                  ? 'CREATING...'
                  : 'SAVING...'
                : mode === 'create'
                  ? 'CONFIRM_BOOKING'
                  : 'SAVE_CHANGES'}
            </CornerCutButton>
          </div>
          {/* <div className='h-0.5 w-full bg-[#28F1FF]/20'>
            <div className='h-full w-1/3 bg-[#28F1FF]' />
          </div> */}
        </div>
      </footer>
    </form>
  );
}
