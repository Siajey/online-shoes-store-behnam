import { apiConfig } from "./config";
import { apiCopy } from "./copy";
import { ApiRequestError } from "./errors";
import { buildQuery, type QueryParams } from "./query";
import type { ApiSuccess } from "./types";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** برای endpointهای ورود و OTP: ۴۰۱ آن‌ها یعنی «اطلاعات اشتباه»، نه «توکن منقضی». */
  skipAuthRefresh?: boolean;
};

export type ApiClientOptions = {
  /** تابع است تا خواندن env تا اولین درخواست عقب بیفتد */
  baseUrl: () => string;
  fetch?: typeof fetch;
  /** وقتی refresh هم شکست خورد (باید به صفحه‌ی ورود رفت) */
  onAuthLost?: () => void;
};

const isMutating = (method: Method) => method !== "GET";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createApiClient(options: ApiClientOptions) {
  const doFetch: typeof fetch = options.fetch ?? ((...args) => globalThis.fetch(...args));

  let csrfToken: string | null = null;
  let csrfPromise: Promise<string> | null = null;
  let refreshPromise: Promise<boolean> | null = null;

  const buildUrl = (path: string, query?: QueryParams) =>
    `${options.baseUrl().replace(/\/+$/, "")}${apiConfig.prefix}${path}${buildQuery(query)}`;

  async function send(
    method: Method,
    path: string,
    opts: RequestOptions,
    withCsrf = true,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      [apiConfig.langHeader]: apiConfig.lang,
      ...opts.headers,
    };
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    if (withCsrf && isMutating(method)) headers[apiConfig.csrfHeader] = await getCsrfToken();

    try {
      return await doFetch(buildUrl(path, opts.query), {
        method,
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        credentials: "include",
        signal: opts.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      throw new ApiRequestError({ status: 0, code: "NETWORK_ERROR", message: apiCopy.network });
    }
  }

  async function readJson(res: Response): Promise<unknown> {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  async function parse<T, M>(res: Response): Promise<ApiSuccess<T, M>> {
    const json = await readJson(res);
    if (res.ok) {
      if (!isObject(json)) {
        throw new ApiRequestError({
          status: res.status,
          code: "INVALID_RESPONSE",
          message: apiCopy.invalidResponse,
        });
      }
      return json as unknown as ApiSuccess<T, M>;
    }
    const body = isObject(json) ? json : {};
    // قرارداد: جزئیات خطای ۵xx هرگز به کاربر نشان داده نمی‌شود.
    const serverMessage =
      res.status >= 500
        ? apiCopy.server
        : typeof body.message === "string"
          ? body.message
          : apiCopy.unknown;
    throw new ApiRequestError({
      status: res.status,
      code: typeof body.code === "string" ? body.code : "UNKNOWN_ERROR",
      message: serverMessage,
      path: typeof body.path === "string" ? body.path : undefined,
    });
  }

  function getCsrfToken(): Promise<string> {
    if (csrfToken) return Promise.resolve(csrfToken);
    csrfPromise ??= loadCsrfToken().finally(() => {
      csrfPromise = null;
    });
    return csrfPromise;
  }

  async function loadCsrfToken(): Promise<string> {
    const res = await send("GET", apiConfig.endpoints.csrf, {}, false);
    const body = await parse<unknown, never>(res);
    const token = apiConfig.extractCsrfToken(body.data);
    if (!token) {
      throw new ApiRequestError({
        status: res.status,
        code: "INVALID_RESPONSE",
        message: apiCopy.invalidResponse,
      });
    }
    csrfToken = token;
    return token;
  }

  /** چند درخواست هم‌زمان با ۴۰۱ فقط یک refresh می‌زنند (single-flight). */
  function refreshSession(): Promise<boolean> {
    refreshPromise ??= (async () => {
      try {
        const res = await send(apiConfig.refreshMethod, apiConfig.endpoints.refresh, {});
        return res.ok;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshPromise = null;
    });
    return refreshPromise;
  }

  async function request<T, M = Record<string, unknown>>(
    method: Method,
    path: string,
    opts: RequestOptions = {},
  ): Promise<ApiSuccess<T, M>> {
    let res = await send(method, path, opts);

    if (res.status === 401 && !opts.skipAuthRefresh) {
      if (await refreshSession()) {
        res = await send(method, path, opts);
      } else {
        options.onAuthLost?.();
      }
    } else if (res.status === 403 && isMutating(method)) {
      // ممکن است خطای CSRF باشد: توکن تازه می‌گیریم و فقط یک بار دوباره می‌فرستیم.
      csrfToken = null;
      res = await send(method, path, opts);
    }

    return parse<T, M>(res);
  }

  return {
    get: <T, M = Record<string, unknown>>(path: string, opts?: RequestOptions) =>
      request<T, M>("GET", path, opts),
    post: <T, M = Record<string, unknown>>(path: string, opts?: RequestOptions) =>
      request<T, M>("POST", path, opts),
    put: <T, M = Record<string, unknown>>(path: string, opts?: RequestOptions) =>
      request<T, M>("PUT", path, opts),
    patch: <T, M = Record<string, unknown>>(path: string, opts?: RequestOptions) =>
      request<T, M>("PATCH", path, opts),
    delete: <T, M = Record<string, unknown>>(path: string, opts?: RequestOptions) =>
      request<T, M>("DELETE", path, opts),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
