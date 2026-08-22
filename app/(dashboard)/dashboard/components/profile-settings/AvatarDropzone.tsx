'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { convertToWebp } from '@/lib/image-conversion';
import { cn } from '@/lib/utils';

interface AvatarDropzoneProps {
  value: string | null;
  userId: string;
  fallbackInitials: string;
}

export interface AvatarDropzoneHandle {
  /** Uploads the currently staged file (if any) and returns its public URL.
   *  Returns null if no new file was selected — caller should keep the existing value. */
  commitUpload: () => Promise<string | null>;
  clearStaged: () => void;
}

const MAX_SIZE_BYTES = 500 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AvatarDropzone = forwardRef<AvatarDropzoneHandle, AvatarDropzoneProps>(
  function AvatarDropzone({ value, userId, fallbackInitials }, ref) {
    const [dragging, setDragging] = useState(false);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function stageFile(file: File) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please upload a JPEG, PNG, or WebP image');
        return;
      }
      setError(null);
      setStagedFile(file);
      setPreview(URL.createObjectURL(file)); // local preview only — no upload yet
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) stageFile(file);
    }, []);

    useImperativeHandle(ref, () => ({
      async commitUpload() {
        if (!stagedFile) return null;

        const webpBlob = await convertToWebp(stagedFile, MAX_SIZE_BYTES);

        const supabase = createClient();
        const path = `${userId}/${crypto.randomUUID()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, webpBlob, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/webp',
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        setStagedFile(null);
        setPreview(null); // clear local preview — parent's `value` (the real URL) takes over on next render
        return data.publicUrl;
      },
      clearStaged() {
        setStagedFile(null);
        setPreview(null);
        setError(null);
      },
    }));

    const displaySrc = preview ?? value;

    return (
      <div className='flex items-center gap-5'>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative h-20 w-20 shrink-0 cursor-pointer rounded-full border-2 border-dashed transition-colors overflow-hidden',
            dragging
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-white/20 hover:border-cyan-400/50',
          )}
        >
          <input
            type='file'
            accept='image/jpeg,image/png,image/webp'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) stageFile(file);
            }}
          />

          {displaySrc ? (
            <img
              src={displaySrc}
              alt='Avatar'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-cyan-500/10 font-mono text-lg text-cyan-400'>
              {fallbackInitials}
            </div>
          )}

          <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100'>
            <Camera size={16} className='text-white' />
          </div>
        </label>

        <div>
          <p className='font-mono text-xs text-white/60'>
            {stagedFile
              ? 'Ready — click Save changes to upload'
              : 'Drag & drop or click to change'}
          </p>
          <p className='mt-1 font-mono text-[10px] text-white/30'>
            JPG, PNG, or WebP — auto-converted
          </p>
          {error && <p className='mt-1 text-[10px] text-red-400'>{error}</p>}
        </div>
      </div>
    );
  },
);

export default AvatarDropzone;
