import { describe, expect, it } from "vitest";
import { WELCOME_KEY, hasSeenWelcome, markWelcomeSeen, shouldShowWelcome } from "./welcome";

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
};

describe("welcome", () => {
  it("بار اول دیده نشده است و بعد از ثبت دیده شده", () => {
    const s = memory();
    expect(hasSeenWelcome(s)).toBe(false);
    markWelcomeSeen(s);
    expect(s.getItem(WELCOME_KEY)).toBe("1");
    expect(hasSeenWelcome(s)).toBe(true);
  });
  it("بدون حافظه یا با حافظه‌ی خطادار هرگز خطا نمی‌دهد", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(hasSeenWelcome(null)).toBe(false);
    expect(hasSeenWelcome(broken)).toBe(false);
    expect(() => markWelcomeSeen(broken)).not.toThrow();
    expect(() => markWelcomeSeen(null)).not.toThrow();
  });
  it("فقط موبایل و فقط بار اول", () => {
    expect(shouldShowWelcome({ isMobile: true, seen: false })).toBe(true);
    expect(shouldShowWelcome({ isMobile: true, seen: true })).toBe(false);
    expect(shouldShowWelcome({ isMobile: false, seen: false })).toBe(false);
  });
});
