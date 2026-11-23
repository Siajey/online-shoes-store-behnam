import { toPersianDigits } from "@/lib/format";

export type ShoeKind = "runner" | "retro" | "chunky";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  /** رنگ دایره‌ی پشت کفش، دکمه و نقطه‌ی فعال */
  disc: string;
  upper: string;
  stripe: string;
  shoe: ShoeKind;
  badge: { top: string; bottom: string };
  /**
   * عکس پس‌زمینه‌ی کارت (اختیاری)، بدون هیچ متن و لوگو داخلش؛ متن و دکمه روی آن می‌آیند.
   * دسکتاپ ۱۶۰۰×۱۱۶۰ (کفش سمت چپ، نیمه‌ی راست خالی) و موبایل ۷۲۰×۱۲۸۰ (کفش بالا، پایین خالی).
   * مسیر در public، مثلاً /hero/nike-desktop.webp. اگر نباشد، کفش برداری نشان داده می‌شود.
   */
  bg?: { desktop: string; mobile: string };
  /** false: اسلاید ساخته شده ولی نمایش داده نمی‌شود (مثلاً تا وقتی کمپین واقعی نیست). */
  active: boolean;
};

/** ☐ فقط وقتی کمپین تخفیف واقعی هست، عدد را درست کن و active اسلاید «sale» را true بگذار. */
export const SALE_PERCENT = 30;

/**
 * اسلایدها فعلاً ثابت‌اند؛ وقتی بک‌اند API بنر داد، همین شکل از سرور می‌آید.
 * ☐ href برند را وقتی شناسه‌ی برند (brandId) یا اسلاگ آن مشخص شد به فیلتر برند تغییر بده.
 */
export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "winter",
    eyebrow: "کالکشن جدید زمستان",
    title: "قدم‌هات رو گرم‌تر و شیک‌تر کن",
    sub: "از کتانی‌های روزمره تا کفش‌های رسمی؛ تازه‌ترین مدل‌ها همین حالا در کفش بهنام.",
    cta: "مشاهده‌ی جدیدترین‌ها",
    href: "/products",
    disc: "#5b9fe3",
    upper: "#ffffff",
    stripe: "#14202b",
    shoe: "runner",
    badge: { top: "جدید", bottom: "زمستان" },
    active: true,
  },
  {
    id: "sale",
    eyebrow: "حراج ویژه‌ی محدود",
    title: `تا ${toPersianDigits(SALE_PERCENT)}٪ تخفیف روی کفش‌های منتخب`,
    sub: "قبل از تمام شدن موجودی، مدل مورد علاقه‌ات را با قیمت ویژه بخر.",
    cta: "خرید با تخفیف",
    href: "/products",
    disc: "#f2b84b",
    upper: "#14202b",
    stripe: "#ffffff",
    shoe: "runner",
    badge: { top: `${toPersianDigits(SALE_PERCENT)}٪`, bottom: "تخفیف" },
    active: false,
  },
  {
    id: "nike",
    eyebrow: "برند نایک",
    title: "کالکشن نایک در کفش بهنام",
    sub: "کتانی‌های ورزشی و روزمره‌ی نایک را ببین و سایز و رنگ دلخواهت را انتخاب کن.",
    cta: "دیدن محصولات نایک",
    href: "/products",
    disc: "#e5532d",
    upper: "#ffffff",
    stripe: "#14202b",
    shoe: "runner",
    badge: { top: "نایک", bottom: "کالکشن" },
    active: true,
  },
  {
    id: "puma",
    eyebrow: "برند پوما",
    title: "استایل خیابانی با پوما",
    sub: "مدل‌های کلاسیک و جدید پوما برای استایل روزمره، همه با ارسال سریع.",
    cta: "دیدن محصولات پوما",
    href: "/products",
    disc: "#59c7be",
    upper: "#14202b",
    stripe: "#f4f6f9",
    shoe: "retro",
    badge: { top: "پوما", bottom: "کالکشن" },
    active: true,
  },
  {
    id: "asics",
    eyebrow: "برند آسیکس",
    title: "راحتی برای دویدن با آسیکس",
    sub: "کفش‌های دویدن و پیاده‌روی آسیکس، برای هر روز و هر مسافت.",
    cta: "دیدن محصولات آسیکس",
    href: "/products",
    disc: "#9b8cff",
    upper: "#ffffff",
    stripe: "#59c7be",
    shoe: "chunky",
    badge: { top: "آسیکس", bottom: "کالکشن" },
    active: true,
  },
];

export const activeSlides = (all: readonly HeroSlide[] = HERO_SLIDES): HeroSlide[] =>
  all.filter((s) => s.active);

/** اندیس بعدی/قبلی با چرخش از انتها به ابتدا. */
export const stepIndex = (index: number, delta: number, count: number): number =>
  count <= 0 ? 0 : (((index + delta) % count) + count) % count;

export type AsideTile = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  tone: "surface" | "brand";
};

export const ASIDE_TILES: readonly AsideTile[] = [
  {
    id: "new",
    eyebrow: "تازه رسیده",
    title: "جدیدترین مدل‌های هفته",
    text: "پیش از همه ببینید چه چیزی به فروشگاه اضافه شده.",
    cta: "مشاهده",
    href: "/products",
    tone: "surface",
  },
  {
    id: "categories",
    eyebrow: "همه‌ی دسته‌ها",
    title: "کفش مناسب هر موقعیت",
    text: "ورزشی، روزمره و رسمی؛ از دسته‌بندی‌ها شروع کن.",
    cta: "دیدن دسته‌ها",
    href: "#categories",
    tone: "brand",
  },
];
