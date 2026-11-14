import { toPersianDigits } from "@/lib/format";
import { adminCopy } from "../copy";

type ViewProps = {
  title: string;
  /** شماره‌ی مدیر؛ تا زمانی که در دسترس نیست نمایش داده نمی‌شود. */
  phone?: string;
};

/** نوار بالای پنل: عنوان صفحه و مدیر واردشده. (نام مدیر در بک‌اند نیست؛ شماره‌ی موبایل نشان داده می‌شود.) */
export function AdminTopbarView({ title, phone }: ViewProps) {
  return (
    <header className="border-line flex items-center justify-between gap-4 border-b px-4 py-4 lg:px-8">
      <h1 className="text-xl font-semibold lg:text-2xl">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-end">
          {phone && (
            <div dir="ltr" className="text-sm">
              {toPersianDigits(phone)}
            </div>
          )}
          <div className="text-fg-muted text-xs">{adminCopy.adminRole}</div>
        </div>
        <span
          aria-hidden="true"
          className="bg-brand text-on-brand flex size-11 items-center justify-center rounded-full font-medium"
        >
          {adminCopy.adminRole.charAt(0)}
        </span>
      </div>
    </header>
  );
}
