import { describe, expect, it, vi } from "vitest";
import { createApiClient } from "./client";
import { ApiRequestError } from "./errors";

const envelope = (data: unknown, meta?: unknown) => ({
  message: "ok",
  code: "OK",
  timestamp: "2026-11-02T00:00:00.000Z",
  path: "/api/v1/x",
  data,
  ...(meta ? { meta } : {}),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const csrfRes = () => json(envelope({ csrfToken: "tok" }));

function setup(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init ?? {}),
  );
  const onAuthLost = vi.fn();
  const client = createApiClient({
    baseUrl: () => "http://api.test/",
    fetch: fetchMock as unknown as typeof fetch,
    onAuthLost,
  });
  return { client, fetchMock, onAuthLost };
}

const calls = (m: ReturnType<typeof vi.fn>) =>
  m.mock.calls.map((c) => `${(c[1] as RequestInit).method} ${c[0]}`);

describe("api client", () => {
  it("GET: آدرس، کوکی، زبان و بدون CSRF", async () => {
    const { client, fetchMock } = setup(() => json(envelope([1, 2], { nextCursor: "abc" })));
    const res = await client.get<number[]>("/products", { query: { limit: 2 } });
    expect(res.data).toEqual([1, 2]);
    expect(res.meta).toEqual({ nextCursor: "abc" });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://api.test/api/v1/products?limit=2");
    expect(init.credentials).toBe("include");
    expect((init.headers as Record<string, string>)["x-lang"]).toBe("fa");
    expect((init.headers as Record<string, string>)["x-csrf-token"]).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("POST: اول توکن CSRF می‌گیرد و در هدر می‌فرستد و یک بار کش می‌کند", async () => {
    const { client, fetchMock } = setup((url) =>
      url.endsWith("/csrf-token") ? csrfRes() : json(envelope(null), 201),
    );
    await client.post("/orders", { body: { a: 1 } });
    await client.post("/orders", { body: { a: 2 } });
    expect(calls(fetchMock)).toEqual([
      "GET http://api.test/api/v1/csrf-token",
      "POST http://api.test/api/v1/orders",
      "POST http://api.test/api/v1/orders",
    ]);
    const init = fetchMock.mock.calls[1][1] as RequestInit;
    expect((init.headers as Record<string, string>)["x-csrf-token"]).toBe("tok");
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("خطا را به ApiRequestError با پیام سرور تبدیل می‌کند", async () => {
    const { client } = setup(() =>
      json(
        { message: "شماره نامعتبر است", code: "VALIDATION_ERROR", timestamp: "t", path: "/p" },
        400,
      ),
    );
    await expect(client.get("/x")).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "شماره نامعتبر است",
    });
  });

  it("پیام خطای ۵xx را به کاربر نشان نمی‌دهد", async () => {
    const { client } = setup(() =>
      json({ message: "stack trace secret", code: "INTERNAL_SERVER_ERROR" }, 500),
    );
    const err = await client.get("/x").catch((e) => e);
    expect(err).toBeInstanceOf(ApiRequestError);
    expect(err.message).not.toContain("secret");
    expect(err.status).toBe(500);
  });

  it("قطعی شبکه به NETWORK_ERROR تبدیل می‌شود", async () => {
    const { client } = setup(() => {
      throw new TypeError("fetch failed");
    });
    await expect(client.get("/x")).rejects.toMatchObject({ status: 0, code: "NETWORK_ERROR" });
  });

  it("۴۰۱: یک بار refresh می‌زند و درخواست را دوباره می‌فرستد", async () => {
    let first = true;
    const { client, fetchMock } = setup((url) => {
      if (url.endsWith("/csrf-token")) return csrfRes();
      if (url.endsWith("/refresh-token")) return json(envelope(null));
      if (first) {
        first = false;
        return json({ message: "no", code: "UNAUTHORIZED" }, 401);
      }
      return json(envelope({ ok: true }));
    });
    const res = await client.get<{ ok: boolean }>("/me");
    expect(res.data.ok).toBe(true);
    expect(calls(fetchMock).filter((c) => c.includes("refresh-token"))).toHaveLength(1);
  });

  it("چند ۴۰۱ هم‌زمان فقط یک refresh می‌سازند (single-flight)", async () => {
    const seen = new Set<string>();
    const { client, fetchMock } = setup((url) => {
      if (url.endsWith("/csrf-token")) return csrfRes();
      if (url.endsWith("/refresh-token")) return json(envelope(null));
      if (!seen.has(url)) {
        seen.add(url);
        return json({ message: "no", code: "UNAUTHORIZED" }, 401);
      }
      return json(envelope({ ok: true }));
    });
    await Promise.all([client.get("/a"), client.get("/b"), client.get("/c")]);
    expect(calls(fetchMock).filter((c) => c.includes("refresh-token"))).toHaveLength(1);
  });

  it("اگر refresh شکست بخورد، onAuthLost صدا زده می‌شود و خطای ۴۰۱ می‌ماند", async () => {
    const { client, onAuthLost } = setup((url) => {
      if (url.endsWith("/csrf-token")) return csrfRes();
      return json({ message: "no", code: "UNAUTHORIZED" }, 401);
    });
    await expect(client.get("/me")).rejects.toMatchObject({ status: 401 });
    expect(onAuthLost).toHaveBeenCalledTimes(1);
  });

  it("skipAuthRefresh: ۴۰۱ ورود، refresh نمی‌زند", async () => {
    const { client, fetchMock } = setup((url) =>
      url.endsWith("/csrf-token")
        ? csrfRes()
        : json({ message: "کد اشتباه است", code: "AUTH_INVALID_OTP" }, 401),
    );
    await expect(
      client.post("/auth/verify", { body: {}, skipAuthRefresh: true }),
    ).rejects.toMatchObject({ status: 401 });
    expect(calls(fetchMock).some((c) => c.includes("refresh-token"))).toBe(false);
  });

  it("۴۰۳ روی درخواست تغییردهنده: توکن را دوباره می‌گیرد و یک بار تکرار می‌کند", async () => {
    let posts = 0;
    const { client, fetchMock } = setup((url, init) => {
      if (url.endsWith("/csrf-token")) return csrfRes();
      if (init.method === "POST") {
        posts += 1;
        return posts === 1
          ? json({ message: "csrf", code: "FORBIDDEN" }, 403)
          : json(envelope(null), 201);
      }
      return json(envelope(null));
    });
    await client.post("/orders", { body: {} });
    expect(calls(fetchMock).filter((c) => c.includes("csrf-token"))).toHaveLength(2);
    expect(posts).toBe(2);
  });
});
