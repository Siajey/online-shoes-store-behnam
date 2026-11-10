import { afterEach, describe, expect, it, vi } from "vitest";
import { mediaUrl } from "./media";

describe("mediaUrl", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("کلید را به آدرس CDN تبدیل می‌کند", () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "https://cdn.example.com/");
    expect(mediaUrl("products/a.webp")).toBe("https://cdn.example.com/products/a.webp");
    expect(mediaUrl("/products/a.webp")).toBe("https://cdn.example.com/products/a.webp");
  });
  it("بدون آدرس پایه یا کلید: undefined", () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "");
    expect(mediaUrl("products/a.webp")).toBeUndefined();
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "https://cdn.example.com");
    expect(mediaUrl(null)).toBeUndefined();
  });
  it("آدرس کامل دست‌نخورده می‌ماند", () => {
    expect(mediaUrl("https://x.com/a.png")).toBe("https://x.com/a.png");
  });
});
