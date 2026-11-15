import { OfferFormContent } from "@/features/admin/discounts/components/offer-form-content";

export default async function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OfferFormContent kind="discount" id={id} />;
}
