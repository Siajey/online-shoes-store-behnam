import { newestFirst } from "./reviews";
import type { Rating, Review } from "./types";

/**
 * ☐ داده‌ی موقت (فیک): فقط تا آماده شدن API نظرات بک‌اند. برای هر کالا همیشه همان نظرها را می‌سازد
 * (بر اساس شناسه‌ی کالا) تا صفحه‌ی سرور و مرورگر یکی بماند. بعد از اتصال به API، این فایل حذف می‌شود.
 */

const NAMES = [
  "سارا م.",
  "علی ر.",
  "مریم ک.",
  "رضا ا.",
  "نگار ح.",
  "امیر ف.",
  "الهام ت.",
  "حسین ب.",
  "فاطمه ص.",
  "مهدی ن.",
  "زهرا ج.",
  "پویا س.",
];

const COMMENTS: Record<Rating, { title?: string; body: string }[]> = {
  5: [
    {
      title: "عالی بود",
      body: "کیفیت از چیزی که فکر می‌کردم بهتر بود و سایز هم دقیق درآمد. راحت و سبک است.",
    },
    {
      title: "پیشنهاد می‌کنم",
      body: "چند هفته است استفاده می‌کنم و هنوز هیچ مشکلی نداشته. دوخت و رویه‌اش تمیز است.",
    },
    {
      body: "بسته‌بندی خوب بود و کفش دقیقاً مثل عکس بود. برای پیاده‌روی طولانی هم خسته‌ام نمی‌کند.",
    },
  ],
  4: [
    {
      title: "خوب و راحت",
      body: "کلی راضی‌ام. فقط کمی تنگ‌تر از انتظارم بود؛ اگر پهن‌پا هستید یک سایز بزرگ‌تر بگیرید.",
    },
    { body: "برای قیمتش ارزش خرید دارد. رنگش در واقعیت کمی تیره‌تر از عکس است ولی قشنگ است." },
  ],
  3: [
    {
      title: "معمولی",
      body: "بد نیست ولی انتظار بیشتری داشتم. چند روز اول پاشنه‌ام را کمی اذیت کرد.",
    },
  ],
  2: [
    {
      title: "راضی نبودم",
      body: "سایز با جدول راهنما نمی‌خواند و مجبور شدم تعویض کنم. کیفیت رویه هم متوسط بود.",
    },
  ],
  1: [{ body: "متأسفانه بعد از دو هفته زیره‌اش شروع به جدا شدن کرد. از این خرید پشیمانم." }],
};

/** هش ثابت رشته (FNV-1a) */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** تولیدکننده‌ی عدد تصادفی قابل‌تکرار (mulberry32) */
function random(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ANCHOR = Date.UTC(2026, 9, 1);
const DAY = 86_400_000;

/** امتیاز بیشتر بیشتر شانس دارد (مثل نظرهای واقعی) */
function pickRating(rand: () => number): Rating {
  const x = rand();
  if (x < 0.5) return 5;
  if (x < 0.78) return 4;
  if (x < 0.9) return 3;
  if (x < 0.96) return 2;
  return 1;
}

export function seededReviews(product: {
  id: string;
  name: string;
  slug: string;
}): readonly Review[] {
  const rand = random(hash(product.id));
  // حدود یک‌ششم کالاها نظر ندارند تا حالت خالی هم دیده شود.
  if (rand() < 0.16) return [];
  const count = 3 + Math.floor(rand() * 7);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i += 1) {
    const rating = pickRating(rand);
    const pool = COMMENTS[rating];
    const text = pool[Math.floor(rand() * pool.length)];
    reviews.push({
      id: `seed-${product.id}-${i}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      authorName: NAMES[Math.floor(rand() * NAMES.length)],
      rating,
      title: text.title,
      body: text.body,
      createdAt: new Date(ANCHOR - Math.floor(rand() * 90) * DAY).toISOString(),
      verifiedPurchase: rand() < 0.6,
    });
  }
  return newestFirst(reviews);
}
