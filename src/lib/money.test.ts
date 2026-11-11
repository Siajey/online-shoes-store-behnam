import { describe, expect, it } from "vitest";
import { rialToToman, tomanToRial } from "./money";

describe("money", () => {
  it("ریال به تومان و برعکس", () => {
    expect(rialToToman(36_000_000)).toBe(3_600_000);
    expect(tomanToRial(3_600_000)).toBe(36_000_000);
  });
  it("رند می‌شود", () => {
    expect(rialToToman(15)).toBe(2);
    expect(rialToToman(0)).toBe(0);
  });
});
