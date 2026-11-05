import { describe, expect, it } from "vitest";
import { formatCountdown } from "./countdown";

describe("formatCountdown", () => {
  it.each([
    [0, "۰۰:۰۰"],
    [5, "۰۰:۰۵"],
    [65, "۰۱:۰۵"],
    [120, "۰۲:۰۰"],
    [-3, "۰۰:۰۰"],
    [59.9, "۰۰:۵۹"],
  ])("%s ثانیه", (sec, out) => {
    expect(formatCountdown(sec)).toBe(out);
  });
});
