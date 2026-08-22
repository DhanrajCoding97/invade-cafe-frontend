'use client';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FieldLabel } from '@/components/ui/field';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Lock, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { type Profile } from '@/types';
import {
  fetchProfile,
  updateProfile,
  uploadAvatar,
} from '@/lib/queries/profile';
import AvatarDropzone, { type AvatarDropzoneHandle } from './AvatarDropzone';
import { useRouter } from 'next/navigation';
import { ProfileSettingsSkeleton } from '@/components/skeletons/ProfileSettingsSkeleton';

const fieldCls =
  'w-full bg-black/60 border border-cyan-500/20 rounded-md px-3 py-3 font-mono text-sm text-white ' +
  'focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-white/20 disabled:opacity-40';

function TextInput({
  register,
  name,
  disabled,
}: {
  register: any;
  name: keyof Profile;
  disabled?: boolean;
}) {
  return (
    <input
      {...register(name)}
      type='text'
      disabled={disabled}
      className={fieldCls}
    />
  );
}

function initials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ProfileSettingsForm() {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const avatarRef = useRef<AvatarDropzoneHandle>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<Profile>({
    values: data,
  });

  const avatarUrl = watch('avatar_url');

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
      router.refresh();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = async (values: Profile) => {
    setSavingAvatar(true);
    try {
      const uploadedUrl = await avatarRef.current?.commitUpload();
      mutation.mutate({
        full_name: values.full_name,
        phone: values.phone,
        avatar_url: uploadedUrl ?? values.avatar_url, // use newly uploaded URL, or keep existing
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Avatar upload failed');
    } finally {
      setSavingAvatar(false);
    }
  };
  //   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (!file || !data) return;

  //     // Instant local preview while the real upload happens in the background
  //     setAvatarPreview(URL.createObjectURL(file));
  //     setUploading(true);

  //     try {
  //       const publicUrl = await uploadAvatar(file, data.id);
  //       setValue('avatar_url', publicUrl, { shouldDirty: true });
  //     } catch (err) {
  //       toast.error(
  //         err instanceof Error ? err.message : 'Failed to upload avatar',
  //       );
  //       setAvatarPreview(null);
  //     } finally {
  //       setUploading(false);
  //     }
  //   };

  if (isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  return (
    <div className='@container w-full sm:max-w-3xl bg-[#080a0d] border border-cyan-500/10 rounded-2xl overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 py-5 border-b border-cyan-500/10'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center'>
            <User size={16} className='text-cyan-400' />
          </div>
          <div>
            <p className='font-mono text-sm text-white tracking-wider font-semibold'>
              PROFILE
            </p>
            <p className='font-mono text-[10px] text-white/40 tracking-wide'>
              YOUR_ACCOUNT_DETAILS
            </p>
          </div>
        </div>
        <span className='font-mono text-[10px] text-white/50 border border-white/15 rounded px-3 py-1.5 tracking-wide uppercase'>
          {data?.role}
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='px-6 py-6'>
        {/* Section 01 — AVATAR */}
        <div className='flex items-center gap-3 mb-6'>
          <span className='font-mono text-xs text-cyan-500'>[01]</span>
          <span className='font-mono text-xs text-white tracking-widest font-semibold'>
            AVATAR
          </span>
          <div className='flex-1 h-px bg-cyan-500/15' />
        </div>

        <div className='mb-8'>
          <AvatarDropzone
            ref={avatarRef}
            value={avatarUrl ?? null}
            userId={data?.id ?? ''}
            fallbackInitials={initials(data?.full_name ?? null)}
          />
        </div>

        {/* Section 02 — PERSONAL_INFO */}
        <div className='flex items-center gap-3 mb-6'>
          <span className='font-mono text-xs text-cyan-500'>[02]</span>
          <span className='font-mono text-xs text-white tracking-widest font-semibold'>
            PERSONAL_INFO
          </span>
          <div className='flex-1 h-px bg-cyan-500/15' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8'>
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <TextInput register={register} name='full_name' />
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <TextInput register={register} name='phone' />
          </div>
        </div>

        {/* Section 03 — ACCOUNT (read-only) */}
        <div className='flex items-center gap-3 mb-6'>
          <span className='font-mono text-xs text-cyan-500'>[03]</span>
          <span className='font-mono text-xs text-white tracking-widest font-semibold'>
            ACCOUNT
          </span>
          <div className='flex-1 h-px bg-cyan-500/15' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-5 @2xl:mb-8'>
          <div>
            <FieldLabel className='flex items-center gap-1.5'>
              <Lock size={10} />
              Email
            </FieldLabel>
            <input value={data?.email ?? ''} disabled className={fieldCls} />
          </div>
          <div>
            <FieldLabel>Member Since</FieldLabel>
            <input
              value={
                data?.created_at
                  ? format(new Date(data.created_at), 'dd MMM yyyy')
                  : '-'
              }
              disabled
              className={fieldCls}
            />
          </div>
        </div>

        {/* Footer — TIMELINE-style CTA bar */}
        <div className='flex flex-col overflow-hidden rounded-lg border border-cyan-500/30 @2xl:flex-row @2xl:items-center @2xl:justify-between'>
          <div className='px-4 py-3 @2xl:px-5 @2xl:py-4'>
            <p className='font-mono text-[10px] uppercase tracking-wide text-white/40'>
              Unsaved changes are not applied
            </p>
          </div>

          <div className='flex w-full border-t border-cyan-500/20 @2xl:w-auto @2xl:border-t-0'>
            <button
              type='button'
              onClick={() => {
                reset(data);
                avatarRef.current?.clearStaged();
              }}
              className='flex-1 px-4 py-3 font-mono text-xs tracking-wider text-white/50 transition-colors hover:text-white @2xl:flex-none @2xl:px-5 @2xl:py-4'
            >
              RESET
            </button>

            <button
              type='submit'
              disabled={mutation.isPending || savingAvatar}
              className='flex-1 border-l border-cyan-500/30 bg-cyan-500/10 px-4 py-3 font-mono text-xs tracking-wider text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50 @2xl:flex-none @2xl:px-6 @2xl:py-4 @2xl:text-sm'
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
              {mutation.isPending ? 'SAVING...' : 'SAVE_CHANGES'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
