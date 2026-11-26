import type { CouponDto, CouponUsageDto, DiscountDto } from "./dto";
import type { AdminCoupon, AdminDiscount, CouponUsage } from "./types";

export function toAdminDiscount(dto: DiscountDto): AdminDiscount {
  return {
    id: dto.id,
    name: dto.name,
    kind: dto.kind,
    value: dto.value,
    maxDiscountPerUnit: dto.maxDiscountPerUnit,
    scope: dto.scope,
    startsAt: dto.startsAt,
    endsAt: dto.endsAt,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
  };
}

export function toAdminCoupon(dto: CouponDto): AdminCoupon {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    kind: dto.kind,
    value: dto.value,
    maxDiscount: dto.maxDiscount,
    minOrderAmount: dto.minOrderAmount,
    scope: dto.scope,
    applyToDiscountedItems: dto.applyToDiscountedItems,
    startsAt: dto.startsAt,
    endsAt: dto.endsAt,
    usageLimitTotal: dto.usageLimitTotal,
    usageLimitPerUser: dto.usageLimitPerUser,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
  };
}

export const toCouponUsage = (dto: CouponUsageDto): CouponUsage => ({
  reserved: dto.reserved,
  committed: dto.committed,
  released: dto.released,
  totalDiscount: dto.totalDiscount,
});
