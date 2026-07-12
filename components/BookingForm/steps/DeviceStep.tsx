import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { VrIcon, PsIcon, RacingSimIcon, PcIcon } from '@/components/svgs';

const DEVICES = [
  { value: 'pc', label: 'PC gaming', sublabel: 'High-end PCs', icon: PcIcon },
  { value: 'ps5', label: 'PS5', sublabel: 'PlayStation 5', icon: PsIcon },
  { value: 'vr', label: 'PS VR2', sublabel: 'Virtual reality', icon: VrIcon },
  {
    value: 'racing',
    label: 'Racing sim',
    sublabel: 'Racing experience',
    icon: RacingSimIcon,
  },
] as const;

export default function DeviceStep() {
  const { control } = useFormContext();
  return (
    <div>
      <Controller
        name='device'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {/* <FieldLabel htmlFor='device'>
              What would you like to play on?
            </FieldLabel> */}
            <div className='grid grid-cols-2 gap-3 booking-station-grid'>
              {DEVICES.map(({ value, label, sublabel, icon: Icon }) => {
                const selected = field.value === value;
                return (
                  <button
                    key={value}
                    type='button'
                    onClick={() => field.onChange(value)}
                    aria-pressed={selected}
                    aria-invalid={fieldState.invalid}
                    className={[
                      'cursor-pointer min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all hover:border-cyan-400 hover:bg-cyan-400/5',
                      selected
                        ? 'border-cyan-400 bg-cyan-400/5'
                        : 'border-white/10',
                    ].join(' ')}
                  >
                    <Icon className='h-8 w-8 text-white' />
                    <span className='text-sm font-semibold text-white'>
                      {label}
                    </span>
                    <span className='text-xs text-white/50'>{sublabel}</span>
                  </button>
                );
              })}
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
