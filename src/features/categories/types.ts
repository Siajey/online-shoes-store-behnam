export type Category = {
  id: string;
  name: string;
  /** برای فیلتر محصولات و آدرس‌ها */
  slug: string;
  imageUrl?: string;
  children: Category[];
};
