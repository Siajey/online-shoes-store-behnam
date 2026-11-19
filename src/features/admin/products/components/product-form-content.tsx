"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchAdminBrands, fetchAdminCategories } from "../../taxonomy/api";
import { toCategoryRows } from "../../taxonomy/tree";
import type { AdminBrand, AdminCategory } from "../../taxonomy/types";
import { changeProductStatus } from "../api";
import { createProduct, fetchAdminProduct, updateProduct } from "../detail-api";
import { toFormInput, type AdminProductDetail } from "../detail";
import {
  EMPTY_FORM,
  validateProductForm,
  type ProductFormErrors,
  type ProductFormInput,
} from "../form";
import { productFormCopy as t } from "../form-copy";
import type { StatusAction } from "../types";
import { GalleryManager } from "./gallery-manager";
import { ProductFormView, VariantsReadOnly } from "./product-form-view";

type Load =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      categories: AdminCategory[];
      brands: AdminBrand[];
      product: AdminProductDetail | null;
    };

const messageOf = (e: unknown, fallback: string) => (isApiRequestError(e) ? e.message : fallback);

/** productId نبود یعنی «محصول جدید». */
export function ProductFormContent({ productId }: { productId?: string }) {
  const router = useRouter();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [values, setValues] = useState<ProductFormInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [reloadKey, setReloadKey] = useState(0);
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusError, setStatusError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchAdminCategories(),
      fetchAdminBrands(),
      productId ? fetchAdminProduct(productId) : Promise.resolve(null),
    ])
      .then(([categories, brands, product]) => {
        if (cancelled) return;
        if (product) setValues(toFormInput(product));
        setLoad({ status: "ready", categories, brands, product });
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoad({ status: "error", message: messageOf(e, t.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [productId, reloadKey]);

  const categoryOptions = useMemo(
    () =>
      load.status === "ready"
        ? toCategoryRows(load.categories).map((r) => ({
            value: r.category.id,
            label: `${"— ".repeat(r.depth)}${r.category.name}`,
          }))
        : [],
    [load],
  );
  const brandOptions = useMemo(
    () => (load.status === "ready" ? load.brands.map((b) => ({ value: b.id, label: b.name })) : []),
    [load],
  );

  if (load.status === "loading") return <StateMessage>{t.loading}</StateMessage>;
  if (load.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4">
        <StateMessage tone="error" className="w-full">
          {load.message}
        </StateMessage>
        <Button
          variant="secondary"
          onClick={() => {
            setLoad({ status: "loading" });
            setReloadKey((k) => k + 1);
          }}
        >
          {t.retry}
        </Button>
      </div>
    );
  }

  const { categories, brands, product } = load;
  const slugLocked = product?.slugLocked ?? false;

  async function submit() {
    const result = validateProductForm(values, { slugLocked });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setFormError(undefined);
    setNotice(undefined);
    setPending(true);
    try {
      if (product) {
        const saved = await updateProduct(product.id, result.value, product);
        setValues(toFormInput(saved));
        setLoad({ status: "ready", categories, brands, product: saved });
        setNotice(t.saved);
      } else {
        const created = await createProduct(result.value);
        router.push(`/admin/products/${created.id}`);
      }
    } catch (e) {
      setFormError(messageOf(e, t.saveError));
    } finally {
      setPending(false);
    }
  }

  async function changeStatus(action: StatusAction) {
    if (!product) return;
    setStatusBusy(true);
    setStatusError(undefined);
    try {
      await changeProductStatus(product.id, action);
      // بعد از اولین انتشار slug قفل می‌شود؛ پس محصول دوباره خوانده می‌شود.
      const fresh = await fetchAdminProduct(product.id);
      setLoad({ status: "ready", categories, brands, product: fresh });
      setValues((current) => ({ ...current, slug: fresh.slug }));
    } catch (e) {
      setStatusError(messageOf(e, t.statusError));
    } finally {
      setStatusBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProductFormView
        mode={product ? "edit" : "create"}
        values={values}
        errors={errors}
        slugLocked={slugLocked}
        categories={categoryOptions}
        brands={brandOptions}
        pending={pending}
        formError={formError}
        notice={notice}
        publish={
          product
            ? {
                status: product.status,
                busy: statusBusy,
                error: statusError,
                onAction: (a) => void changeStatus(a),
              }
            : undefined
        }
        variants={product ? <VariantsReadOnly variants={product.variants} /> : undefined}
        onChange={setValues}
        onSubmit={() => void submit()}
      />
      {product && (
        <GalleryManager key={product.id} productId={product.id} initial={product.images} />
      )}
    </div>
  );
}
