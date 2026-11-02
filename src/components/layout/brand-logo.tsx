import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function BrandLogo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 text-xl font-semibold", className)}>
      <span
        aria-hidden="true"
        className="bg-brand text-on-brand inline-flex size-9.5 items-center justify-center rounded-xl text-lg"
      >
        {siteConfig.name.charAt(0)}
      </span>
      {siteConfig.name}
    </Link>
  );
}
