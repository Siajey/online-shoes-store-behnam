import Link from "next/link";
import { infoCopy } from "../copy";

/** پرسش و پاسخ با <details>؛ بدون جاوااسکریپت و با کیبورد و صفحه‌خوان سازگار. */
export function FaqList() {
  return (
    <div className="flex flex-col gap-3">
      {infoCopy.faq.items.map((item) => (
        <details key={item.q} className="rounded-card bg-surface group p-5">
          <summary className="focus-visible:outline-brand flex cursor-pointer list-none items-center justify-between gap-4 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="text-fg-muted text-xl transition-transform group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <div className="text-fg-secondary mt-3 flex flex-col gap-2 leading-8">
            <p>{item.a}</p>
            {"link" in item && (
              <Link
                href={item.link.href}
                className="text-brand self-start underline underline-offset-4"
              >
                {item.link.label}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
