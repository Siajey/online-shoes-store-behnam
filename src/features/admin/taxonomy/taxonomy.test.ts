import { describe, expect, it } from "vitest";
import { selfAndDescendantIds, toCategoryRows } from "./tree";
import type { AdminCategory } from "./types";
import { validateBrand, validateCategory } from "./validation";

const cat = (id: string, parentId: string | null, name = id, sortOrder = 0): AdminCategory => ({
  id,
  name,
  slug: id,
  parentId,
  sortOrder,
});

describe("validateCategory", () => {
  const ok = { name: " کفش  ورزشی ", slug: " Sport-Shoes ", parentId: "", sortOrder: "" };
  it("متن را تمیز می‌کند و مقدارهای پیش‌فرض می‌گذارد", () => {
    const r = validateCategory(ok);
    expect(r).toEqual({
      ok: true,
      value: { name: "کفش ورزشی", slug: "sport-shoes", parentId: null, sortOrder: 0 },
    });
  });
  it("ارقام فارسی برای ترتیب پذیرفته می‌شود", () => {
    const r = validateCategory({ ...ok, sortOrder: "۱۲", parentId: "p1" });
    expect(r.ok && r.value).toMatchObject({ sortOrder: 12, parentId: "p1" });
  });
  it("خطاها", () => {
    const r = validateCategory({ name: "", slug: "a b", parentId: "", sortOrder: "-1" });
    expect(r).toEqual({
      ok: false,
      errors: { name: "required", slug: "slug", sortOrder: "sortOrder" },
    });
    expect(validateCategory({ ...ok, sortOrder: "10001" }).ok).toBe(false);
    expect(validateCategory({ ...ok, sortOrder: "1.5" }).ok).toBe(false);
    expect(validateCategory({ ...ok, slug: "-a" }).ok).toBe(false);
    expect(validateCategory({ ...ok, name: "x".repeat(121) }).ok).toBe(false);
    expect(validateCategory({ ...ok, slug: "x".repeat(151) }).ok).toBe(false);
  });
  it("slug فارسی مجاز است", () => {
    expect(validateCategory({ ...ok, slug: "کفش-ورزشی" }).ok).toBe(true);
  });
});

describe("validateBrand", () => {
  it("کلید لوگوی خالی null می‌شود", () => {
    expect(validateBrand({ name: "نایک", slug: "nike", logoKey: " " })).toEqual({
      ok: true,
      value: { name: "نایک", slug: "nike", logoKey: null },
    });
  });
  it("کلید لوگوی خیلی بلند خطا دارد", () => {
    const r = validateBrand({ name: "نایک", slug: "nike", logoKey: "x".repeat(256) });
    expect(r).toEqual({ ok: false, errors: { logoKey: "tooLong" } });
  });
});

describe("toCategoryRows", () => {
  it("ترتیب درختی با عمق و مرتب‌سازی بر اساس sortOrder", () => {
    const rows = toCategoryRows([
      cat("b", null, "ب", 2),
      cat("a", null, "الف", 1),
      cat("a1", "a"),
      cat("a1x", "a1"),
    ]);
    expect(rows.map((r) => [r.category.id, r.depth])).toEqual([
      ["a", 0],
      ["a1", 1],
      ["a1x", 2],
      ["b", 0],
    ]);
  });
  it("والد ناموجود یعنی ریشه و حلقه بی‌نهایت نمی‌سازد", () => {
    expect(toCategoryRows([cat("x", "ghost")]).map((r) => r.depth)).toEqual([0]);
    expect(toCategoryRows([cat("p", "q"), cat("q", "p")])).toEqual([]);
  });
});

describe("selfAndDescendantIds", () => {
  it("دسته و همهٔ زیردسته‌ها", () => {
    const list = [cat("a", null), cat("b", "a"), cat("c", "b"), cat("d", null)];
    expect([...selfAndDescendantIds(list, "a")].sort()).toEqual(["a", "b", "c"]);
    expect([...selfAndDescendantIds(list, "d")]).toEqual(["d"]);
  });
});
