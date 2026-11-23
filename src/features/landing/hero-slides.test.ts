import { describe, expect, it } from "vitest";
import { ASIDE_TILES, HERO_SLIDES, activeSlides, stepIndex } from "./hero-slides";

describe("hero slides", () => {
  it("شناسه‌ها یکتا و فیلدها پر هستند", () => {
    const ids = HERO_SLIDES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of HERO_SLIDES) {
      expect(s.title).not.toBe("");
      expect(s.cta).not.toBe("");
      expect(s.href.startsWith("/") || s.href.startsWith("#")).toBe(true);
    }
  });
  it("اسلاید غیرفعال نمایش داده نمی‌شود", () => {
    const shown = activeSlides();
    expect(shown.every((s) => s.active)).toBe(true);
    expect(shown.find((s) => s.id === "sale")).toBeUndefined();
    expect(shown.length).toBeGreaterThan(0);
  });
  it("مسیر عکس پس‌زمینه (اگر هست) در public/hero است", () => {
    for (const s of HERO_SLIDES) {
      if (!s.bg) continue;
      expect(s.bg.desktop.startsWith("/hero/")).toBe(true);
      expect(s.bg.mobile.startsWith("/hero/")).toBe(true);
    }
  });
  it("کارت‌های کناری لینک معتبر دارند", () => {
    expect(ASIDE_TILES.length).toBe(2);
    for (const t of ASIDE_TILES) expect(t.href).not.toBe("");
  });
});

describe("stepIndex", () => {
  it("از انتها به ابتدا می‌چرخد و برعکس", () => {
    expect(stepIndex(3, 1, 4)).toBe(0);
    expect(stepIndex(0, -1, 4)).toBe(3);
    expect(stepIndex(1, 1, 4)).toBe(2);
  });
  it("بدون اسلاید ۰ برمی‌گرداند", () => {
    expect(stepIndex(0, 1, 0)).toBe(0);
  });
});
