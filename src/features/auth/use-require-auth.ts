"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./use-auth";

/** مثل useAuth؛ فقط مهمان را به /login می‌فرستد و بعد از ورود به next برمی‌گرداند. */
export function useRequireAuth(next: string) {
  const router = useRouter();
  const auth = useAuth();
  useEffect(() => {
    if (auth.status === "guest") router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [auth.status, next, router]);
  return auth;
}
