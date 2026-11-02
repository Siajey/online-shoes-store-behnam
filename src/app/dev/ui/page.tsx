import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** صفحه‌ی موقت برای دیدن کامپوننت‌ها؛ فقط در حالت توسعه باز می‌شود. */
export default function UiPlayground() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-md flex-col gap-10 p-6">
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
    </main>
  );
}
