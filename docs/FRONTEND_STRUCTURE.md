# FRONTEND_STRUCTURE.md — ساختار پوشه‌ها (Next.js App Router)

## ایده‌ی اصلی

سه لایه، با جهت وابستگی یک‌طرفه:

```
app/  ──►  features/  ──►  components/ui  +  lib/
(چینش صفحه)  (منطق فروشگاه)   (عمومی و قابل استفاده‌ی مجدد)
```

- لایه‌ی پایین هرگز لایه‌ی بالا را import نمی‌کند.
- `components/ui` و `lib` باید بتوانند عیناً در پروژه‌ی فروشگاهی بعدی کپی (و بعداً به پکیج تبدیل) شوند.

## درخت پیشنهادی

```
.
├─ docs/                      PROJECT.md، DECISIONS.md، STYLE_GUIDE.md، GIT_WORKFLOW.md
├─ public/                    تصاویر ثابت، فونت‌ها (اگر محلی)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           html lang="fa" dir="rtl"، فونت، providers
│  │  ├─ globals.css          Tailwind + tokens
│  │  ├─ not-found.tsx / error.tsx / loading.tsx
│  │  ├─ (marketing)/         لندینگ و صفحات محتوایی
│  │  │  ├─ page.tsx
│  │  │  └─ about/ faq/ ...
│  │  ├─ (shop)/
│  │  │  ├─ products/page.tsx
│  │  │  ├─ products/[slug]/page.tsx
│  │  │  ├─ cart/page.tsx
│  │  │  └─ checkout/page.tsx
│  │  ├─ (auth)/login/page.tsx
│  │  ├─ (account)/account/   layout با sidebar داشبورد کاربر
│  │  │  ├─ page.tsx          خلاصه
│  │  │  ├─ orders/  addresses/  favorites/  profile/
│  │  └─ (admin)/admin/       layout جدا برای ادمین
│  │     ├─ page.tsx
│  │     ├─ products/  orders/  customers/  discounts/  settings/
│  ├─ components/
│  │  ├─ ui/                  Button، Input، Modal، Badge، Skeleton، ... (بدون منطق فروشگاه)
│  │  └─ layout/              Header، Footer، MobileNav، AccountSidebar، AdminSidebar
│  ├─ features/               هر feature مستقل
│  │  ├─ products/   { components, hooks, api, schemas, types, index.ts }
│  │  ├─ cart/       { components, store, hooks, index.ts }
│  │  ├─ checkout/
│  │  ├─ auth/
│  │  ├─ account/
│  │  ├─ favorites/
│  │  └─ admin/      { products, orders, customers, ... }
│  ├─ lib/
│  │  ├─ api/                 client (fetch wrapper)، خطاها، تایپ‌های تولیدشده (generated/)
│  │  ├─ format/              formatPrice، toPersianDigits، تاریخ
│  │  ├─ utils/               cn() و ابزارهای کوچک
│  │  └─ hooks/               hookهای عمومی (useMediaQuery، useDebounce)
│  ├─ config/                 site.ts (نام برند، لینک‌ها)، env.ts (اعتبارسنجی متغیرها با Zod)
│  ├─ mocks/                  MSW handlers و داده‌ی ساختگی
│  └─ styles/                 tokens.css (رنگ، فاصله، شعاع)
├─ tests/e2e/                 Playwright
├─ .storybook/
├─ .env.example               بدون مقدار واقعی
└─ package.json
```

## قواعد (اجباری با ESLint یا بازبینی PR)

1. **`app/*` فقط چینش است.** منطق، فرم و فراخوانی API داخل `features/*`.
2. **`components/ui` هیچ‌چیز از `features/` و `config/site.ts` import نمی‌کند.** متن و رنگ را props/tokens می‌دهند.
3. **هر feature یک `index.ts` دارد** که فقط API عمومی‌اش را export می‌کند. feature دیگر فقط از همین import کند.
4. **Server Component پیش‌فرض است.** فقط جایی که state، event یا hook لازم است `"use client"` بگذارید و تا حد امکان آن را به برگ‌های درخت ببرید.
5. **نام‌گذاری:** پوشه‌ها `kebab-case`، کامپوننت‌ها `PascalCase.tsx`، hookها `useXxx.ts`، تایپ‌ها `PascalCase`.
6. **ثابت‌ها و متن‌ها:** متن‌های UI فارسی در یک جای مشخص هر feature (مثلاً `copy.ts`) تا بعداً ترجمه یا تغییر ساده باشد.
7. **env:** فقط متغیرهای شروع‌شده با `NEXT_PUBLIC_` به مرورگر می‌رسند؛ هیچ secret با این پیشوند نباید باشد.
8. **import مطلق:** `@/` برای `src/`.

## جای هر چیز

| چیز                           | کجا                            |
| ----------------------------- | ------------------------------ |
| دکمه، ورودی، مودال            | `components/ui`                |
| ProductCard، SizeSelector     | `features/products/components` |
| منطق سبد (افزودن، تعداد، جمع) | `features/cart/store`          |
| فراخوانی `GET /products`      | `features/products/api`        |
| اسکیمای فرم آدرس              | `features/account/schemas`     |
| فرمت پول                      | `lib/format`                   |
| Header و Footer               | `components/layout`            |
| رنگ‌ها و فاصله‌ها             | `styles/tokens.css`            |

## وقتی پروژه‌ی دوم شروع شد

- `components/ui`، `lib/format`، `lib/utils` و featureهای عمومی (`cart`, `products`, `auth`) را به پکیج جدا (در یک monorepo) منتقل کنید.
- داده‌ی خاص هر برند (config، فونت، tokens) داخل هر پروژه بماند.
