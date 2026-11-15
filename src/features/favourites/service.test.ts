import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/features/products/types";
import { createFavouritesService } from "./service";
import type { FavouritesServerApi } from "./server/types";

const p = (id: string): Product => ({
  id,
  slug: `s-${id}`,
  name: `کفش ${id}`,
  price: 1_000_000,
  available: true,
});

function fakeLocal(initial: Product[] = []) {
  let items: readonly Product[] = initial;
  const listeners = new Set<() => void>();
  const set = (next: readonly Product[]) => {
    items = next;
    listeners.forEach((l) => l());
  };
  return {
    getSnapshot: () => items,
    getServerSnapshot: () => [] as readonly Product[],
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    toggle: (x: Product) =>
      set(items.some((i) => i.id === x.id) ? items.filter((i) => i.id !== x.id) : [x, ...items]),
    clear: () => set([]),
  };
}

function fakeAuth(initial: { status: string; user: { id: string } | null }) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => state,
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    load: () => Promise.resolve(),
    set(next: typeof initial) {
      state = next;
      listeners.forEach((l) => l());
    },
  };
}

function fakeServer(over: Partial<FavouritesServerApi> = {}): FavouritesServerApi {
  return {
    list: vi.fn(async () => ({ items: [p("a"), p("b")], nextCursor: null })),
    ids: vi.fn(async () => ["a", "b"]),
    add: vi.fn(async () => {}),
    remove: vi.fn(async () => {}),
    merge: vi.fn(async (ids: string[]) => ({ added: ids.length, skippedProductIds: [] })),
    ...over,
  };
}

const flush = () => new Promise((r) => setTimeout(r, 0));
const USER = { status: "authenticated", user: { id: "u1" } };

