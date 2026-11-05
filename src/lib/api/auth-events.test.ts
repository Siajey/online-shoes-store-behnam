import { describe, expect, it, vi } from "vitest";
import { emitAuthLost, onAuthLost } from "./auth-events";

describe("auth-events", () => {
  it("شنونده‌ها خبر می‌شوند و بعد از لغو دیگر خبر نمی‌شوند", () => {
    const listener = vi.fn();
    const off = onAuthLost(listener);
    emitAuthLost();
    off();
    emitAuthLost();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
