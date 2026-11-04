type StorageLike = Pick<Storage, "getItem" | "setItem">;
type EventTargetLike = Pick<Window, "addEventListener" | "removeEventListener">;

type Options<T> = {
  /** کلید حافظه‌ی مرورگر */
  key: string;
  /** متن ذخیره‌شده را امن به لیست تبدیل می‌کند (باید هرگز خطا ندهد). */
  parse: (raw: string | null) => readonly T[];
  serialize: (items: readonly T[]) => string;
  /** حافظه‌ی مرورگر؛ روی سرور null است. ممکن است خودش خطا بدهد (حالت خصوصی). */
  getStorage: () => StorageLike | null;
  /** برای هم‌گام شدن تب‌ها (رویداد storage). */
  target?: EventTargetLike | null;
};

/**
 * فروشگاه لیستی که در حافظه‌ی مرورگر می‌ماند و با useSyncExternalStore سازگار است.
 * سبد خرید و علاقه‌مندی‌ها هر دو از همین ساخته می‌شوند.
 */
export function createPersistedStore<T>({
  key,
  parse,
  serialize,
  getStorage,
  target = null,
}: Options<T>) {
  const EMPTY: readonly T[] = Object.freeze([]);
  let items: readonly T[] = EMPTY;
  let loaded = false;
  const listeners = new Set<() => void>();

  const storage = (): StorageLike | null => {
    try {
      return getStorage();
    } catch {
      return null;
    }
  };

  const read = (): readonly T[] => {
    try {
      const list = parse(storage()?.getItem(key) ?? null);
      return list.length > 0 ? list : EMPTY;
    } catch {
      return EMPTY;
    }
  };

  const emit = () => listeners.forEach((l) => l());

  function ensureLoaded() {
    if (loaded) return;
    loaded = true;
    items = read();
  }

  const onStorage = (event: Event) => {
    const changed = (event as StorageEvent).key;
    if (changed !== null && changed !== key) return;
    loaded = true;
    items = read();
    emit();
  };

  return {
    getSnapshot(): readonly T[] {
      ensureLoaded();
      return items;
    },
    /** روی سرور (و هنگام هیدریت) همیشه خالی است تا HTML سرور و مرورگر یکی باشد. */
    getServerSnapshot(): readonly T[] {
      return EMPTY;
    },
    subscribe(listener: () => void) {
      if (listeners.size === 0) target?.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) target?.removeEventListener("storage", onStorage);
      };
    },
    /** لیست را با تابع داده‌شده عوض می‌کند. اگر همان آرایه برگردد، چیزی ذخیره یا اعلام نمی‌شود. */
    update(change: (current: readonly T[]) => readonly T[]) {
      ensureLoaded();
      const next = change(items);
      if (next === items) return;
      items = next.length > 0 ? next : EMPTY;
      try {
        storage()?.setItem(key, serialize(items));
      } catch {
        // پر بودن یا بسته بودن حافظه: لیست همچنان تا بستن صفحه در حافظه‌ی برنامه کار می‌کند.
      }
      emit();
    },
  };
}
