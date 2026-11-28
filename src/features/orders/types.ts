/** مدل سفارش در فروشگاه؛ همه‌ی مبلغ‌ها به تومان. */
export type OrderStatus =
  "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "expired";

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "expired",
];

export type OrderSummary = {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  itemCount: number;
  total: number;
  imageUrl?: string;
  createdAt: string;
  paidAt: string | null;
  /** فقط ادمین */
  customer?: string;
};

export type OrderLine = {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  imageUrl?: string;
  variantLabel: string;
  quantity: number;
  originalUnitPrice: number;
  unitPrice: number;
  lineTotal: number;
  sku?: string;
};

export type OrderDetail = Omit<OrderSummary, "customer"> & {
  totals: {
    subtotal: number;
    productDiscountTotal: number;
    couponDiscount: number;
    shippingFee: number;
    total: number;
  };
  couponCode: string | null;
  lines: OrderLine[];
  address: { province: string; city: string; street: string; postalCode: string };
  recipient: { name: string; phone: string };
  carrier: string | null;
  trackingCode: string | null;
  /** نمونه‌ی ثبت‌شده‌ی روش ارسال هنگام سفارش */
  shippingMethod: { code: string; name: string } | null;
  tracking: OrderTracking | null;
  canPay: boolean;
  expiresAt: string | null;
  timeline: { status: OrderStatus; note: string | null; at: string }[];
};

export type TrackingStatus =
  "created" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "returned" | "failed";

export type TrackingEvent = {
  status: string;
  description: string | null;
  location: string | null;
  at: string;
};

/** رهگیری مرسوله؛ تا قبل از ارسال سفارش null است. */
export type OrderTracking = {
  carrier: string | null;
  trackingCode: string | null;
  trackingUrl: string | null;
  /** وضعیت را سرور خودکار به‌روز می‌کند (مثل تیپاکس). */
  autoTracked: boolean;
  status: string | null;
  deliveredAt: string | null;
  events: TrackingEvent[];
};

export type OrderPage = { items: OrderSummary[]; nextCursor: string | null };

export type OrderStatusAction =
  | { action: "startProcessing"; note?: string }
  | { action: "ship"; trackingCode?: string | null; note?: string }
  | { action: "updateTracking"; trackingCode: string; note?: string }
  | { action: "deliver"; note?: string }
  | { action: "cancel"; note?: string };
