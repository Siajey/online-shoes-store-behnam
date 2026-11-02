import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { productCopy } from "@/features/products/copy";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-300 flex-col items-center gap-4 px-4 py-20 text-center lg:px-8">
      <h1 className="text-3xl font-semibold">{productCopy.notFoundTitle}</h1>
      <p className="text-fg-muted">{productCopy.notFoundText}</p>
      <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-4" })}>
        {productCopy.backToProducts}
      </Link>
    </main>
  );
}
