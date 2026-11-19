/** منطق خالص گالری تصاویر محصول (بدون شبکه). سیاست‌ها از بک‌اند: jpeg/png/webp، حداکثر ۵ مگابایت، ۱۲ تصویر. */
export const GALLERY_LIMITS = {
  maxImages: 12,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  altMax: 255,
} as const;

export type GalleryImage = {
  /** کلید فایل در استوریج؛ همین به بک‌اند فرستاده می‌شود. */
  fileKey: string;
  /** آدرس کامل برای پیش‌نمایش */
  url?: string;
  altText: string;
};

export type FileProblem = "type" | "size" | "empty";

export function checkImageFile(file: { type: string; size: number }): FileProblem | null {
  if (file.size <= 0) return "empty";
  if (!(GALLERY_LIMITS.allowedTypes as readonly string[]).includes(file.type)) return "type";
  if (file.size > GALLERY_LIMITS.maxSizeBytes) return "size";
  return null;
}

/** چند تصویر دیگر جا دارد. */
export const remainingSlots = (count: number): number =>
  Math.max(0, GALLERY_LIMITS.maxImages - count);

/** جابه‌جایی یک تصویر یک خانه (dir=-1 به اول‌تر، +1 به آخرتر)؛ خارج از محدوده بدون تغییر. */
export function moveImage<T>(list: readonly T[], index: number, dir: -1 | 1): T[] {
  const to = index + dir;
  if (index < 0 || index >= list.length || to < 0 || to >= list.length) return [...list];
  const next = [...list];
  [next[index], next[to]] = [next[to] as T, next[index] as T];
  return next;
}

export const removeImage = <T>(list: readonly T[], index: number): T[] =>
  list.filter((_, i) => i !== index);

export function setAlt(
  list: readonly GalleryImage[],
  index: number,
  altText: string,
): GalleryImage[] {
  return list.map((img, i) => (i === index ? { ...img, altText } : img));
}

/** بدنه‌ی PUT /admin/products/:id/gallery؛ متن جایگزین خالی فرستاده نمی‌شود. */
export function toGalleryBody(list: readonly GalleryImage[]): {
  images: { fileKey: string; altText?: string }[];
} {
  return {
    images: list.map((i) => {
      const alt = i.altText.trim();
      return alt ? { fileKey: i.fileKey, altText: alt } : { fileKey: i.fileKey };
    }),
  };
}

export const sameGallery = (a: readonly GalleryImage[], b: readonly GalleryImage[]): boolean =>
  a.length === b.length &&
  a.every((x, i) => x.fileKey === b[i]?.fileKey && x.altText === b[i]?.altText);
