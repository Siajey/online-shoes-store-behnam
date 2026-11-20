import { api } from "@/lib/api";
import { toProductDetail, type AdminProductDetailDto } from "../detail";
import { toStatus } from "../mappers";
import { toGalleryBody, type GalleryImage } from "./gallery";

/**
 * پاسخ POST /admin/products/images/upload-url
 * - POST: «presigned POST» (فرم چندبخشی). فیلدهای امضاشده در fields می‌آید و فایل باید آخرین بخش فرم باشد.
 * - PUT: آپلود مستقیم با آدرس امضاشده و headers.
 */
export type UploadTargetDto = {
  key: string;
  uploadUrl: string;
  method: "POST" | "PUT";
  fields?: Record<string, string>;
  headers?: Record<string, string>;
  expiresInSeconds: number;
  publicUrl: string;
};

/** بک‌اند برای آپلود POST فیلدهای امضاشده (fields) را نفرستاده؛ بدون آن‌ها استوریج درخواست را رد می‌کند. */
export class MissingUploadFieldsError extends Error {
  constructor() {
    super("upload target has no fields");
    this.name = "MissingUploadFieldsError";
  }
}

/** استوریج درخواست را رد کرد (status) یا اصلاً جواب نداد (status=0؛ معمولاً CORS یا قطع شبکه). */
export class StorageUploadError extends Error {
  constructor(readonly status: number) {
    super(`upload failed: ${status}`);
    this.name = "StorageUploadError";
  }
}

async function send(url: string, init: RequestInit): Promise<void> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new StorageUploadError(0);
  }
  if (!res.ok) throw new StorageUploadError(res.status);
}

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
 * آپلود مستقیم به استوریج (بدون کوکی و بدون CSRF).
 * ⚠ باکت باید برای origin فرانت CORS داشته باشد (برای POST/PUT و هدرهای لازم).
 */
export async function putToStorage(target: UploadTargetDto, file: Blob): Promise<void> {
  if (target.method === "POST") {
    if (!target.fields) throw new MissingUploadFieldsError();
    const form = new FormData();
    for (const [name, value] of Object.entries(target.fields)) form.append(name, String(value));
    // استاندارد S3: فیلد file باید آخرین فیلد فرم باشد. Content-Type را مرورگر (با boundary) می‌گذارد.
    form.append("file", file);
    return send(target.uploadUrl, { method: "POST", body: form });
  }
  return send(target.uploadUrl, { method: "PUT", headers: target.headers, body: file });
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
