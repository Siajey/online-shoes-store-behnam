import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

/** صفحه‌ی موقت برای دیدن کامپوننت‌ها؛ فقط در حالت توسعه باز می‌شود. */
export default function UiPlayground() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 p-6">
      <h1 className="text-2xl font-medium">دکمه (Button)</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-fg-muted">واریانت‌ها</h2>
        <Button>افزودن به سبد</Button>
        <Button variant="secondary">مقایسه</Button>
        <Button variant="outline">مشاهده جزئیات</Button>
        <Button variant="ghost">انصراف</Button>
        <Button variant="danger">حذف آدرس</Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-fg-muted">اندازه‌ها</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">کوچک</Button>
          <Button size="md">متوسط</Button>
          <Button size="lg">بزرگ</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-fg-muted">حالت‌ها</h2>
        <Button disabled>غیرفعال</Button>
        <Button loading>در حال ثبت</Button>
        <Button fullWidth>تمام‌عرض</Button>
      </section>
    </main>
  );
}
