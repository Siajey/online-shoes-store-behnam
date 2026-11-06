import { describe, expect, it } from "vitest";
import { toAddress, toAddresses } from "./mappers";

const dto = (id: string, isDefault: boolean) => ({
  id,
  province: "تهران",
  city: "تهران",
  street: "خیابان آزادی",
  postalCode: "1234567890",
  isDefault,
  profileId: "p",
});

describe("address mappers", () => {
  it("فقط فیلدهای لازم را نگه می‌دارد", () => {
    expect(toAddress(dto("1", true))).toEqual({
      id: "1",
      province: "تهران",
      city: "تهران",
      street: "خیابان آزادی",
      postalCode: "1234567890",
      isDefault: true,
    });
  });
  it("پیش‌فرض را اول می‌آورد", () => {
    expect(toAddresses([dto("1", false), dto("2", true)]).map((a) => a.id)).toEqual(["2", "1"]);
  });
});
