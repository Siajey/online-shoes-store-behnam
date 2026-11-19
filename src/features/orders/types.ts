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
  canPay: boolean;
  expiresAt: string | null;
  timeline: { status: OrderStatus; note: string | null; at: string }[];
};

export type OrderPage = { items: OrderSummary[]; nextCursor: string | null };

export type OrderStatusAction =
  | { action: "startProcessing"; note?: string }
  | { action: "ship"; carrier?: string | null; trackingCode?: string | null; note?: string }
  | { action: "deliver"; note?: string }
  | { action: "cancel"; note?: string };