describe("createFavouritesService", () => {
  it("مهمان: در مرورگر ذخیره می‌شود و به سرور نمی‌رود", async () => {
    const server = fakeServer();
    const s = createFavouritesService({
      local: fakeLocal(),
      server,
      auth: fakeAuth({ status: "guest", user: null }),
    });
    s.start();
    expect(s.getMeta().mode).toBe("local");
    expect(s.getMeta().loading).toBe(false);
    await s.toggle(p("a"));
    expect(s.getIds().has("a")).toBe(true);
    await s.toggle(p("a"));
    expect(s.getIds().has("a")).toBe(false);
    expect(server.add).not.toHaveBeenCalled();
  });

  it("شناسه‌ها برای یک وضعیت یک مرجع ثابت دارند", () => {
    const s = createFavouritesService({
      local: fakeLocal([p("a")]),
      server: fakeServer(),
      auth: fakeAuth({ status: "guest", user: null }),
    });
    expect(s.getIds()).toBe(s.getIds());
  });

  it("ورود: مرورگر ادغام و پاک می‌شود و شناسه‌ها از سرور می‌آیند", async () => {
    const local = fakeLocal([p("x")]);
    const server = fakeServer();
    const s = createFavouritesService({ local, server, auth: fakeAuth(USER) });
    s.start();
    await flush();
    expect(server.merge).toHaveBeenCalledWith(["x"]);
    expect(local.getSnapshot()).toHaveLength(0);
    expect(s.getMeta().mode).toBe("server");
    expect([...s.getIds()]).toEqual(["a", "b"]);
    expect(s.getMeta().loading).toBe(false);
  });

  it("ورود بدون چیزی در مرورگر: ادغام نمی‌شود", async () => {
    const server = fakeServer();
    const s = createFavouritesService({ local: fakeLocal(), server, auth: fakeAuth(USER) });
    s.start();
    await flush();
    expect(server.merge).not.toHaveBeenCalled();
    expect(server.ids).toHaveBeenCalled();
  });

  it("کالای ردشده‌ی ادغام: پیام اطلاع", async () => {
    const server = fakeServer({
      merge: vi.fn(async () => ({ added: 0, skippedProductIds: ["x"] })),
    });
    const s = createFavouritesService({
      local: fakeLocal([p("x")]),
      server,
      auth: fakeAuth(USER),
    });
    s.start();
    await flush();
    expect(s.getMeta().notice).toContain("۱ کالا");
  });

  it("خطای ادغام: مرورگر پاک نمی‌شود و خطا می‌ماند", async () => {
    const local = fakeLocal([p("x")]);
    const server = fakeServer({
      merge: vi.fn(async () => {
        throw new Error("down");
      }),
    });
    const s = createFavouritesService({ local, server, auth: fakeAuth(USER) });
    s.start();
    await flush();
    expect(local.getSnapshot()).toHaveLength(1);
    expect(s.getMeta().error).not.toBeNull();
    expect(s.getMeta().loading).toBe(false);
  });

  it("افزودن روی سرور: فوری نشان داده و ارسال می‌شود", async () => {
    const server = fakeServer();
    const s = createFavouritesService({ local: fakeLocal(), server, auth: fakeAuth(USER) });
    s.start();
    await flush();
    const result = s.toggle(p("c"));
    expect(s.getIds().has("c")).toBe(true);
    expect((await result).ok).toBe(true);
    expect(server.add).toHaveBeenCalledWith("c");
  });

  it("خطای افزودن: به حالت قبل برمی‌گردد", async () => {
    const server = fakeServer({
      add: vi.fn(async () => {
        throw new Error("limit");
      }),
    });
    const s = createFavouritesService({ local: fakeLocal(), server, auth: fakeAuth(USER) });
    s.start();
    await flush();
    const result = await s.toggle(p("c"));
    expect(result.ok).toBe(false);
    expect(s.getIds().has("c")).toBe(false);
    expect(s.getMeta().error).not.toBeNull();
  });

  it("حذف روی سرور: از فهرست بارشده هم برداشته می‌شود و خطا برش می‌گرداند", async () => {
    const server = fakeServer({
      remove: vi.fn(async () => {
        throw new Error("x");
      }),
    });
    const s = createFavouritesService({ local: fakeLocal(), server, auth: fakeAuth(USER) });
    s.start();
    await flush();
    await s.loadList();
    expect(s.getList().items).toHaveLength(2);
    const pending = s.toggle(p("a"));
    expect(s.getList().items.map((i) => i.id)).toEqual(["b"]);
    await pending;
    expect(s.getList().items.map((i) => i.id)).toEqual(["a", "b"]);
    expect(s.getIds().has("a")).toBe(true);
  });

  it("فهرست صفحه‌به‌صفحه: نمایش بیشتر اضافه می‌کند و تکراری را نمی‌آورد", async () => {
    const pages = [
      { items: [p("a"), p("b")], nextCursor: "c1" },
      { items: [p("b"), p("c")], nextCursor: null },
    ];
    const list = vi.fn(
      async (_cursor?: string) => pages.shift() ?? { items: [], nextCursor: null },
    );
    const s = createFavouritesService({
      local: fakeLocal(),
      server: fakeServer({ list }),
      auth: fakeAuth(USER),
    });
    s.start();
    await flush();
    await s.loadList();
    expect(s.getList().nextCursor).toBe("c1");
    await s.loadMore();
    expect(list.mock.calls.at(-1)?.[0]).toBe("c1");
    expect(s.getList().items.map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(s.getList().nextCursor).toBeNull();
  });

  it("خطای خواندن فهرست", async () => {
    const s = createFavouritesService({
      local: fakeLocal(),
      server: fakeServer({
        list: vi.fn(async () => {
          throw new Error("x");
        }),
      }),
      auth: fakeAuth(USER),
    });
    s.start();
    await flush();
    await s.loadList();
    expect(s.getList().status).toBe("error");
  });

  it("افزودن بعد از بارگذاری فهرست، آن را کهنه (idle) می‌کند", async () => {
    const s = createFavouritesService({
      local: fakeLocal(),
      server: fakeServer(),
      auth: fakeAuth(USER),
    });
    s.start();
    await flush();
    await s.loadList();
    expect(s.getList().status).toBe("ready");
    await s.toggle(p("z"));
    expect(s.getList().status).toBe("idle");
  });

  it("خروج از حساب: به مرورگر برمی‌گردد", async () => {
    const auth = fakeAuth(USER);
    const s = createFavouritesService({ local: fakeLocal(), server: fakeServer(), auth });
    s.start();
    await flush();
    expect(s.getMeta().mode).toBe("server");
    auth.set({ status: "guest", user: null });
    expect(s.getMeta().mode).toBe("local");
    expect(s.getIds().size).toBe(0);
    expect(s.getList().status).toBe("idle");
  });
});
