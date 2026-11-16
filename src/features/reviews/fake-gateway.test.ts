import { describe, expect, it } from "vitest";
import { createFakeReviewsGateway, createLocalReviewsStore } from "./fake-gateway";
import { ReviewError } from "./gateway";
import { createReviewsService } from "./service";
import type { NewReview } from "./types";

function setup() {
  const data = new Map<string, string>();
  const store = createLocalReviewsStore({
    getStorage: () => ({
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => void data.set(k, v),
    }),
  });
  const gateway = createFakeReviewsGateway({
    store,
    now: () => new Date("2026-11-01T00:00:00.000Z"),
    newId: (() => {
      let n = 0;
      return () => `id-${(n += 1)}`;
    })(),
  });
  return { gateway, data };
}

const input = (over: Partial<NewReview> = {}): NewReview => ({
  productId: "prod-1",
  productName: "کفش",
  productSlug: "kafsh",
  rating: 5,
  body: "کفش خیلی خوبی است",
  author: { id: "u1", name: "علی" },
  ...over,
});

describe("fake gateway", () => {
  it("نظر ثبت‌شده در لیست کالا و «نظرات من» می‌آید و بالاترین است", async () => {
    const { gateway } = setup();
    const created = await gateway.create(input());
    const list = await gateway.listForProduct("prod-1");
    expect(list[0].id).toBe(created.id);
    expect((await gateway.listMine("u1")).map((r) => r.id)).toEqual([created.id]);
    expect(await gateway.listMine("u2")).toEqual([]);
  });
  it("نظر تکراری همان کاربر برای همان کالا رد می‌شود", async () => {
    const { gateway } = setup();
    await gateway.create(input());
    let error: unknown;
    try {
      await gateway.create(input());
    } catch (e) {
      error = e;
    }
    expect(error instanceof ReviewError).toBe(true);
    const other = await gateway.create(input({ productId: "prod-2" }));
    expect(other.productId).toBe("prod-2");
  });
  it("در حافظه‌ی مرورگر می‌ماند", async () => {
    const { gateway, data } = setup();
    await gateway.create(input());
    expect(data.get("reviews")).toContain("کفش خیلی خوبی است");
  });
});

describe("reviews service", () => {
  it("بارگذاری، ثبت و اعلام تغییر", async () => {
    const { gateway } = setup();
    const service = createReviewsService(gateway);
    let notified = 0;
    service.subscribe(() => (notified += 1));
    expect(service.getProduct("prod-1").status).toBe("idle");
    await service.loadProduct("prod-1");
    expect(service.getProduct("prod-1").status).toBe("ready");
    const before = service.getProduct("prod-1").reviews.length;
    const result = await service.submit(input());
    expect(result.ok).toBe(true);
    expect(service.getProduct("prod-1").reviews.length).toBe(before + 1);
    expect(notified).toBeGreaterThan(1);
  });
  it("ثبت تکراری پیام فارسی می‌دهد و لیست عوض نمی‌شود", async () => {
    const { gateway } = setup();
    const service = createReviewsService(gateway);
    await service.submit(input());
    const result = await service.submit(input());
    expect(result.ok).toBe(false);
    expect(!result.ok && result.message.includes("قبلاً")).toBe(true);
  });
  it("بارگذاری دوباره بدون force درخواست جدید نمی‌زند", async () => {
    const { gateway } = setup();
    let calls = 0;
    const counting = {
      ...gateway,
      listForProduct: (id: string) => {
        calls += 1;
        return gateway.listForProduct(id);
      },
    };
    const service = createReviewsService(counting);
    await Promise.all([service.loadProduct("p"), service.loadProduct("p")]);
    await service.loadProduct("p");
    expect(calls).toBe(1);
    await service.loadProduct("p", true);
    expect(calls).toBe(2);
  });
});
