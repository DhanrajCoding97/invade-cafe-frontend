'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { StationRow, StationType } from '@/types';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import {
  useCreateStation,
  useUpdateStation,
} from '@/hooks/use-station-mutations';

const stationFormSchema = z.object({
  type: z.enum(['pc', 'ps5', 'racing', 'vr']),
  name: z.string().min(1),
  hourly_rate: z.coerce.number().min(0),
  max_players: z.coerce.number().min(1),
  // cafe_location: z.string().min(1).optional(),
  cpu: z.string().optional(),
  gpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
});

// Input = what the form fields actually hold before coercion (hourly_rate/max_players can be string|number)
type StationFormInput = z.input<typeof stationFormSchema>;
// Output = what you get after zod parses/coerces (hourly_rate/max_players are guaranteed number)
type StationFormOutput = z.output<typeof stationFormSchema>;

const TYPE_OPTIONS: { value: StationType; label: string }[] = [
  { value: 'pc', label: 'PC' },
  { value: 'ps5', label: 'PS5' },
  { value: 'racing', label: 'Racing Sim' },
  { value: 'vr', label: 'VR' },
];

export default function StationForm({
  station,
  onSuccess,
}: {
  station?: StationRow;
  onSuccess?: () => void;
}) {
  const createMutation = useCreateStation();
  const updateMutation = useUpdateStation();
  const submitting = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StationFormInput, any, StationFormOutput>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: {
      type: station?.type ?? 'pc',
      name: station?.name ?? '',
      hourly_rate: station?.hourly_rate ?? 0,
      max_players: station?.max_players ?? 1,
      // cafe_location: station?.cafe_location ?? 'main',
      cpu: station?.specs?.cpu ?? '',
      gpu: station?.specs?.gpu ?? '',
      ram: station?.specs?.ram ?? '',
      storage: station?.specs?.storage ?? '',
    },
  });
  const selectedType = watch('type');

  function onSubmit(values: StationFormOutput) {
    const hasSpecs = values.cpu || values.gpu || values.ram || values.storage;
    const payload = {
      type: values.type,
      name: values.name,
      hourly_rate: values.hourly_rate,
      max_players: values.max_players,
      cafe_location: 'main',
      specs:
        values.type === 'pc' && hasSpecs
          ? {
              cpu: values.cpu,
              gpu: values.gpu,
              ram: values.ram,
              storage: values.storage,
            }
          : null,
    };

    if (station) {
      updateMutation.mutate(
        { id: station.id, payload },
        {
          onSuccess: () => {
            onSuccess?.();
            toast.success('Station added');
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess?.();
          toast.success('Station added');
        },
      });
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Controller
        name='type'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='type'>Type</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='name'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='name'>Station name</FieldLabel>
            <Input
              {...field}
              id='name'
              placeholder='PC-07'
              autoComplete='off'
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className='grid grid-cols-2 gap-4'>
        <Controller
          name='hourly_rate'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='hourly_rate'>Hourly rate (₹)</FieldLabel>
              <Input
                {...field}
                value={field.value as string | number}
                id='hourly_rate'
                type='number'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='max_players'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='max_players'>Max players</FieldLabel>
              <Input
                {...field}
                value={field.value as string | number}
                id='max_players'
                type='number'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {selectedType === 'pc' && (
        <div className='grid grid-cols-2 gap-4 rounded-md border border-cyan-400/15 p-3'>
          <Controller
            name='cpu'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='cpu'>CPU</FieldLabel>
                <Input {...field} id='cpu' placeholder='Ryzen 5 5600X' />
              </Field>
            )}
          />
          <Controller
            name='gpu'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='gpu'>GPU</FieldLabel>
                <Input {...field} id='gpu' placeholder='RTX 4060' />
              </Field>
            )}
          />
          <Controller
            name='ram'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='ram'>RAM</FieldLabel>
                <Input {...field} id='ram' placeholder='16GB' />
              </Field>
            )}
          />
          <Controller
            name='storage'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='storage'>Storage</FieldLabel>
                <Input {...field} id='storage' placeholder='512GB NVMe' />
              </Field>
            )}
          />
        </div>
      )}

      <Button
        type='submit'
        disabled={submitting}
        className='mt-2 rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300 disabled:opacity-50'
      >
        {submitting ? 'Saving...' : station ? 'Save changes' : 'Add station'}
      </Button>
    </form>
  );
}
