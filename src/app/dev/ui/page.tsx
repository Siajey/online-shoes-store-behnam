import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { ProductCard } from "@/features/products/components/product-card";

/** صفحه‌ی موقت برای دیدن کامپوننت‌ها؛ فقط در حالت توسعه باز می‌شود. */
export default function UiPlayground() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-md flex-col gap-10 p-6">
      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">تغییر تم (ThemeToggle)</h1>
        <ThemeToggle />
      </section>

      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium">دکمه (Button)</h1>
        <h2 className="text-fg-muted">واریانت‌ها</h2>
        <Button>افزودن به سبد</Button>
        <Button variant="secondary">مقایسه</Button>
        <Button variant="outline">مشاهده جزئیات</Button>
        <Button variant="ghost">انصراف</Button>
        <Button variant="danger">حذف آدرس</Button>
        <h2 className="text-fg-muted">اندازه‌ها</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">کوچک</Button>
          <Button size="md">متوسط</Button>
          <Button size="lg">بزرگ</Button>
        </div>
        <h2 className="text-fg-muted">حالت‌ها</h2>
        <Button disabled>غیرفعال</Button>
        <Button loading>در حال ثبت</Button>
        <Button fullWidth>تمام‌عرض</Button>
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">فیلد ورودی (Input)</h1>
        <Input label="نام و نام خانوادگی" placeholder="مثلاً علی رضایی" />
        <Input
          label="شماره موبایل"
          placeholder="09123456789"
          inputMode="tel"
          autoComplete="tel"
          hint="کد تأیید به این شماره پیامک می‌شود"
          ltr
        />
        <Input
          label="کد تأیید"
          defaultValue="12"
          inputMode="numeric"
          maxLength={6}
          error="کد واردشده کامل نیست"
          ltr
        />
        <Input label="کد پستی" defaultValue="1234567890" disabled />
      </section>

      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium">برچسب (Badge)</h1>
        <h2 className="text-fg-muted">واریانت‌ها</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>پیش‌فرض</Badge>
          <Badge variant="brand">جدید</Badge>
          <Badge variant="success">موجود</Badge>
          <Badge variant="warning">تخفیف ویژه</Badge>
          <Badge variant="danger">ناموجود</Badge>
        </div>
        <h2 className="text-fg-muted">وضعیت سفارش (با نقطه)</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning" dot>
            در انتظار پرداخت
          </Badge>
          <Badge variant="brand" dot>
            در حال آماده‌سازی
          </Badge>
          <Badge variant="success" dot>
            تحویل شد
          </Badge>
          <Badge variant="danger" dot>
            لغو شد
          </Badge>
        </div>
        <h2 className="text-fg-muted">اندازه‌ی کوچک</h2>
        <div className="flex flex-wrap gap-2">
          <Badge size="sm" variant="brand">
            ۲۰٪ تخفیف
          </Badge>
          <Badge size="sm" variant="success">
            ارسال رایگان
          </Badge>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">کارت محصول (ProductCard)</h1>
        <ProductCard
          name="کتانی آبی اسپرت"
          href="/dev/ui"
          price={2_190_000}
          tag="پرفروش"
          image={<div className="bg-brand/30 size-28 rounded-full" />}
        />
        <ProductCard
          name="کفش رسمی چرم طبیعی"
          href="/dev/ui"
          price={3_450_000}
          favourite
          image={<div className="bg-warn/30 size-28 rounded-full" />}
        />
      </section>
    </main>
  );
}
