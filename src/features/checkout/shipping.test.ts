import { describe, expect, it } from "vitest";
import { SHIPPING_METHODS } from "./shipping";

describe("SHIPPING_METHODS", () => {
  it("فقط پست پیشتاز و تیپاکس", () => {
    expect(SHIPPING_METHODS.map((m) => m.id)).toEqual(["post-pishtaz", "tipax"]);
  });
});
