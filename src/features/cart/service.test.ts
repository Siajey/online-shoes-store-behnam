import { describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/api/errors";
import { createCartService } from "./service";
import type { CartServerApi, MergeLine, ServerCart } from "./server/types";
import { createCartStore } from "./store";
import type { CartItem } from "./types";

const product = { id: "p1", slug: "air-max", name: "ایر مکس", price: 1_800_000 };
const variant = { id: "v1", label: "سایز ۴۲", price: 1_800_000 };

const item = (variantId: string, quantity = 1): CartItem => ({
  id: `p1:${variantId}`,
  slug: "air-max",
  name: "ایر مکس",
  price: 1_800_000,
  quantity,
  productId: "p1",
  variantId,
  maxQuantity: 10,
});
const cartOf = (...items: CartItem[]): ServerCart => ({ items, hasUnavailable: false });

function fakeStorage() {
  const data: Record<string, string> = {};
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => void (data[k] = v),
  };
}

function fakeAuth(initial: { status: string; id?: string } = { status: "unknown" }) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    set(next: { status: string; id?: string }) {
      state = next;
      listeners.forEach((l) => l());
    },
    getSnapshot: () => ({
      status: state.status,
      user: state.id ? { id: state.id } : null,
    }),
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => void listeners.delete(l);
    },
    load: () => Promise.resolve(),
  };
}

function setup(server: Partial<CartServerApi> = {}, auth = fakeAuth()) {
  const local = createCartStore({ getStorage: () => fakeStorage() });
  const api: CartServerApi = {
    get: vi.fn(async () => cartOf()),
    add: vi.fn(async (id, q) => cartOf(item(id, q))),
    setQuantity: vi.fn(async (id, q) => cartOf(item(id, q))),
    remove: vi.fn(async () => cartOf()),
    clear: vi.fn(async () => cartOf()),
    merge: vi.fn(async (lines: MergeLine[]) => ({
      cart: cartOf(...lines.map((l) => item(l.variantId, l.quantity))),
      skippedVariantIds: [],
    })),
    ...server,
  };
  const service = createCartService({ local, server: api, auth });
  return { local, api, auth, service };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("سبد مهمان", () => {
  it("تا معلوم شدن وضعیت ورود در حال بارگذاری است و سپس مهمان محلی می‌شود", async () => {
    const { service, auth } = setup();
    expect(service.getMeta().loading).toBe(true);
    service.start();
    auth.set({ status: "guest" });
    expect(service.getMeta()).toMatchObject({ mode: "local", loading: false });
  });

  it("افزودن در مرورگر می‌ماند و به سرور نمی‌رود", async () => {
    const { service, api, auth } = setup();
    service.start();
    auth.set({ status: "guest" });
    const result = await service.add(product, 2, variant);
    expect(result).toEqual({ ok: true });
    expect(service.getSnapshot()[0]).toMatchObject({ variantId: "v1", quantity: 2 });
    expect(api.add).not.toHaveBeenCalled();
  });
});

describe("ورود", () => {
  it("بدون سبد محلی: سبد سرور خوانده می‌شود", async () => {
    const { service, api, auth } = setup({ get: vi.fn(async () => cartOf(item("v9", 3))) });
    service.start();
    auth.set({ status: "authenticated", id: "u1" });
    expect(service.getMeta()).toMatchObject({ mode: "server", loading: true });
    await flush();
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.merge).not.toHaveBeenCalled();
    expect(service.getMeta().loading).toBe(false);
    expect(service.getSnapshot()[0].variantId).toBe("v9");
  });

  it("با سبد محلی: ادغام می‌شود و سبد مرورگر پاک می‌شود", async () => {
    const { service, api, auth, local } = setup();
    local.add(product, 2, variant);
    service.start();
    auth.set({ status: "authenticated", id: "u1" });
    await flush();
    expect(api.merge).toHaveBeenCalledWith([{ variantId: "v1", quantity: 2 }]);
    expect(local.getSnapshot()).toHaveLength(0);
    expect(service.getSnapshot()[0]).toMatchObject({ variantId: "v1", quantity: 2 });
    expect(service.getMeta().notice).toBeNull();
  });

  it("کالای بدون ترکیب و کالای ردشده در پیام اطلاع‌رسانی می‌آید", async () => {
    const { service, auth, local } = setup({
      merge: vi.fn(async () => ({ cart: cartOf(), skippedVariantIds: ["v1"] })),
    });
    local.add(product, 1, variant);
    local.add({ ...product, id: "old" }, 1);
    service.start();
    auth.set({ status: "authenticated", id: "u1" });
    await flush();
    expect(service.getMeta().notice).toContain("۲");
  });

  it("خطای خواندن: خطا نشان داده می‌شود و سبد مرورگر پاک نمی‌شود؛ تلاش دوباره کار می‌کند", async () => {
    const merge = vi
      .fn<CartServerApi["merge"]>()
      .mockRejectedValueOnce(new ApiRequestError({ status: 500, code: "X", message: "خطای سرور" }))
      .mockResolvedValueOnce({ cart: cartOf(item("v1", 1)), skippedVariantIds: [] });
    const { service, auth, local } = setup({ merge });
    local.add(product, 1, variant);
    service.start();
    auth.set({ status: "authenticated", id: "u1" });
    await flush();
    expect(service.getMeta()).toMatchObject({ loading: false, error: "خطای سرور" });
    expect(local.getSnapshot()).toHaveLength(1);
    await service.retry();
    expect(service.getMeta().error).toBeNull();
    expect(local.getSnapshot()).toHaveLength(0);
  });
});

