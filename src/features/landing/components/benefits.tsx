import type { ReactNode } from "react";
import { landingCopy } from "../copy";

const icons: Record<(typeof landingCopy.benefits)[number]["id"], string> = {
  shipping: "M1 6h13v10H1zM14 10h4l3 3v3h-7M5 17a2 2 0 1 0 .01 0M17 17a2 2 0 1 0 .01 0",
  returns: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
  payment: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
  authentic: "M3 6h18v12H3zM3 10h18",
};

function Icon({ d }: { d: string }): ReactNode {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="text-brand size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function Benefits() {
  return (
    <section className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {landingCopy.benefits.map((item) => (
          <li key={item.id} className="rounded-card bg-surface flex items-center gap-3 p-4 lg:p-5">
            <span className="bg-surface-2 flex size-12 flex-none items-center justify-center rounded-2xl">
              <Icon d={icons[item.id]} />
            </span>
            <div>
              <div className="text-[15px] font-medium">{item.title}</div>
              <div className="text-fg-muted mt-1 text-[13px]">{item.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
