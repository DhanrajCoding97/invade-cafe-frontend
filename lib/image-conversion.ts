// lib/image-conversion.ts
export async function convertToWebp(
  file: File,
  maxBytes: number,
): Promise<Blob> {
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
      'Could not compress image under size limit — try a smaller source image',
    );
  }

  return finalBlob;
}
