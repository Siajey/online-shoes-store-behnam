/** قالب پاسخ موفق بک‌اند (مطابق docs/API_CONTRACT.md بخش ۲). */
export interface ApiSuccess<T, M = Record<string, unknown>> {
  message: string;
  code: string;
  timestamp: string;
  path: string;
  data: T;
  meta?: M;
}

/** قالب پاسخ خطا (بخش ۳ قرارداد). فعلاً خطای فیلد‌به‌فیلد ندارد. */
export interface ApiErrorBody {
  message: string;
  code: string;
  timestamp: string;
  path: string;
}

/** صفحه‌بندی cursor-based (بخش ۵ قرارداد). */
export interface CursorMeta {
  nextCursor: string | null;
}

export interface Page<T> {
  items: T[];
  /** null یعنی صفحه‌ی آخر */
  nextCursor: string | null;
}
