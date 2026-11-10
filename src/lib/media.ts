/**
 * آدرس نمایشی تصویر از کلید ذخیره‌شده در بک‌اند (مثل products/x.webp).
 * بک‌اند فقط fileKey می‌دهد؛ آدرس پایه‌ی CDN از NEXT_PUBLIC_MEDIA_BASE_URL می‌آید.
 * بدون این متغیر تصویر نمایش داده نمی‌شود (placeholder دیده می‌شود).
 */
export function mediaUrl(fileKey: string | null | undefined): string | undefined {
  if (!fileKey) return undefined;
  if (/^https?:\/\//i.test(fileKey)) return fileKey;
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/+$/, "");
  if (!base) return undefined;
  return `${base}/${fileKey.replace(/^\/+/, "")}`;
}
