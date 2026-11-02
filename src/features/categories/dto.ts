/**
 * شکل دسته‌بندی در GET /categories — از نمونه‌ی واقعی بک‌اند (__fixtures__/categories.json).
 * پاسخ یک درخت است: دسته‌های اصلی (parentId = null) و زیردسته‌ها در children.
 */
export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  parentId: string | null;
  children?: CategoryDto[];
};
