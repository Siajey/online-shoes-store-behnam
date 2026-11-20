import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MissingUploadFieldsError,
  putToStorage,
  StorageUploadError,
  type UploadTargetDto,
} from "./gallery-api";

const base: UploadTargetDto = {
  key: "products/a.webp",
  uploadUrl: "https://s3.test/bucket",
  method: "POST",
  expiresInSeconds: 300,
  publicUrl: "https://cdn.test/products/a.webp",
};
const file = new Blob(["x"], { type: "image/webp" });

afterEach(() => vi.unstubAllGlobals());

describe("putToStorage", () => {
  it("POST: فیلدهای امضاشده به ترتیب و فایل آخر فرم", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    vi.stubGlobal("fetch", fetchMock);
    await putToStorage(
      { ...base, fields: { key: "products/a.webp", "Content-Type": "image/webp" } },
      file,
    );
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://s3.test/bucket");
    expect(init.method).toBe("POST");
    expect(init.headers).toBeUndefined();
    const names = [...(init.body as FormData).keys()];
    expect(names).toEqual(["key", "Content-Type", "file"]);
  });

  it("POST بدون fields خطای مشخص می‌دهد و درخواستی نمی‌فرستد", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(putToStorage(base, file)).rejects.toBeInstanceOf(MissingUploadFieldsError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("PUT: با هدرهای امضاشده", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);
    await putToStorage({ ...base, method: "PUT", headers: { "Content-Type": "image/webp" } }, file);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("PUT");
    expect(init.headers).toEqual({ "Content-Type": "image/webp" });
  });

  it("پاسخ ناموفق استوریج خطا می‌دهد", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(putToStorage({ ...base, fields: { key: "k" } }, file)).rejects.toThrow("403");
  });

  it("خطای شبکه یا CORS با status صفر", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(putToStorage({ ...base, fields: { key: "k" } }, file)).rejects.toMatchObject({
      name: "StorageUploadError",
      status: 0,
    });
    expect(new StorageUploadError(403).status).toBe(403);
  });
});
