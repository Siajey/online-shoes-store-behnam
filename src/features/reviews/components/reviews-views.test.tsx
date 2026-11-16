import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Review } from "../types";
import { RatingStars } from "./rating-stars";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { ReviewSummaryView } from "./review-summary";

const review: Review = {
  id: "1",
  productId: "p",
  productName: "کفش آبی",
  productSlug: "blue",
  authorName: "سارا م.",
  rating: 4,
  title: "خوب بود",
  body: "کیفیت و سایز عالی بود.",
  createdAt: "2026-10-01T00:00:00.000Z",
  verifiedPurchase: true,
};

describe("RatingStars", () => {
  it("برچسب فارسی و تعداد ستاره‌ی پر", () => {
    const out = renderToStaticMarkup(<RatingStars value={3.6} />);
    expect(out).toContain("امتیاز ۳.۶ از ۵");
    expect(out.match(/fill="currentColor"/g)).toHaveLength(4);
  });
});

describe("ReviewSummaryView", () => {
  it("میانگین، تعداد و پنج ردیف", () => {
    const out = renderToStaticMarkup(
      <ReviewSummaryView
        summary={{ count: 4, average: 4.5, distribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 2 } }}
      />,
    );
    expect(out).toContain("۴.۵");
    expect(out).toContain("بر اساس ۴ نظر");
    expect((out.match(/ستاره/g) ?? []).length >= 5).toBe(true);
    expect(out).toContain("width:50%");
  });
});

describe("ReviewList", () => {
  it("نویسنده، متن، تاریخ و نشان خریدار", () => {
    const out = renderToStaticMarkup(<ReviewList reviews={[review]} />);
    expect(out).toContain("سارا م.");
    expect(out).toContain("کیفیت و سایز عالی بود.");
    expect(out).toContain("خریدار این کالا");
    expect(out).toContain('dateTime="2026-10-01T00:00:00.000Z"');
    expect(out).not.toContain("/products/blue");
  });
  it("showProduct لینک کالا را می‌آورد", () => {
    const out = renderToStaticMarkup(<ReviewList reviews={[review]} showProduct />);
    expect(out).toContain('href="/products/blue"');
    expect(out).toContain("کفش آبی");
  });
});

describe("ReviewForm", () => {
  it("پنج ستاره، متن و دکمه‌ها", () => {
    const out = renderToStaticMarkup(
      <ReviewForm onSubmit={async () => ({ ok: true })} onCancel={() => {}} />,
    );
    expect(out.match(/role="radio"/g)).toHaveLength(5);
    expect(out).toContain("<textarea");
    expect(out).toContain("ثبت نظر");
    expect(out).toContain("انصراف");
  });
});
