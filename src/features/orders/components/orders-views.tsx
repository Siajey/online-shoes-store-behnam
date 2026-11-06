import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { ordersCopy } from "../copy";

/** جای‌نگهدار صادقانه تا آماده شدن API سفارش (بدون داده‌ی ساختگی). */
export function OrdersSoonView() {
  return (
    <StateMessage>
      <p className="text-fg text-base font-medium">{ordersCopy.soonTitle}</p>
      <p className="mt-1">{ordersCopy.soonText}</p>
      <Link href="/products" className={buttonVariants({ className: "mt-5" })}>
        {ordersCopy.startShopping}
      </Link>
    </StateMessage>
  );
}
