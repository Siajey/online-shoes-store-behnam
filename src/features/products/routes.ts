/** آدرس صفحه‌ی محصول بر اساس slug (خوانا و مناسب سئو). */
export const productHref = (slug: string) => `/products/${encodeURIComponent(slug)}`;
