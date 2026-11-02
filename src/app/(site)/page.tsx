import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";

/** صفحه‌ی موقت برای بررسی RTL، فونت و tokens. در فاز ۲ با صفحه‌ی اصلی واقعی جایگزین می‌شود. */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-medium">{siteConfig.name}</h1>
      <p className="text-fg-muted">راه‌اندازی فاز ۰ انجام شد.</p>
      <div className="bg-surface rounded-card flex items-center justify-between p-5">
        <span className="text-fg-secondary">کتانی آبی اسپرت</span>
        <span className="font-semibold">{formatPrice(2_190_000)}</span>
      </div>
      <button type="button" className="bg-brand text-on-brand h-13 rounded-full px-7 font-medium">
        افزودن به سبد
      </button>
    </main>
  );
}
