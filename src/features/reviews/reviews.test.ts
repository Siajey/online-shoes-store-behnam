import { describe, expect, it } from "vitest";
import {
  buildReview,
  formatReviewDate,
  newestFirst,
  parseStoredReviews,
  serializeReviews,
  summarizeReviews,
  validateReview,
} from "./reviews";
import { seededReviews } from "./seed";
import type { Review } from "./types";

const msgs = { rating: "r", bodyShort: "short", bodyLong: "long", titleLong: "title" };
const make = (over: Partial<Review>): Review => ({
  id: "1",
  productId: "p",
  productName: "n",
  productSlug: "s",
  authorName: "a",
  rating: 5,
  body: "متن نظر کافی است",
  createdAt: "2026-10-01T00:00:00.000Z",
  verifiedPurchase: false,
  ...over,
});

describe("validateReview", () => {
  it("ورودی درست خطا ندارد", () => {
    expect(validateReview({ rating: 4, title: "", body: "یک نظر کامل و خوب" }, msgs)).toBeNull();
  });
  it("امتیاز، متن کوتاه و عنوان بلند خطا می‌دهند", () => {
    const e = validateReview({ rating: null, title: "ا".repeat(81), body: "کم" }, msgs);
    expect(e).toEqual({ rating: "r", body: "short", title: "title" });
  });
  it("متن بیش از حد طولانی خطا می‌دهد و فاصله‌ها حساب نمی‌شوند", () => {
    expect(validateReview({ rating: 3, title: "", body: "ا".repeat(1001) }, msgs)?.body).toBe(
      "long",
    );
    expect(validateReview({ rating: 3, title: "", body: "   کم   " }, msgs)?.body).toBe("short");
  });
});

describe("summarizeReviews", () => {
  it("بدون نظر صفر است", () => {
    expect(summarizeReviews([])).toEqual({
      count: 0,
      average: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });
  });
  it("میانگین با یک اعشار و پراکندگی", () => {
    const s = summarizeReviews([make({ rating: 5 }), make({ rating: 4 }), make({ rating: 4 })]);
    expect(s.average).toBe(4.3);
    expect(s.distribution[4]).toBe(2);
    expect(s.count).toBe(3);
  });
});

describe("newestFirst و buildReview", () => {
  it("تازه‌ترین اول، بدون تغییر ورودی", () => {
    const a = make({ id: "a", createdAt: "2026-01-01T00:00:00.000Z" });
    const b = make({ id: "b", createdAt: "2026-02-01T00:00:00.000Z" });
    const input = [a, b];
    expect(newestFirst(input).map((r) => r.id)).toEqual(["b", "a"]);
    expect(input[0].id).toBe("a");
  });
  it("buildReview متن را trim و عنوان خالی را حذف می‌کند", () => {
    const r = buildReview(
      {
        productId: "p",
        productName: "n",
        productSlug: "s",
        rating: 5,
        title: "  ",
        body: "  خوب بود  ",
        author: { id: "u", name: "علی" },
      },
      "id1",
      new Date("2026-10-02T00:00:00.000Z"),
    );
    expect(r.title).toBeUndefined();
    expect(r.body).toBe("خوب بود");
    expect(r.authorId).toBe("u");
    expect(r.createdAt).toBe("2026-10-02T00:00:00.000Z");
  });
});

describe("ذخیره‌سازی", () => {
  it("رفت و برگشت سالم است", () => {
    const list = [make({ id: "x" })];
    expect(parseStoredReviews(serializeReviews(list))).toEqual(list);
  });
  it("داده‌ی خراب هرگز خطا نمی‌دهد", () => {
    expect(parseStoredReviews(null)).toEqual([]);
    expect(parseStoredReviews("not json")).toEqual([]);
    expect(parseStoredReviews('{"a":1}')).toEqual([]);
    expect(parseStoredReviews('[{"id":1},{"rating":9}]')).toEqual([]);
  });
});

describe("formatReviewDate", () => {
  it("تاریخ فارسی و مقدار نامعتبر خالی", () => {
    expect(formatReviewDate("2026-10-01T00:00:00.000Z")).toMatch(/[۰-۹]/);
    expect(formatReviewDate("x")).toBe("");
  });
});

describe("seededReviews", () => {
  const p = { id: "abc-123", name: "کفش", slug: "kafsh" };
  it("برای یک کالا همیشه یکسان است", () => {
    expect(seededReviews(p)).toEqual(seededReviews(p));
  });
  it("نظرها معتبر و تازه‌ترین‌اول‌اند", () => {
    for (const id of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
      const list = seededReviews({ ...p, id });
      expect(list.length === 0 || (list.length >= 3 && list.length <= 9)).toBe(true);
      for (const r of list) {
        expect(r.rating >= 1 && r.rating <= 5).toBe(true);
        expect(r.body.length > 5).toBe(true);
      }
      expect(list.map((r) => r.createdAt)).toEqual(
        list
          .map((r) => r.createdAt)
          .sort()
          .reverse(),
      );
    }
  });
});
