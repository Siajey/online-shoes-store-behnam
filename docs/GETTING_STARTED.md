# GETTING_STARTED.md — شروع کد‌نویسی، قدم به قدم

> هر قدم یک «چک» دارد. تا چک نگذشت، قدم بعد را شروع نکنید.
> ✅ یعنی ابزارهای این بسته (فایل‌های کنار این راهنما) را آزمایش کرده‌ام. ⚠️ یعنی هنوز روی سیستم شما اجرا نشده و باید خروجی را چک کنید.

## قدم ۰ — قبل از کد (۳۰ دقیقه، یک‌بار)

1. در GitHub بنویسید: **Issues → New** و سه Issue بسازید:
   `chore: راه‌اندازی پروژه`، `chore: design tokens و فونت`، `feat: کامپوننت‌های پایه (Button, Input, Badge)`.
2. **GitHub Projects** → Board جدید با ستون‌های `Backlog / In progress / Review / Done`. Issueها را در آن بگذارید و همکارتان را هم اضافه کنید.
3. **Milestone** به‌اندازه‌ی فازهای PROJECT.md بسازید (فاز ۰ تا ۷). هر Issue به یک فاز وصل شود.

> چرا؟ این‌ها همان چیزی است که بعداً در رزومه نشان می‌دهید: «کار با Issue، Board و Milestone مثل یک تیم واقعی».

## قدم ۱ — پروژه را بسازید (دستورها روی سیستم خودتان)

```bash
git clone <آدرس-ریپوی-فرانت> && cd <نام-ریپو>
node -v        # باید ۲۰ یا بالاتر باشد (پیشنهاد ۲۲)
corepack enable && corepack prepare pnpm@latest --activate

pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
pnpm dev       # باید روی localhost:3000 بالا بیاید
```

اگر پوشه خالی نبود (README دارد)، README را موقتاً بیرون ببرید و برگردانید.
**چک:** `pnpm dev` اجرا می‌شود و صفحه‌ی پیش‌فرض Next را می‌بینید.

```bash
git add . && git commit -m "chore: initialize Next.js project" && git push origin main
```

(این تنها کامیت مستقیم روی `main` است.) بعد در GitHub → Settings → Branches برای `main` قانون بگذارید: Require pull request + Require status checks.

## قدم ۲ — ابزارهای کیفیت

```bash
git switch -c chore/setup-tooling

pnpm add -D prettier prettier-plugin-tailwindcss \
  husky lint-staged @commitlint/cli @commitlint/config-conventional \
  vitest @vitejs/plugin-react
pnpm add zod @fontsource-variable/vazirmatn

pnpm exec husky init
echo "pnpm lint-staged" > .husky/pre-commit
echo 'pnpm commitlint --edit "$1"' > .husky/commit-msg
```

در `package.json` این‌ها را اضافه/جایگزین کنید:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "format": "prettier --write ."
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

فایل‌های این بسته را در ریشه‌ی پروژه کپی کنید (روی فایل‌های هم‌نام، جایگزین کنید):
`.prettierrc.json`، `commitlint.config.mjs`، `vitest.config.ts`، `.env.example`، `.github/*`، `src/app/*`، `src/config/*`، `src/lib/format/*`.
و `docs/` را با `PROJECT.md`، `DECISIONS.md`، `FRONTEND_STRUCTURE.md`، `GIT_WORKFLOW.md` (که قبلاً گرفتید) پر کنید.

**چک (هر چهار تا باید بدون خطا باشند):**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

- ⚠️ اگر `pnpm build` درباره‌ی `NEXT_PUBLIC_API_URL` خطا داد: `cp .env.example .env.local` (فایل `env.ts` عمداً بدون مقدار خطا می‌دهد؛ فعلاً در `page.tsx` import نشده، پس برای فاز ۰ اهمیتی ندارد.)
- ✅ تست‌های `formatPrice` و `toPersianDigits` را من اجرا کردم و درست بودند.
- ⚠️ نام فونت `Vazirmatn Variable` را در مرورگر ببینید: صفحه‌ی اصلی باید با فونت وزیرمتن (نه Times/Arial) نمایش داده شود. اگر نبود، فقط خط `--font-sans` در `globals.css` را با نام واقعی package چک کنید.

بعد از ساخت tokens، **حتماً** این دو را در مرورگر بررسی کنید: دکمه‌ی آبی، کارت (گوشه‌ی گرد)، قیمت `۲٬۱۹۰٬۰۰۰ تومان`، و جهت راست‌به‌چپ.

```bash
git add . && git commit -m "chore: add tooling, design tokens and RTL layout"
git push -u origin chore/setup-tooling   # → Pull Request → CI سبز → Squash and merge
```

> نکته: اولین باری که Husky اجرا می‌شود، اگر `pnpm lint-staged` اجرا نشد، `chmod +x .husky/*` بزنید.

## قدم ۳ — ساختار پوشه‌ها

