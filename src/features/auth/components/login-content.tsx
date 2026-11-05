import { safeNext } from "../redirect";
import { LoginForm } from "./login-form";

export type LoginSearchParams = { next?: string | string[] };

/**
 * خواندن searchParams داده‌ی زمان درخواست است؛ باید داخل <Suspense> باشد.
 * پارامتر next پاک‌سازی می‌شود تا فقط مسیر داخلی بماند.
 */
export async function LoginContent({ searchParams }: { searchParams: Promise<LoginSearchParams> }) {
  const { next } = await searchParams;
  return <LoginForm next={safeNext(Array.isArray(next) ? next[0] : next)} />;
}
