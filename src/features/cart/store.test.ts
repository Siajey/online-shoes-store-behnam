import { describe, expect, it, vi } from "vitest";
import { CART_STORAGE_KEY, createCartStore } from "./store";

const product = { id: "a", slug: "shoe-a", name: "کفش الف", price: 1_000_000 };

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

function fakeTarget() {
  const handlers = new Set<(e: Event) => void>();
  return {
    handlers,
    addEventListener: (_: string, h: (e: Event) => void) => void handlers.add(h),
    removeEventListener: (_: string, h: (e: Event) => void) => void handlers.delete(h),
    fire: (key: string | null) => handlers.forEach((h) => h({ key } as unknown as Event)),
  };
}

describe("createCartStore", () => {
  it("ابتدا خالی است و روی سرور هم خالی می‌ماند", () => {
    const store = createCartStore({ getStorage: () => fakeStorage() });
    expect(store.getSnapshot()).toEqual([]);
    expect(store.getServerSnapshot()).toEqual([]);
  });

  it("افزودن را ذخیره می‌کند و مشترکین را خبر می‌دهد", () => {
    const storage = fakeStorage();
    const store = createCartStore({ getStorage: () => storage });
    const listener = vi.fn();
    store.subscribe(listener);
    store.add(product, 2);
    expect(store.getSnapshot()[0]).toMatchObject({ id: "a", quantity: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(storage.data[CART_STORAGE_KEY]).toContain('"quantity":2');
  });

  it("سبد ذخیره‌شده را می‌خواند", () => {
    const first = fakeStorage();
    createCartStore({ getStorage: () => first }).add(product, 3);
    const second = createCartStore({ getStorage: () => first });
    expect(second.getSnapshot()[0].quantity).toBe(3);
  });

  it("تغییر تعداد، حذف و خالی کردن", () => {
    const store = createCartStore({ getStorage: () => fakeStorage() });
    store.add(product);
    store.setQuantity("a", 5);
    expect(store.getSnapshot()[0].quantity).toBe(5);
    store.remove("a");
    expect(store.getSnapshot()).toEqual([]);
    store.add(product);
    store.clear();
    expect(store.getSnapshot()).toEqual([]);
  });

  it("بدون تغییر واقعی، مشترکین خبر نمی‌شوند و snapshot همان می‌ماند", () => {
    const store = createCartStore({ getStorage: () => fakeStorage() });
    store.add(product, 10);
    const before = store.getSnapshot();
    const listener = vi.fn();
    store.subscribe(listener);
    store.add(product);
    store.remove("zzz");
    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(before);
  });

  it("اگر حافظه خطا بدهد، سبد در حافظه‌ی برنامه کار می‌کند", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("full");
      },
    };
    const store = createCartStore({ getStorage: () => broken });
    expect(() => store.add(product)).not.toThrow();
    expect(store.getSnapshot()).toHaveLength(1);
    const noStorage = createCartStore({
      getStorage: () => {
        throw new Error("denied");
      },
    });
    expect(noStorage.getSnapshot()).toEqual([]);
  });

  it("محتوای خراب ذخیره‌شده نادیده گرفته می‌شود", () => {
    const storage = fakeStorage({ [CART_STORAGE_KEY]: "{{{" });
    expect(createCartStore({ getStorage: () => storage }).getSnapshot()).toEqual([]);
  });

  it("تب دیگر که سبد را تغییر دهد، هم‌گام می‌شود", () => {
    const storage = fakeStorage();
    const target = fakeTarget();
    const store = createCartStore({ getStorage: () => storage, target });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    expect(target.handlers.size).toBe(1);

    const other = createCartStore({ getStorage: () => storage });
    other.add(product, 4);
    target.fire(CART_STORAGE_KEY);
    expect(store.getSnapshot()[0].quantity).toBe(4);
    expect(listener).toHaveBeenCalledTimes(1);

    target.fire("unrelated-key");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    expect(target.handlers.size).toBe(0);
  });
});
