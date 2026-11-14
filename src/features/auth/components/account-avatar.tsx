import { UserIcon } from "@/components/layout/icons";
import { cn } from "@/lib/cn";

/** دایره‌ی آواتار: حرف اول نام، یا آیکون کاربر وقتی نام نیست. */
export function AccountAvatar({ name, className }: { name?: string; className?: string }) {
  const letter = name?.trim().charAt(0);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-brand text-on-brand flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
        className,
      )}
    >
      {letter ? letter : <UserIcon className="size-6" />}
    </span>
  );
}
