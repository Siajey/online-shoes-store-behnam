import { OfferFormContent } from "@/features/admin/discounts/components/offer-form-content";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OfferFormContent kind="coupon" id={id} />;
}
