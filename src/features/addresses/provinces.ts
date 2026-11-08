/** استان‌های ایران (۳۱ استان) به ترتیب الفبا؛ نام‌ها همان است که در آدرس ذخیره می‌شود. */
export const PROVINCES = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
] as const;

/** برای مقایسه: ی و ک عربی، فاصله، نیم‌فاصله و پیشوند «استان» نادیده گرفته می‌شوند. */
export function normalizeName(name: string): string {
  return name
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/^\s*استان\s+/, "")
    .replace(/[\s‌]+/g, "")
    .trim();
}

/** نام استان از هر شکلی (مثل «استان تهران») به نام استاندارد؛ اگر نبود null. */
export function matchProvince(name: string | undefined): string | null {
  if (!name) return null;
  const wanted = normalizeName(name);
  return PROVINCES.find((p) => normalizeName(p) === wanted) ?? null;
}

/** گزینه‌های انتخاب استان؛ اگر مقدار فعلی (مثلاً آدرس قدیمی) در فهرست نبود، جداگانه اضافه می‌شود تا گم نشود. */
export function provinceOptions(current: string): { value: string; label: string }[] {
  const list: string[] = [...PROVINCES];
  if (current && !list.includes(current)) list.unshift(current);
  return list.map((p) => ({ value: p, label: p }));
}