describe("سبد سرور", () => {
  async function authed(server: Partial<CartServerApi> = {}) {
    const ctx = setup(server);
    ctx.service.start();
    ctx.auth.set({ status: "authenticated", id: "u1" });
    await flush();
    return ctx;
  }

  it("افزودن با ترکیب به سرور می‌رود و پاسخ جایگزین می‌شود", async () => {
    const { service, api } = await authed();
    expect(await service.add(product, 2, variant)).toEqual({ ok: true });
    expect(api.add).toHaveBeenCalledWith("v1", 2);
    expect(service.getSnapshot()[0].quantity).toBe(2);
    expect(service.getMeta().pending).toBe(false);
  });

  it("افزودن بدون ترکیب پذیرفته نمی‌شود", async () => {
    const { service, api } = await authed();
    const result = await service.add(product, 1);
    expect(result.ok).toBe(false);
    expect(api.add).not.toHaveBeenCalled();
  });

  it("تغییر تعداد، حذف (و حذف ردیفِ ناموجود بی‌اثر) و خالی کردن", async () => {
    const { service, api } = await authed({ get: vi.fn(async () => cartOf(item("v1", 1))) });
    await service.setQuantity("p1:v1", 4);
    expect(api.setQuantity).toHaveBeenCalledWith("v1", 4);
    await service.setQuantity("p1:v1", 0);
    expect(api.remove).toHaveBeenCalledWith("v1");
    await service.remove("p1:v1");
    expect(api.remove).toHaveBeenCalledTimes(1);
    await service.clear();
    expect(api.clear).toHaveBeenCalledTimes(1);
  });

  it("خطا: پیام سرور برمی‌گردد و سبد دوباره خوانده می‌شود", async () => {
    const get = vi
      .fn<CartServerApi["get"]>()
      .mockResolvedValueOnce(cartOf(item("v1", 1)))
      .mockResolvedValueOnce(cartOf(item("v1", 2)));
    const { service } = await authed({
      get,
      add: vi.fn(async () => {
        throw new ApiRequestError({ status: 409, code: "CART_X", message: "موجودی کافی نیست" });
      }),
    });
    const result = await service.add(product, 9, variant);
    expect(result).toEqual({ ok: false, message: "موجودی کافی نیست" });
    expect(service.getMeta().error).toBe("موجودی کافی نیست");
    expect(service.getSnapshot()[0].quantity).toBe(2);
  });

  it("تغییرها به ترتیب اجرا می‌شوند", async () => {
    const order: string[] = [];
    const { service } = await authed({
      setQuantity: vi.fn(async (_id, q) => {
        await new Promise((r) => setTimeout(r, q === 2 ? 20 : 0));
        order.push(`q${q}`);
        return cartOf(item("v1", q));
      }),
    });
    await service.add(product, 1, variant);
    const a = service.setQuantity("p1:v1", 2);
    const b = service.setQuantity("p1:v1", 3);
    await Promise.all([a, b]);
    expect(order).toEqual(["q2", "q3"]);
    expect(service.getSnapshot()[0].quantity).toBe(3);
  });

  it("خروج: به سبد مرورگر (خالی) برمی‌گردد", async () => {
    const { service, auth } = await authed({ get: vi.fn(async () => cartOf(item("v1", 1))) });
    await service.add(product, 1, variant);
    auth.set({ status: "guest" });
    expect(service.getMeta().mode).toBe("local");
    expect(service.getSnapshot()).toHaveLength(0);
  });

  it("مشترک‌ها با هر تغییر خبر می‌شوند", async () => {
    const { service } = await authed();
    const listener = vi.fn();
    service.subscribe(listener);
    await service.add(product, 1, variant);
    expect(listener).toHaveBeenCalled();
  });
});
