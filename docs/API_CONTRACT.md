# API_CONTRACT.md — Backend ⇄ Frontend Contract

> Shared by the backend and frontend developers. Request/response **object schemas live in Swagger** (`/api-json`) and are the source of truth for them. This file defines only the cross-cutting rules: envelope, errors, auth, CSRF, conventions.
> ☐ = not decided yet (tracked in `DECISIONS.md`). "Derived" = read from the current code (interceptor / exception filter).

## 1. Basics

- Base URL: `<origin>/api/v1` (versioned in the URI).
- Format: JSON (UTF-8). Dates are ISO 8601 strings in UTC (e.g. `2026-10-28T10:15:00.000Z`).
- Every request must send cookies (`credentials: "include"`), because the session lives in cookies.
- Language: the backend translates `message` via nestjs-i18n; fallback is `en`. See section 1.1 for how the language is selected.
- Controllers must always return a `SuccessResponse`. Anything else bypasses the interceptor and is sent **without** the envelope.

### 1.1 Language selection (derived from the i18n config)

Resolvers run in this order; the first one that yields a language wins. Fallback: `en`.

| Priority | Source       | Name(s)                                      |
| -------- | ------------ | -------------------------------------------- |
| 1        | Query string | `?lang=` or `?l=`                            |
| 2        | Header       | `x-custom-lang`                              |
| 3        | Header       | `x-lang`                                     |
| 4        | Cookie       | `NEXT_LOCALE`, `i18n_lang`, `lang`, `locale` |
| 5        | Header       | `Accept-Language`                            |

Frontend:

- Next.js already sets the `NEXT_LOCALE` cookie, so with `credentials: "include"` the language follows the user's locale automatically.
- For an explicit choice, send one header: `x-lang` (proposed). Custom headers must be in the CORS allowed headers.
- The query string wins over everything, so never leave a stale `?lang=` on API calls.

Backend cleanup (proposed): `{ use: QueryResolver, options: ['lang'] }` is already covered by `new QueryResolver(['lang', 'l'])`, and the bare `new CookieResolver()` (default cookie `lang`) is covered by the named cookie list. ☐ Keep both `x-custom-lang` and `x-lang`, or only `x-lang`?

## 2. Success envelope (derived)

HTTP status is set by the backend per endpoint (`data.status`).

```json
{
  "message": "Translated human-readable message",
  "code": "SOME_CODE",
  "timestamp": "2026-10-28T10:15:00.000Z",
  "path": "/api/v1/...",
  "data": {},
  "meta": {}
}
```

| Field       | Meaning                                                        |
| ----------- | -------------------------------------------------------------- |
| `message`   | Translated text, safe to show to the user                      |
| `code`      | Machine-readable success code (☐ list of codes)                |
| `timestamp` | Server time of the response                                    |
| `path`      | Request URL                                                    |
| `data`      | Payload; its schema is in Swagger                              |
| `meta`      | Extra info (pagination, etc.); omitted/undefined when not used |

Rules:

- Always has a body, so **no `204 No Content`**; use `200` with `data: null` instead.
- Use `201` for creation.
- Headers and cookies can be set by the endpoint (used by auth endpoints for tokens).

## 3. Error envelope (derived)

```json
{
  "message": "Translated human-readable error",
  "code": "VALIDATION_ERROR",
  "timestamp": "2026-10-28T10:15:00.000Z",
  "path": "/api/v1/..."
}
```

There is no `data` or `meta` on errors. The frontend branches on **HTTP status first**, then `code`.

| Source                                                               | HTTP status                     | `code`                                                                               |
| -------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| Zod validation failure                                               | 400                             | `VALIDATION_ERROR` (all issues joined into one translated string, `", "` separated)  |
| `AppError` and subclasses (domain/business)                          | `error.status` (see 3.1)        | `error.code`                                                                         |
| `HttpException` (Nest built-ins, guards, `TooManyRequestsException`) | the exception's status          | the `error` field of its response, else `INTERNAL_SERVER_ERROR` (see findings below) |
| Database error (`DrizzleQueryError`)                                 | mapped by `handleDatabaseError` | ☐ document the mapping                                                               |
| Anything unexpected                                                  | 500                             | `INTERNAL_SERVER_ERROR` (message is generic; details only in logs)                   |

