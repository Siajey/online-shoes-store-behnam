import type { AuthState } from "@/features/auth/store";

export type AdminAccess = "loading" | "guest" | "forbidden" | "error" | "ok";

/**
 * وضعیت دسترسی به پنل. نقش از GET /users/me می‌آید؛ این فقط راحتی رابط است
 * و امنیت واقعی را بک‌اند با @AdminOnly تضمین می‌کند.
 */
export function adminAccess(state: AuthState): AdminAccess {
  switch (state.status) {
    case "unknown":
      return "loading";
    case "guest":
      return "guest";
    case "error":
      return "error";
    case "authenticated":
      return state.user.role === "admin" ? "ok" : "forbidden";
  }
}
