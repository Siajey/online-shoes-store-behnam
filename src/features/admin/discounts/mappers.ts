import { rialToToman } from "@/lib/money";
import type { CouponDto, CouponUsageDto, DiscountDto } from "./dto";
import type { AdminCoupon, AdminDiscount, CouponUsage, DiscountKind } from "./types";

const money = (n: number | null) => (n === null ? null : rialToToman(n));
/** مقدار تخفیف: درصد همان‌طور که هست؛ مبلغ ثابت از ریال به تومان. */
const valueOf = (kind: DiscountKind, value: number) =>
  kind === "fixed" ? rialToToman(value) : value;

export function toAdminDiscount(dto: DiscountDto): AdminDiscount {
  return {
    id: dto.id,
    name: dto.name,
    kind: dto.kind,
    value: valueOf(dto.kind, dto.value),
    maxDiscountPerUnit: money(dto.maxDiscountPerUnit),
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
    value: valueOf(dto.kind, dto.value),
    maxDiscount: money(dto.maxDiscount),
    minOrderAmount: money(dto.minOrderAmount),
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
  totalDiscount: rialToToman(dto.totalDiscount),
});
