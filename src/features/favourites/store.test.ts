import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/features/products/types";
import { FAVOURITES_STORAGE_KEY, createFavouritesStore } from "./store";

const product: Product = {
  id: "a",
  slug: "shoe-a",
  name: "کفش الف",
  price: 1_000_000,
  available: true,
};

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
  };
}

describe("createFavouritesStore", () => {
  it("ابتدا خالی است", () => {
    const store = createFavouritesStore({ getStorage: () => fakeStorage() });
    expect(store.getSnapshot()).toEqual([]);
    expect(store.getServerSnapshot()).toEqual([]);
  });
  it("toggle اضافه و حذف می‌کند، ذخیره می‌کند و خبر می‌دهد", () => {
    const storage = fakeStorage();
    const store = createFavouritesStore({ getStorage: () => storage });
    const listener = vi.fn();
    store.subscribe(listener);
    store.toggle(product);
    expect(store.getSnapshot()).toHaveLength(1);
    expect(storage.data[FAVOURITES_STORAGE_KEY]).toContain('"id":"a"');
    store.toggle(product);
    expect(store.getSnapshot()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(2);
  });
  it("لیست ذخیره‌شده را در نمونه‌ی تازه می‌خواند", () => {
    const storage = fakeStorage();
    createFavouritesStore({ getStorage: () => storage }).toggle(product);
    expect(createFavouritesStore({ getStorage: () => storage }).getSnapshot()[0].id).toBe("a");
  });
  it("حافظه‌ی خراب یا ممنوع خطا نمی‌دهد", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("full");
      },
    };
    const store = createFavouritesStore({ getStorage: () => broken });
    expect(() => store.toggle(product)).not.toThrow();
    expect(store.getSnapshot()).toHaveLength(1);
  });
});
