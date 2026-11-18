const fmt = (iso: string, opts: Intl.DateTimeFormatOptions): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran", ...opts }).format(d);
};

export const formatOrderDate = (iso: string): string => fmt(iso, { dateStyle: "long" });
export const formatOrderDateTime = (iso: string): string =>
  fmt(iso, { dateStyle: "medium", timeStyle: "short" });
