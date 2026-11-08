# کفش بهنام — فرانت‌اند

فروشگاه آنلاین کفش، فارسی و راست‌به‌چپ (RTL)، موبایل‌اول. ساخته‌شده با Next.js (App Router)، React 19، TypeScript و Tailwind CSS v4. بک‌اند در ریپوی جدا (NestJS) است.

## اجرا

نیازمندی‌ها: Node 22 و pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

فرانت روی `http://localhost:3001` بالا می‌آید و بک‌اند محلی باید روی `http://localhost:3000` اجرا باشد (CORS بک‌اند فقط همین origin را مجاز می‌داند).

## متغیرهای محیطی

| نام                    | کاربرد                                             |
| ---------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | آدرس بک‌اند (پیش‌فرض محلی `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | آدرس عمومی سایت برای `sitemap` و `robots`          |

فایل‌های `.env*` به گیت نمی‌روند؛ فقط `.env.example` ثبت می‌شود.

## دستورها

| دستور            | کار                       |
| ---------------- | ------------------------- |
| `pnpm dev`       | اجرای توسعه روی پورت ۳۰۰۱ |
| `pnpm lint`      | بررسی ESLint              |
| `pnpm typecheck` | بررسی تایپ‌ها             |
| `pnpm test`      | تست‌های Vitest            |
| `pnpm build`     | ساخت نسخه‌ی production    |

قبل از هر PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. CI همین چهار مرحله را اجرا می‌کند. کامیت‌ها با commitlint بررسی می‌شوند (قالب conventional، خط‌های بدنه حداکثر ۱۰۰ نویسه).

## ساختار

```
src/
  app/          فقط چینش صفحه‌ها (مسیرها)
  features/     منطق فروشگاهی: products، cart، favourites، auth، addresses، checkout، info...
  components/   کامپوننت‌های عمومی بدون منطق فروشگاه (ui، layout)
  lib/          کلاینت API، قالب‌بندی، ابزارهای مشترک
  config/       تنظیمات سایت و ناوبری
docs/           تصمیم‌ها و قرارداد API
```

## مستندات

- [`docs/PROJECT.md`](docs/PROJECT.md): خلاصه‌ی پروژه، قواعد و مراحل
- [`docs/DECISIONS.md`](docs/DECISIONS.md): تصمیم‌های معماری (D-001 به بعد)
- [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md): قرارداد API با بک‌اند
- [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md): راه‌اندازی قدم‌به‌قدم
- [`docs/FRONTEND_STRUCTURE.md`](docs/FRONTEND_STRUCTURE.md): ساختار فرانت
- [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md): روند گیت و PR

## وضعیت

ورود با کد پیامکی، حساب (نام و آدرس‌ها)، سبد و علاقه‌مندی‌های مهمان، تسویه (بدون ثبت سفارش) و صفحه‌های اطلاعاتی آماده‌اند. محصولات، سفارش و پرداخت منتظر API بک‌اندند و داده‌ی ساختگی ساخته نمی‌شود (D-014).
