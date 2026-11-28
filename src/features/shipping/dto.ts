/** شکل پاسخ GET /shipping/options (مبلغ‌ها به تومان). فقط mapper این‌ها را می‌خواند. */
export type EstimatedDaysDto = { min: number; max: number };

export type ShippingOptionDto = {
  methodCode: string;
  name: string;
  description: string | null;
  available: boolean;
  /** فقط وقتی available باشد */
  fee?: number;
  isFree?: boolean;
  estimatedDays?: EstimatedDaysDto | null;
};

export type ShippingOptionsDto = { options: ShippingOptionDto[] };
