/** مدل داخلی فرانت. UI فقط با همین کار می‌کند و از شکل API خبر ندارد. */
export type Product = {
  id: string;
  name: string;
  /** عدد صحیح، به تومان */
  price: number;
  tag?: string;
  imageUrl?: string;
};
