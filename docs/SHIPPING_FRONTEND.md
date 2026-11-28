# ارسال در فرانت

بک‌اند (PR ارسال) برای ثبت سفارش، `shippingMethod` را اجباری می‌خواهد.

## جریان تسویه

1. کاربر آدرس را انتخاب می‌کند.
2. `GET /shipping/options?addressId=...` (فقط سشن، بدون CSRF) روش‌ها و هزینه‌ها را برای همان آدرس و سبد سرور برمی‌گرداند.
   - هر مورد: `methodCode`، `name`، `description`، `available`؛ برای روش در دسترس: `fee`، `isFree`، `estimatedDays {min,max}`.
3. کاربر روش را انتخاب می‌کند (پیش‌فرض: اولین روش در دسترس). هزینه به جمع خلاصه اضافه می‌شود.
4. `POST /orders` با `{ addressId, shippingMethod }` (+ `Idempotency-Key`).

همه‌ی مبلغ‌ها تومان‌اند.

## خطاها

`SHIPPING_QUOTE_UNAVAILABLE`، `SHIPPING_INVALID_METHOD`، `SHIPPING_METHOD_NOT_FOUND`، `SHIPPING_INVALID_DESTINATION` در `orders/errors.ts` به پیام فارسی (kind: "shipping") تبدیل می‌شوند و کلید idempotency تازه می‌گیرند.

## کد

- `src/features/shipping/`: dto، mapper، api، `choice.ts` (انتخاب پیش‌فرض)، `use-shipping-options.ts`
- `checkout/components/checkout-views.tsx`: بخش ارسال و خلاصه‌ی سفارش

## ☐ بعداً

- نمایش روش ارسال و کد رهگیری در جزئیات سفارش (`shippingMethod`، `tracking` در پاسخ سفارش)
- پنل ادمین روش‌های ارسال و ثبت رهگیری (`/admin/shipping-methods`، `/admin/shipments`)
