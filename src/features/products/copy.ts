/** متن‌های ثابت فیچر محصولات؛ در JSX متن فارسی پخش نکنید. */
export const productCopy = {
  addToFavourites: "افزودن به علاقه‌مندی‌ها",
  removeFromFavourites: "حذف از علاقه‌مندی‌ها",
  addToCart: "افزودن به سبد",
  unavailable: "ناموجود",
  empty: "هنوز محصولی ثبت نشده است.",
  emptyFiltered: "محصولی با این شرایط پیدا نشد.",
  loading: "در حال بارگذاری محصولات",
  loadMore: "نمایش بیشتر",
  allProducts: "همه‌ی محصولات",
  searchResults: (query: string) => `نتایج جستجو برای «${query}»`,
} as const;