Frontend behavior by status:

| Status          | Action                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------- |
| 400             | Show `message`; form screens show it as a form-level error (no per-field errors yet, see ☐ below) |
| 401             | Access token missing/expired → run the refresh flow (section 4)                                   |
| 403             | If CSRF failure → refetch CSRF token and retry once; otherwise "not allowed"                      |
| 404 / 409 / 422 | Show `message` (or branch on `code`)                                                              |
| 429             | Rate limited; show `message`, back off                                                            |
| 5xx             | Generic error UI; never show raw details                                                          |

### 3.1 Error classes (derived)

| Class                                      | Status         | Default `code`                        | Default message key                 |
| ------------------------------------------ | -------------- | ------------------------------------- | ----------------------------------- |
| `AppError` (base)                          | 500 unless set | required                              | required                            |
| `ValidationError`                          | 400            | `VALIDATION_ERROR`                    | `errors.validation.validationError` |
| `UnAuthorizedError`                        | 401            | `UNAUTHORIZED`                        | `errors.session.unauthorized`       |
| `ForbiddenError`                           | 403            | `FORBIDDEN`                           | `errors.auth.accessDenied`          |
| `NotFoundError`                            | 404            | `NOT_FOUND`                           | `errors.NOT_FOUND`                  |
| `ConflictError`                            | 409            | `CONFLICT`                            | `errors.conflict`                   |
| `NonOperationalError`                      | 500            | `internalServerError` (see finding 5) | `errors.internalServerError`        |
| `TooManyRequestsException` (HttpException) | 429            | `TOO_MANY_REQUESTS`                   | `tooManyRequests`                   |

- `code` can be overridden per throw. ☐ Keep a registry of feature-specific codes (e.g. `AUTH_INVALID_CREDENTIALS`) in this file or Swagger.
- `message` is an i18n key; the client always receives the translated text.
- `details` and `args` exist on `AppError` but are **not** sent to the client (see findings 3 and 4).

⚠ **Findings in the current filter and error classes (proposed fixes):**

1. `TooManyRequestsException` gives `code: TOO_MANY_REQUESTS` correctly. ☐ Confirm the throttler actually throws it: Nest's default `ThrottlerException` has a plain-string response and would produce status 429 with `INTERNAL_SERVER_ERROR`.
2. Other `HttpException`s: a string response gives `INTERNAL_SERVER_ERROR`; a Nest built-in object response gives Nest's text (e.g. `"Not Found"`). Proposed: throw only `AppError` subclasses or custom exceptions with an uppercase `error`, or derive the default `code` from the HTTP status in the filter.
3. `args` is never used: the filter calls `i18n.t(exception.message, { lang })`, so placeholders like `{name}` get no values. Proposed: pass `{ lang, args: exception.args }`.
4. Zod errors (and `ValidationError`) reach the client as one joined string, so forms cannot show per-field errors. ☐ Proposed: add `errors: [{ field, message }]` for `VALIDATION_ERROR`.
5. `NonOperationalError` defaults to `internalServerError` (camelCase) while everything else, including the filter's fallback, is `UPPER_SNAKE`. Proposed: `INTERNAL_SERVER_ERROR`.

Until these are fixed, the frontend should rely on the HTTP status first, and on `code` only for `AppError`-based errors and `TOO_MANY_REQUESTS`.

## 4. Authentication (JWT in cookies + CSRF)

Tokens are stored by the browser in `httpOnly` cookies; **JavaScript never reads or stores them** (not in `localStorage`).

