import { StateMessage } from "@/components/ui/state-message";
import { productCopy as t } from "../copy";
import type { Product } from "../types";

/** جدول مشخصات (دو ستون در دسکتاپ). فقط داده‌ی واقعی بک‌اند نشان داده می‌شود. */
export function ProductSpecs({ specs }: { specs: Product["specs"] }) {
  if (!specs || specs.length === 0) return <StateMessage>{t.noSpecs}</StateMessage>;
  return (
    <dl className="grid gap-3 lg:grid-cols-2">
      {specs.map((s) => (
        <div
          key={s.label}
          className="rounded-card bg-surface flex items-center justify-between gap-4 px-5 py-4 text-sm"
        >
          <dt className="text-fg-muted">{s.label}</dt>
          <dd className="text-fg font-medium">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
