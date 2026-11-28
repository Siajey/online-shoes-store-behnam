import { toPersianDigits } from "@/lib/format";

export const shippingCopy = {
  needAddress: "برای دیدن روش‌ها و هزینه‌ی ارسال، ابتدا یک آدرس انتخاب کنید.",
  loading: "در حال محاسبه‌ی هزینه‌ی ارسال",
  loadError: "هزینه‌ی ارسال محاسبه نشد.",
  none: "برای این آدرس روش ارسالی در دسترس نیست. آدرس دیگری انتخاب کنید.",
  unavailable: "برای این آدرس در دسترس نیست",
  free: "رایگان",
  needMethod: "برای ادامه، یک روش ارسال انتخاب کنید.",
  eta: (min: number, max: number) =>
    min === max
      ? `حدود ${toPersianDigits(min)} روز کاری`
      : `${toPersianDigits(min)} تا ${toPersianDigits(max)} روز کاری`,
  errors: {
    methodUnavailable: "این روش ارسال برای سفارش شما در دسترس نیست. روش دیگری انتخاب کنید.",
    destination: "آدرس انتخاب‌شده برای ارسال معتبر نیست. آدرس را بررسی کنید.",
  },
} as const;