| Item          | Value                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| Access token  | JWT in cookie ☐ name, ☐ lifetime                                            |
| Refresh token | JWT in cookie ☐ name, ☐ lifetime, ☐ path restriction, ☐ rotation on use     |
| Cookie flags  | `httpOnly`, `Secure`, `SameSite` ☐ (value), ☐ domain/path                   |
| CSRF token    | Fetched from `GET /api/v1/csrf-token`, kept **in memory only**              |
| CSRF header   | ☐ header name (sent on every state-changing request: POST/PUT/PATCH/DELETE) |

### Endpoints (confirmed by the backend developer)

| Method                     | Path                    | Purpose                                            |
| -------------------------- | ----------------------- | -------------------------------------------------- |
| GET                        | `/api/v1/csrf-token`    | Returns the CSRF token (schema in Swagger)         |
| POST ☐ (method to confirm) | `/api/v1/refresh-token` | Uses the refresh cookie to issue new token cookies |

☐ Other auth endpoints (login, register, logout, Google OAuth, email verification, password reset) are to be listed here from Swagger.

### Guard order on the backend

CSRF validation → authentication → authorization. A missing/invalid CSRF token is rejected before any DB or cache work.

### Frontend flow

1. **App start:** call `GET /csrf-token`, keep the token in memory.
2. **Every non-GET request:** add the CSRF header.
3. **On `401`:** call `POST /refresh-token` **once** (single-flight: concurrent requests wait for the same refresh), then retry the original request once.
4. **Refresh fails (401/403):** clear client auth state and redirect to login.
5. **On CSRF failure (403):** refetch the CSRF token, retry once. ☐ Does the token change after login/refresh/logout?
6. **After login/logout:** refetch the CSRF token if it is tied to the session ☐.

### CORS / cookies between frontend and backend

- The backend must allow the exact frontend origin (no `*`) with `Access-Control-Allow-Credentials: true`.
- Allowed request headers must include the CSRF header.
- ☐ Domains: if frontend and backend are on different sites, `SameSite=None; Secure` is required; if same site (subdomains), `Lax` or `Strict` can work.

## 5. Pagination (D-021)

Cursor-based. Request: `?cursor=<opaque>&limit=<n>`. Response uses `meta`:

```json
{ "data": [ ... ], "meta": { "nextCursor": "opaque-string-or-null" } }
```

- `nextCursor: null` means this is the last page. There is no `hasMore` field.
- Send `nextCursor` back unchanged as `cursor` to get the next page; never parse or build cursors on the client.
- ☐ Default and max `limit`, whether `meta` echoes `limit`, sorting and filters combined with cursors.

## 6. Conventions

- Resource paths are plural nouns, kebab-case: `/api/v1/blog-posts`.
- JSON fields: camelCase. IDs are UUID strings (or numeric for high-volume tables; see Swagger).
- Money: integers in the agreed unit ☐ (D-014). Never floats.
- Idempotency: `GET`, `PUT`, `DELETE` are idempotent. ☐ Idempotency keys for payments/orders.
- Breaking changes: new version (`/api/v2`). Additive changes (new optional fields) are non-breaking; the frontend must ignore unknown fields.
- Rate limits (Throttler): `429`; ☐ whether `Retry-After` is sent.

## 7. Types for the frontend

Generate from Swagger: `openapi-typescript` against `/api-json`. The envelope must appear in Swagger too (e.g. a generic wrapper decorator on each endpoint) so generated types include `message/code/timestamp/path/data/meta`. Shared hand-written envelope types for the client wrapper:

```ts
export interface ApiSuccess<T, M = Record<string, unknown>> {
  message: string;
  code: string;
  timestamp: string;
  path: string;
  data: T;
  meta?: M;
}

export interface ApiError {
  message: string;
  code: string;
  timestamp: string;
  path: string;
  // errors?: { field: string; message: string }[]   // ☐ proposed for VALIDATION_ERROR
}
```

## 8. Change process

- Backend changes an endpoint: update Swagger in the same PR, fill "API changes" in the PR, notify the frontend developer.
- Frontend runs `api:gen` and fixes TypeScript errors.
- Any change to the sections above is recorded in `DECISIONS.md` and this file.
