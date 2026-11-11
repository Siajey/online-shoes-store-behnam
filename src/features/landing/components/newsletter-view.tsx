import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { landingCopy } from "../copy";

export type NewsletterViewProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
  /** پیام وضعیت بعد از ثبت (مثلاً فعال نبودن سرویس) */
  notice?: string;
};

export function NewsletterView({ value, onChange, onSubmit, error, notice }: NewsletterViewProps) {
  return (
    <section
      aria-labelledby="newsletter-title"
      className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10"
    >
      <div className="rounded-card bg-surface flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div className="lg:max-w-100">
          <h2 id="newsletter-title" className="text-xl font-medium lg:text-2xl">
            {landingCopy.newsletterTitle}
          </h2>
          <p className="text-fg-muted mt-2 text-sm leading-7">{landingCopy.newsletterText}</p>
        </div>
        <form
          noValidate
          className="flex flex-col gap-3 lg:w-110"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Input
            label={landingCopy.newsletterLabel}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            ltr
            value={value}
            onChange={(event) => onChange(event.target.value)}
            error={error}
          />
          <Button type="submit">{landingCopy.newsletterCta}</Button>
          {notice && (
            <p role="status" className="text-fg-muted px-2 text-sm">
              {notice}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
