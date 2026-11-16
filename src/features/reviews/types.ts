/** امتیاز عدد صحیح ۱ تا ۵ */
export type Rating = 1 | 2 | 3 | 4 | 5;

/** مدل داخلی نظر. UI فقط با همین کار می‌کند و از شکل API خبر ندارد. */
export type Review = {
  id: string;
  productId: string;
  /** برای نمایش در «نظرات من»؛ بک‌اند می‌تواند با join بدهد. */
  productName: string;
  productSlug: string;
  authorId?: string;
  authorName: string;
  rating: Rating;
  title?: string;
  body: string;
  /** ISO 8601 */
  createdAt: string;
  /** خریدار همین کالا */
  verifiedPurchase: boolean;
};

/** ورودی ثبت نظر */
export type NewReview = {
  productId: string;
  productName: string;
  productSlug: string;
  rating: Rating;
  title?: string;
  body: string;
  author: { id: string; name: string };
};

export type ReviewSummary = {
  count: number;
  /** میانگین با یک رقم اعشار؛ بدون نظر ۰ */
  average: number;
  distribution: Readonly<Record<Rating, number>>;
};
