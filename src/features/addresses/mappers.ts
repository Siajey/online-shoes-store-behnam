import type { AddressDto } from "./dto";
import type { Address } from "./types";

export function toAddress(dto: AddressDto): Address {
  return {
    id: dto.id,
    province: dto.province,
    city: dto.city,
    street: dto.street,
    postalCode: dto.postalCode,
    isDefault: dto.isDefault === true,
  };
}

/** آدرس پیش‌فرض اول، بقیه به ترتیب بک‌اند. */
export function toAddresses(dtos: readonly AddressDto[]): Address[] {
  const list = dtos.map(toAddress);
  return [...list.filter((a) => a.isDefault), ...list.filter((a) => !a.isDefault)];
}