طبق `FRONTEND_STRUCTURE.md` پوشه‌ها را بسازید (فایل خالی `.gitkeep` برای نگه‌داشتن):
`src/components/ui`, `src/components/layout`, `src/features`, `src/lib/api`, `src/mocks`.
اولین PR واقعی: `feat/ui-button` (Button با همه‌ی حالت‌های بوم + Storybook یا صفحه‌ی `/dev/ui` موقت + تست).

## قدم ۴ — ترتیب کار (فازها)

| فاز                                                                                                                          | PR های پیشنهادی                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| ۱                                                                                                                            | `feat/ui-button`، `feat/ui-input`، `feat/ui-badge`، `feat/ui-product-card`، `feat/theme-toggle` |
| ۲                                                                                                                            | `feat/layout-header-footer`، `feat/landing`، `feat/products-list`، `feat/product-page`          |
| ۳                                                                                                                            | `feat/cart-store`، `feat/cart-page`، `feat/checkout`، `feat/login-otp`                          |
| ۴                                                                                                                            | `feat/account-*` (خلاصه، سفارش‌ها، آدرس‌ها، علاقه‌مندی‌ها، پروفایل)                             |
| ۵                                                                                                                            | `feat/admin-*`                                                                                  |
| هر بار به من بگویید «PR بعدی: …» و برد مربوط به آن را مشخص کنید؛ من کد همان تکه را می‌نویسم و شما اجرا/تست و commit می‌کنید. |

## حواستان کجا باشد (قوانین پروژه)

1. **همیشه برنچ** → PR → merge. مستقیم روی `main` کامیت نزنید.
2. **رنگ hex ننویسید.** فقط کلاس‌های tokens: `bg-surface`، `text-fg-muted`، `bg-brand`…
3. **فقط logical properties:** `ms-*`/`me-*`/`ps-*`/`pe-*`/`start-*`/`end-*`. (`ml/mr/left/right` ممنوع.)
4. **هر پول و عدد از `lib/format`** عبور کند.
5. **متن فارسی ثابت** داخل `copy.ts` هر feature، نه پخش در JSX.
6. **`app/*` فقط چینش** است؛ منطق در `features/*`.
7. **هر چیز امنیتی** (ورود، توکن، پرداخت، دسترسی ادمین) را با همکار و دقیق بازبینی کنید. من کد می‌نویسم، اما تأییدش با شماست.
8. **هر کد تولیدشده را اجرا کنید** پیش از commit. اگر خطا داد، خروجی کامل را برای من بفرستید.
9. `.env.local` را هرگز commit نکنید.

## کار تیمی با همکار بک‌اند (برای رزومه، این بخش مهم‌ترین است)

**قرارداد، نه حدس.** یک نشست ۳۰ دقیقه‌ای بگذارید و `docs/API_CONTRACT.md` را با هم پر کنید (پیشنهادهای من داخل فایل است). بعد:

- بک‌اند: Swagger را روی یک آدرس ثابت (staging) نگه دارد؛ هر تغییر API = یک Issue با برچسب `api-contract` + اطلاع به شما.
- شما: بدون API آماده، با **MSW** و داده‌ی هم‌شکل با قرارداد جلو بروید (`NEXT_PUBLIC_USE_MOCKS=true`). وقتی endpoint آماده شد، فقط handler را حذف می‌کنید.
- هر دو: روی PR همدیگر **کامنت/Review** بگذارید، حتی اگر مجبور نیستید. این شواهد کار تیمی است.
- **Staging مشترک**: فرانت روی Vercel (preview برای هر PR)، بک‌اند روی هر هاستی که دارد. اولین هدف: «یک اتصال واقعی» مثل `GET /products`.
- یک جلسه‌ی کوتاه هفتگی (۱۵ دقیقه): چه تمام شد، چه چیزی بلاک است، چه تغییری در API لازم است.

## برای رزومه: از همین الان جمع کنید

- **README** ریپو: اسکرین‌شات/GIF موبایل و دسکتاپ، لینک demo زنده، نمودار ساده‌ی معماری (فرانت ↔ API ↔ DB)، استک، «چطور اجرا کنم».
- **DECISIONS.md** (دلیل هر انتخاب): نشان می‌دهد فکر می‌کنید، نه فقط کد می‌زنید.
- تاریخچه‌ی commit و PR تمیز + Issueهای بسته‌شده + Milestoneها.
- یک بخش «**سهم من**» (فرانت: design system، RTL و فارسی‌سازی، سبد/پرداخت، داشبورد) و «**سهم همکار**» (API، دیتابیس، احراز هویت) در README، و یک جمله از **چالش مشترک** (مثلاً «واحد قیمت»، «احراز هویت با کوکی»).
- اعداد واقعی وقتی داشتید: امتیاز Lighthouse، تعداد صفحه/کامپوننت، پوشش تست. عددی که اندازه نگرفته‌اید ننویسید.
- نکته‌ی صداقت: در رزومه بنویسید که طراحی با کمک هوش مصنوعی انجام شد و شما تصمیم‌گیرنده و بازبین بودید. این امروز یک مهارت است و مصاحبه‌کننده بیشتر از «من همه‌چیز را دستی زدم» به آن اعتماد می‌کند.
