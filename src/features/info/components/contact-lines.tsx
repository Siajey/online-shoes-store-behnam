import { siteConfig } from "@/config/site";

/** راه‌های ارتباطی از config/site.ts؛ اگر خالی باشد پیام جایگزین نشان داده می‌شود. */
export function ContactLines({ empty }: { empty: string }) {
  const lines = [
    siteConfig.contact.phone,
    siteConfig.contact.email,
    siteConfig.contact.address,
  ].filter(Boolean);
  if (lines.length === 0) return <p className="text-fg-muted">{empty}</p>;
  return (
    <ul className="text-fg-secondary flex flex-col gap-2 leading-8">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
