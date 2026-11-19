import { describe, expect, it } from "vitest";
import {
  checkImageFile,
  moveImage,
  remainingSlots,
  removeImage,
  sameGallery,
  setAlt,
  toGalleryBody,
  type GalleryImage,
} from "./gallery";

const img = (k: string, alt = ""): GalleryImage => ({ fileKey: k, altText: alt });

describe("checkImageFile", () => {
  it("فرمت و حجم مجاز", () => {
    expect(checkImageFile({ type: "image/webp", size: 1000 })).toBeNull();
    expect(checkImageFile({ type: "image/png", size: 5 * 1024 * 1024 })).toBeNull();
  });
  it("فرمت نامجاز، حجم زیاد و فایل خالی", () => {
    expect(checkImageFile({ type: "image/gif", size: 1000 })).toBe("type");
    expect(checkImageFile({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toBe("size");
    expect(checkImageFile({ type: "image/jpeg", size: 0 })).toBe("empty");
  });
});

describe("ترتیب و حذف", () => {
  const list = [img("a"), img("b"), img("c")];
  it("جابه‌جایی یک خانه", () => {
    expect(moveImage(list, 1, -1).map((i) => i.fileKey)).toEqual(["b", "a", "c"]);
    expect(moveImage(list, 1, 1).map((i) => i.fileKey)).toEqual(["a", "c", "b"]);
  });
  it("خارج از محدوده بدون تغییر و ورودی دست‌نخورده", () => {
    expect(moveImage(list, 0, -1).map((i) => i.fileKey)).toEqual(["a", "b", "c"]);
    expect(moveImage(list, 2, 1).map((i) => i.fileKey)).toEqual(["a", "b", "c"]);
    expect(list.map((i) => i.fileKey)).toEqual(["a", "b", "c"]);
  });
  it("حذف و متن جایگزین", () => {
    expect(removeImage(list, 1).map((i) => i.fileKey)).toEqual(["a", "c"]);
    expect(setAlt(list, 2, "کفش")[2]?.altText).toBe("کفش");
    expect(list[2]?.altText).toBe("");
  });
});

describe("بدنه‌ی ذخیره و سقف", () => {
  it("متن جایگزین خالی فرستاده نمی‌شود", () => {
    expect(toGalleryBody([img("a", " "), img("b", " نمای کنار ")])).toEqual({
      images: [{ fileKey: "a" }, { fileKey: "b", altText: "نمای کنار" }],
    });
  });
  it("جای باقی‌مانده تا ۱۲", () => {
    expect(remainingSlots(0)).toBe(12);
    expect(remainingSlots(12)).toBe(0);
    expect(remainingSlots(20)).toBe(0);
  });
  it("تشخیص تغییر نکردن", () => {
    expect(sameGallery([img("a")], [img("a")])).toBe(true);
    expect(sameGallery([img("a")], [img("b")])).toBe(false);
    expect(sameGallery([img("a", "x")], [img("a", "y")])).toBe(false);
  });
});
