export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  /** Target max file size after compression (bytes). */
  maxSizeBytes?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

const DEFAULTS: CompressImageOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  maxSizeBytes: 750_000,
  mimeType: 'image/jpeg',
};

export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const { maxWidth, maxHeight, maxSizeBytes, mimeType } = { ...DEFAULTS, ...options };

  if (!file.type.startsWith('image/')) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, maxWidth! / bitmap.width, maxHeight! / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, mimeType!, quality);

  while (blob && blob.size > maxSizeBytes! && quality > 0.45) {
    quality -= 0.07;
    blob = await canvasToBlob(canvas, mimeType!, quality);
  }

  if (!blob || blob.size >= file.size) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.jpg`, {
    type: mimeType!,
    lastModified: Date.now(),
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

/** Match admin showcase specs so uploads stay small on strict VPS/nginx limits. */
export function compressOptionsForShowcaseSlot(slotKey: string): CompressImageOptions {
  if (slotKey.startsWith('model_')) {
    return { maxWidth: 1200, maxHeight: 1600, maxSizeBytes: 600_000 };
  }
  if (slotKey.startsWith('detail_') || slotKey.startsWith('macro_')) {
    return { maxWidth: 900, maxHeight: 900, maxSizeBytes: 450_000 };
  }
  if (slotKey.startsWith('flat_')) {
    return { maxWidth: 1000, maxHeight: 1250, maxSizeBytes: 550_000 };
  }
  return DEFAULTS;
}
