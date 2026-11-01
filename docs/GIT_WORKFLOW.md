# GIT_WORKFLOW.md — گیت، برنچ و کامیت

## قانون کلی

- `main` همیشه سالم و قابل اجرا است. **مستقیم روی `main` کامیت نمی‌زنیم** (فقط یک استثنا: کامیت اول پروژه).
- هر کار = یک برنچ کوتاه‌عمر = یک Pull Request.
- مدل: **GitHub Flow**. برنچ `develop` ندارید؛ برای تیم دو نفره فقط پیچیدگی اضافه می‌کند.

## ۱. روز اول (یک‌بار)

```bash
# ۱) ریپو را کلون کنید
git clone <آدرس-ریپوی-فرانت>
cd <نام-ریپو>

# ۲) پروژه را بسازید (اگر خطای conflict با README داد، README را موقتاً جابه‌جا کنید)
pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"

# ۳) اجرا و بررسی
pnpm dev          # باید روی localhost:3000 بالا بیاید

# ۴) کامیت اول مستقیم روی main
git add .
git commit -m "chore: initialize Next.js project"
git push origin main
```

بعد از آن در GitHub (Settings → Branches → Add rule برای `main`):

- Require a pull request before merging
- Require status checks to pass (بعد از ساخته شدن CI)
- Block force pushes
- (اختیاری) Require 1 approval، اگر همکارتان هم PRها را ببیند

## ۲. نام برنچ

`<نوع>/<توضیح-کوتاه-انگلیسی>`

| نوع        | کاربرد                        | مثال                          |
| ---------- | ----------------------------- | ----------------------------- |
| `feat`     | قابلیت یا صفحه‌ی جدید         | `feat/product-page`           |
| `fix`      | رفع باگ                       | `fix/cart-total-rounding`     |
| `chore`    | تنظیمات، ابزار، وابستگی       | `chore/setup-eslint-prettier` |
| `docs`     | مستندات                       | `docs/add-decision-d012`      |
| `refactor` | تغییر ساختار بدون تغییر رفتار | `refactor/split-product-card` |
| `test`     | تست                           | `test/cart-store`             |

## ۳. کامیت: چه موقع و چطور

**قالب (Conventional Commits):** `نوع(محدوده): توضیح کوتاه به انگلیسی، فعل امری`

```
feat(cart): add quantity stepper
fix(checkout): prevent double submit
chore: add prettier and eslint rules
docs: record decision D-012
```

**چه موقع کامیت بزنیم:** هر بار که یک تکه‌ی کامل و کارکننده تمام شد (مثلاً «کامپوننت Button با تست»)، نه «آخر روز» و نه «هر خط». قاعده: اگر ممکن است بخواهید فقط همین تکه را برگردانید، آن را جدا کامیت کنید.

**قبل از کامیت:** `pnpm lint` و `pnpm tsc --noEmit` خطا نداشته باشند. بعداً با Husky خودکار می‌شود.

**هرگز کامیت نکنید:** فایل `.env` (فقط `.env.example` بدون مقدار)، کلید و رمز، `node_modules`، `.next`.

## ۴. چرخه‌ی یک کار

```bash
git switch main
git pull origin main
git switch -c feat/product-page        # برنچ جدید برای هر کار

# ... کار + چند کامیت کوچک ...
git push -u origin feat/product-page   # بار اول

# در GitHub: Pull Request به main
# بعد از بازبینی و CI سبز: Squash and merge، سپس برنچ حذف شود
git switch main && git pull origin main
git branch -d feat/product-page
```

اگر `main` وسط کار جلو رفت:

```bash
git fetch origin
git rebase origin/main      # یا git merge origin/main اگر با rebase راحت نیستید
```

## ۵. چه موقع برنچ جدید؟

- **همیشه** قبل از شروع یک کار: صفحه، کامپوننت مهم، رفع باگ، تغییر ابزار.
- کار بزرگ (مثلاً «داشبورد ادمین») را به چند برنچ کوچک تقسیم کنید: `feat/admin-layout`، `feat/admin-products-list`، ... هر PR باید در چند ده تا چند صد خط باشد، نه هزاران.
- **فقط وقتی برنچ جدید نساز:** غلط املایی در README یا ثبت یک تصمیم کوچک در DECISIONS؛ این‌ها هم بهتر است PR کوچک باشند، ولی می‌توانید چند مورد مشابه را با هم بفرستید.

## ۶. Pull Request

- عنوان مثل کامیت: `feat(products): add product page`
- متن PR:
  ```
  ## چه کاری شد
  ## اسکرین‌شات (موبایل + دسکتاپ)
  ## چطور تست کنم
  ## تصمیم جدید؟ (اگر بله D-0XX ثبت شد)
  ```
- قبل از ارسال: خودتان یک بار diff را بخوانید. مخصوصاً کدهای تولیدشده توسط AI.
- استراتژی merge: **Squash and merge** تا تاریخچه‌ی `main` تمیز بماند.

## ۷. کار با ریپوی بک‌اند

- ریپوها جدا هستند؛ **PR مشترک ندارید.**
- تغییر API: همکار در ریپوی بک‌اند OpenAPI را به‌روز می‌کند و به شما خبر می‌دهد. شما در فرانت:
  ```bash
  git switch -c chore/update-api-types
  pnpm api:gen
  # رفع خطاهای TypeScript ناشی از تغییر
  ```
- مسیرها و قراردادهای مهم را در `DECISIONS.md` ثبت کنید.

## ۸. نسخه‌ها (بعداً)

- بعد از اولین انتشار واقعی: تگ `v0.1.0`، سپس `v0.2.0` و ... (`git tag v0.1.0 && git push --tags`).
- هر دیپلوی production از `main`.

## ۹. وقتی اشتباه شد

| وضعیت                                 | راه‌حل                                                            |
| ------------------------------------- | ----------------------------------------------------------------- |
| کامیت اشتباهی هنوز push نشده          | `git reset --soft HEAD~1`                                         |
| فایل اشتباه staged شد                 | `git restore --staged <فایل>`                                     |
| تغییرات نیمه‌کاره و باید برنچ عوض کنم | `git stash` سپس `git stash pop`                                   |
| رمز یا کلید کامیت شد                  | **همان لحظه آن رمز را باطل و عوض کنید**؛ حذف از تاریخچه کافی نیست |

## ۱۰. روال روزانه

1. `git switch main && git pull` → خواندن آخرین تغییرات DECISIONS.md
2. ساخت برنچ برای کار امروز
3. چند کامیت کوچک
4. آخر روز: push (حتی اگر کار تمام نشده، برنچ در GitHub پشتیبان است) و در صورت آماده بودن PR
5. اگر تصمیم جدیدی گرفتید: ثبت در DECISIONS.md
