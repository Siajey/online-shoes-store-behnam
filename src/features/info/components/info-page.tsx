import type { ReactNode } from "react";

type Props = {
  title: string;
  intro?: string;
  children: ReactNode;
};

/** قالب مشترک صفحه‌های اطلاعاتی: عنوان، مقدمه و بخش‌ها در ستون خوانا. */
export function InfoPage({ title, intro, children }: Props) {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold lg:text-3xl">{title}</h1>
          {intro && <p className="text-fg-muted leading-8">{intro}</p>}
        </header>
        {children}
      </div>
    </main>
  );
}

/** یک بخش با عنوان دوم. */
export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium lg:text-xl">{title}</h2>
      {children}
    </section>
  );
}

/** فهرست ساده برای شرایط و مراحل. */
export function InfoList({
  items,
  ordered = false,
}: {
  items: readonly string[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`text-fg-secondary flex flex-col gap-2 ps-6 leading-8 ${ordered ? "list-decimal" : "list-disc"}`}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
}
