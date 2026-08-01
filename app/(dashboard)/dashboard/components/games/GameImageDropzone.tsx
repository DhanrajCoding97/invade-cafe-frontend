// components/games/GameImageDropzone.tsx
'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ImageIcon, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface GameImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  invalid: boolean;
}

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB — matches bucket policy
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

async function convertToWebp(file: File, maxBytes: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported in this browser');
  ctx.drawImage(bitmap, 0, 0);

  const qualitySteps = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];

  for (const quality of qualitySteps) {
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', quality),
    );
    if (blob && blob.size <= maxBytes) return blob;
  }

  const scale = 0.75;
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const finalBlob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/webp', 0.6),
  );

  if (!finalBlob || finalBlob.size > maxBytes) {
    throw new Error(
      'Could not compress image under 1MB — try a smaller source image',
    );
  }

  return finalBlob;
}

export default function GameImageDropzone({
  value,
  onChange,
  invalid,
}: GameImageDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function uploadFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const webpBlob = await convertToWebp(file, MAX_SIZE_BYTES);

      const supabase = createClient();
      const path = `${crypto.randomUUID()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('game-covers')
        .upload(path, webpBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('game-covers').getPublicUrl(path);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      setFileName(`${baseName}.webp`);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  function handleRemove() {
    onChange('');
    setFileName(null);
    setError(null);
  }

  return (
    <div className='flex flex-col gap-3'>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          invalid
            ? 'border-red-500'
            : 'border-white/20 hover:border-cyan-400/50',
          dragging && 'bg-cyan-400/10',
          dragging && !invalid && 'border-cyan-400',
        )}
      >
        <input
          type='file'
          accept='image/jpeg,image/png,image/webp'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />

        {uploading ? (
          <Loader2 className='h-8 w-8 animate-spin text-cyan-400' />
        ) : (
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/5'>
            <ImageIcon className='h-6 w-6 text-white/40' />
          </div>
        )}

        <div>
          <p className='text-sm font-semibold text-white'>
            {uploading ? 'Converting & uploading...' : 'Upload cover image'}
          </p>
          <p className='mt-0.5 text-xs text-white/40'>
            JPEG, PNG, or WebP — auto-converted, max 1MB
          </p>
        </div>

        <span className='rounded-md border border-white/20 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-cyan-400/60'>
          Select image
        </span>
      </label>

      {error && <p className='text-xs text-red-400'>{error}</p>}

      {value && (
        <div className='relative w-24'>
          <div className='relative aspect-[3/4] overflow-hidden rounded-lg border border-cyan-400/40'>
            <Image src={value} alt='Cover' fill className='object-cover' />
            <button
              type='button'
              onClick={handleRemove}
              className='absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white hover:bg-black'
            >
              <X className='h-3 w-3' />
            </button>
          </div>
          {fileName && (
            <p
              className='mt-1 truncate text-[10px] text-white/50'
              title={fileName}
            >
              {fileName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
