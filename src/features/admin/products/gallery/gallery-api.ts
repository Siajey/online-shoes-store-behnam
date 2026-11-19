import { api } from "@/lib/api";
import { toProductDetail, type AdminProductDetailDto } from "../detail";
import { toStatus } from "../mappers";
import { toGalleryBody, type GalleryImage } from "./gallery";

/** پاسخ POST /admin/products/images/upload-url */
export type UploadTargetDto = {
  key: string;
  uploadUrl: string;
  method: "PUT";
  headers: Record<string, string>;
  expiresInSeconds: number;
  publicUrl: string;
};

export async function requestImageUpload(file: {
  type: string;
  size: number;
}): Promise<UploadTargetDto> {
  const { data } = await api.post<UploadTargetDto>("/admin/products/images/upload-url", {
    body: { contentType: file.type, sizeBytes: file.size },
  });
  return data;
}

/**
 * آپلود مستقیم به استوریج با آدرس امضاشده (بدون کوکی و بدون CSRF).
 * ⚠ باکت باید برای origin فرانت CORS با متدهای PUT و هدرهای لازم داشته باشد.
 */
export async function putToStorage(target: UploadTargetDto, file: Blob): Promise<void> {
  const res = await fetch(target.uploadUrl, {
    method: target.method,
    headers: target.headers,
    body: file,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
}

/** فایل را آپلود می‌کند و تصویر آماده‌ی افزودن به گالری را برمی‌گرداند. */
export async function uploadGalleryImage(file: File): Promise<GalleryImage> {
  const target = await requestImageUpload(file);
  await putToStorage(target, file);
  return { fileKey: target.key, url: target.publicUrl, altText: "" };
}

/** جایگزینی کل گالری (ترتیب آرایه = ترتیب نمایش). */
export async function saveGallery(productId: string, images: readonly GalleryImage[]) {
  const { data } = await api.put<AdminProductDetailDto>(
    `/admin/products/${encodeURIComponent(productId)}/gallery`,
    { body: toGalleryBody(images) },
  );
  return toProductDetail(data, toStatus).images;
}
