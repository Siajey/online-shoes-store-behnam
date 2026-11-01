type ClassValue = string | false | null | undefined;

/** کلاس‌های شرطی را به یک رشته تبدیل می‌کند. مثال: cn("a", isOn && "b") */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
