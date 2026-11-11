import { ProductFormContent } from "@/features/admin/products/components/product-form-content";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductFormContent productId={id} />;
}
