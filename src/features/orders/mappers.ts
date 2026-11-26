import { mediaUrl } from "@/lib/media";
import type { OrderDetailDto, OrderLineDto, OrderListDto, OrderSummaryDto } from "./dto";
import type { OrderDetail, OrderLine, OrderPage, OrderSummary } from "./types";

const labelOf = (attrs: OrderLineDto["attributes"]): string =>
  attrs.map((a) => String(a.value)).join(" · ");

export function toOrderSummary(dto: OrderSummaryDto): OrderSummary {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    status: dto.status,
    itemCount: dto.itemCount,
    total: dto.total,
    imageUrl: dto.previewImageUrl || mediaUrl(dto.previewImageKey),
    createdAt: dto.createdAt,
    paidAt: dto.paidAt,
    customer: typeof dto.recipient === "string" ? dto.recipient : undefined,
  };
}

export function toOrderPage(dto: OrderListDto): OrderPage {
  return { items: dto.items.map(toOrderSummary), nextCursor: dto.nextCursor ?? null };
}

const toLine = (l: OrderLineDto): OrderLine => ({
  variantId: l.variantId,
  productId: l.productId,
  name: l.productName,
  slug: l.productSlug,
  imageUrl: l.imageUrl || mediaUrl(l.imageKey),
  variantLabel: labelOf(l.attributes),
  quantity: l.quantity,
  originalUnitPrice: l.originalUnitPrice,
  unitPrice: l.unitPrice,
  lineTotal: l.lineTotal,
  sku: l.sku,
});

export function toOrderDetail(dto: OrderDetailDto): OrderDetail {
  const r = dto.recipient;
  const recipient =
    typeof r === "string"
      ? { name: r, phone: "" }
      : { name: [r.firstName, r.lastName].filter(Boolean).join(" "), phone: r.phoneNumber };
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    status: dto.status,
    itemCount: dto.itemCount,
    total: dto.total,
    imageUrl: dto.previewImageUrl || mediaUrl(dto.previewImageKey),
    createdAt: dto.createdAt,
    paidAt: dto.paidAt,
    totals: {
      subtotal: dto.totals.subtotal,
      productDiscountTotal: dto.totals.productDiscountTotal,
      couponDiscount: dto.totals.couponDiscount,
      shippingFee: dto.totals.shippingFee,
      total: dto.totals.total,
    },
    couponCode: dto.coupon?.code ?? null,
    lines: dto.lines.map(toLine),
    address: dto.shippingAddress,
    recipient,
    carrier: dto.shipment?.carrier ?? null,
    trackingCode: dto.shipment?.trackingCode ?? null,
    canPay: dto.canPay,
    expiresAt: dto.expiresAt,
    timeline: dto.timeline.map((t) => ({ status: t.status, note: t.note, at: t.at })),
  };
}
