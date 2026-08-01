// components/games/GameForm.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import GameImageDropzone from './GameImageDropzone';
import { useGameMutations } from '@/hooks/use-games-mutation';
import type { GameRow, GameCategory } from '@/types/index';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
const gameFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['ps5', 'pc', 'vr', 'racing']),
  image_url: z.string().min(1, 'Cover image is required'),
  tags: z.array(z.string()).min(1, 'Select at least one tag'), // was z.string()
  featured: z.boolean(),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

interface GameFormProps {
  game?: GameRow;
  onSuccess?: () => void;
}

export const tagsList = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'fps', label: 'FPS' },
  { value: 'racing', label: 'Racing' },
  { value: 'sports', label: 'Sports' },
  { value: 'rpg', label: 'RPG' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'simulation', label: 'Simulation' },
  { value: 'fighting', label: 'Fighting' },
  { value: 'horror', label: 'Horror' },
  { value: 'open-world', label: 'Open World' },
  { value: 'survival', label: 'Survival' },
  { value: 'battle-royale', label: 'Battle Royale' },
  { value: 'multiplayer', label: 'Multiplayer' },
  { value: 'casual', label: 'Casual' },
];

const CATEGORY_OPTIONS: { value: GameCategory; label: string }[] = [
  { value: 'ps5', label: 'PS5' },
  { value: 'pc', label: 'PC' },
  { value: 'vr', label: 'VR' },
  { value: 'racing', label: 'Racing' },
];

export default function GameForm({ game, onSuccess }: GameFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: game?.title ?? '',
      category: game?.category ?? undefined,
      image_url: game?.image_url ?? '',
      tags: game?.tags ?? [],
      featured: game?.featured ?? false,
    },
  });

  const { createMutation, updateMutation } = useGameMutations();

  async function onSubmit(values: GameFormValues) {
    const payload = {
      title: values.title,
      category: values.category,
      image_url: values.image_url,
      tags: values.tags,
      featured: values.featured,
    };

    try {
      if (game) {
        await updateMutation.mutateAsync({
          id: game.id,
          input: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  }
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 '>
      <Controller
        name='image_url'
        control={control}
        render={({ field, fieldState }) => (
          <GameImageDropzone
            value={field.value}
            onChange={field.onChange}
            invalid={fieldState?.invalid}
          />
        )}
      />
      {errors.image_url && (
        <p className='text-xs text-red-400'>{errors.image_url.message}</p>
      )}
      <Controller
        name='title'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='customerName'>Title</FieldLabel>
            <Input
              {...field}
              id='title'
              aria-invalid={fieldState.invalid}
              placeholder='Valorant'
              autoComplete='off'
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name='category'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='category'>Category</FieldLabel>

            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>

              <SelectContent>
                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name='tags'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='tags'>Tags</FieldLabel>
            <MultiSelect
              options={tagsList}
              defaultValue={field.value} // not value={field.value}
              onValueChange={field.onChange}
              placeholder='Choose Tags...'
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name='featured'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className='flex items-center gap-3'>
              <Checkbox
                id='startNow'
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
                className='
                      border-[#28F1FF]/40
                      data-[state=checked]:bg-[#28F1FF]
                      data-[state=checked]:border-[#28F1FF]
                      data-[state=checked]:text-black
                      '
              />
              <FieldLabel
                htmlFor='featured'
                className='cursor-pointer text-xs text-white/60 tracking-tighter'
              >
                Mark as featured game
              </FieldLabel>
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <button
        type='submit'
        disabled={isSubmitting}
        className='mt-2 rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300 disabled:opacity-50'
      >
        {isSubmitting ? 'Saving...' : game ? 'Save changes' : 'Add game'}
      </button>
    </form>
  );
}
