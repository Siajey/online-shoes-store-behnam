import type { Metadata } from "next";
import { AccountShell } from "@/features/auth/components/account-shell";
import { MyReviewsContent } from "@/features/reviews/components/my-reviews-content";
import { reviewsCopy } from "@/features/reviews/copy";

export const metadata: Metadata = { title: reviewsCopy.mine.pageTitle };

export default function MyReviewsPage() {
  return (
    <AccountShell current="reviews" title={reviewsCopy.mine.pageTitle}>
      <MyReviewsContent />
    </AccountShell>
  );
}
