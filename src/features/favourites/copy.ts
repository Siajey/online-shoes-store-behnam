import { toPersianDigits } from "@/lib/format";

/** متن‌های ثابت فیچر علاقه‌مندی‌ها. */
export const favouritesCopy = {
  title: "علاقه‌مندی‌ها",
  loading: "در حال بارگذاری علاقه‌مندی‌ها",
  empty: "هنوز کالایی را به علاقه‌مندی‌ها اضافه نکرده‌اید.",
  emptyHint: "روی آیکن قلب کنار هر کالا بزنید تا اینجا نگه داشته شود.",
  startShopping: "مشاهده‌ی محصولات",
  syncError: "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.",
  retry: "تلاش دوباره",
  loadMore: "نمایش بیشتر",
  loadingMore: "در حال بارگذاری…",
  mergeSkipped: (n: number) =>
    `${toPersianDigits(n)} کالا از علاقه‌مندی‌های مرورگر به حساب اضافه نشد.`,
  note: "این فهرست فقط در همین مرورگر ذخیره می‌شود. قیمت و موجودی ممکن است تغییر کرده باشد.",
  added: (name: string) => `«${name}» به علاقه‌مندی‌ها اضافه شد.`,
  removed: (name: string) => `«${name}» از علاقه‌مندی‌ها حذف شد.`,
} as const;
