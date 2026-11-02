import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function BrandLogo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 text-xl font-semibold", className)}>
      {/* alt خالی: نام برند همین‌جا به‌صورت متن نوشته شده است */}
      <Image src="/brand/logo.jpg" alt="" width={76} height={76} className="size-10 rounded-xl" />
      {siteConfig.name}
    </Link>
  );
}
