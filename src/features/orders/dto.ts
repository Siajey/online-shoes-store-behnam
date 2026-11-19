/** شکل پاسخ API سفارش بک‌اند (مبلغ‌ها به ریال). فقط mapper این‌ها را می‌خواند. */
export type OrderStatusDto =
  "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "expired";

export type OrderSummaryDto = {
  id: string;
  orderNumber: number;
  status: OrderStatusDto;
  itemCount: number;
  total: number;
  currency: string;
  previewImageKey: string | null;
  createdAt: string;
  paidAt: string | null;
  /** فقط در لیست ادمین */
  userId?: string;
  recipient?: string;
};

export type OrderLineDto = {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageKey: string | null;
  attributes: { name: string; value: string | number }[];
  quantity: number;
  originalUnitPrice: number;
  unitPrice: number;
  couponAllocation: number;
  lineTotal: number;
  /** فقط ادمین */
  sku?: string;
  externalSource?: string | null;
  externalId?: string | null;
};

export type OrderDetailDto = Omit<OrderSummaryDto, "recipient" | "userId"> & {
  totals: {
    subtotal: number;
    productDiscountTotal: number;
    couponDiscount: number;
    shippingFee: number;
    total: number;
  };
  coupon: { code: string } | null;
  lines: OrderLineDto[];
  shippingAddress: { province: string; city: string; street: string; postalCode: string };
  recipient: { firstName: string; lastName: string; phoneNumber: string } | string;
  shipment: { carrier: string | null; trackingCode: string | null };
  canPay: boolean;
  expiresAt: string | null;
  timeline: { status: OrderStatusDto; note: string | null; at: string; actorId?: string | null }[];
  userId?: string;
};

export type OrderListDto = { items: OrderSummaryDto[]; nextCursor: string | null };
