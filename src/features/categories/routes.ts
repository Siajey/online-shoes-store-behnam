/** ☐ نام پارامتر فیلتر دسته‌بندی با Swagger بک‌اند تطبیق داده شود. */
export const categoryHref = (slug: string) => `/products?category=${encodeURIComponent(slug)}`;
