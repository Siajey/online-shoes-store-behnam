import { isApiRequestError } from "@/lib/api/errors";
import { cartCopy } from "./copy";
import type { CartServerApi, ServerCart } from "./server/types";
import type { CartStore } from "./store";
import type { CartCoupon, CartItem, CartVariant, CartableProduct } from "./types";

type AuthLike = {
  getSnapshot(): { status: string; user: { id: string } | null };
  subscribe(listener: () => void): () => void;
  load(): Promise<void>;
};

export type CartMeta = {
  /** local: سبد مرورگر (مهمان)؛ server: سبد حساب کاربر */
  mode: "local" | "server";
  /** در حال خواندن یا ادغام سبد سرور */
  loading: boolean;
  /** یک تغییر در حال ارسال به سرور است */
  pending: boolean;
  error: string | null;
  /** پیام اطلاع‌رسانی بعد از ادغام (مثلاً «۲ کالا اضافه نشد») */
  notice: string | null;
  /** کد تخفیف سبد سرور؛ برای مهمان null */
  coupon: CartCoupon | null;
  /** مبلغ تخفیف کد، به تومان */
  couponDiscount: number;
};

export type CartResult = { ok: true } | { ok: false; message: string };

const OK: CartResult = { ok: true };
const EMPTY: readonly CartItem[] = Object.freeze([]);
const LOCAL_META: CartMeta = {
  mode: "local",
  loading: false,
  pending: false,
  error: null,
  notice: null,
  coupon: null,
  couponDiscount: 0,
};

const messageOf = (error: unknown) =>
  isApiRequestError(error) ? error.message : cartCopy.syncError;

type Deps = { local: CartStore; server: CartServerApi; auth: AuthLike };

/**
 * سبد خرید برنامه. مهمان: سبد مرورگر. واردشده: سبد حساب کاربر روی سرور.
 * هنگام ورود، کالاهای سبد مرورگر (که ترکیب سایز/رنگ دارند) با سبد حساب ادغام و از مرورگر پاک می‌شوند.
 * همه‌ی تغییرات سرور پشت‌سرهم و به ترتیب اجرا می‌شوند تا پاسخ‌ها جابه‌جا نیایند.
 */
export function createCartService({ local, server, auth }: Deps) {
  let serverItems: readonly CartItem[] = EMPTY;
  // تا وضعیت ورود معلوم نشده «در حال بارگذاری» است تا سبد خالیِ اشتباهی دیده نشود.
  let meta: CartMeta = { ...LOCAL_META, loading: true };
  let userId: string | null = null;
  let generation = 0;
  let pendingCount = 0;
  let queue: Promise<unknown> = Promise.resolve();
  let started = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());
  const setMeta = (patch: Partial<CartMeta>) => {
    meta = { ...meta, ...patch };
    emit();
  };
  const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };

  /** ورود (یا تلاش دوباره): سبد مرورگر را ادغام می‌کند و سبد سرور را می‌خواند. */
  function sync(): Promise<void> {
    const gen = ++generation;
    setMeta({ mode: "server", loading: true, error: null, notice: null });
    return enqueue(async () => {
      if (gen !== generation) return;
      try {
        const all = local.getSnapshot();
        const mergeable = all
          .filter((i): i is CartItem & { variantId: string } => Boolean(i.variantId))
          .map((i) => ({ variantId: i.variantId, quantity: i.quantity }));
        const lines = mergeable.slice(0, 50);
        let skipped = all.length - lines.length;
        let cart;
        if (lines.length > 0) {
          const result = await server.merge(lines);
          cart = result.cart;
          skipped += result.skippedVariantIds.length;
        } else {
          cart = await server.get();
        }
        if (gen !== generation) return;
        if (all.length > 0) local.clear();
        serverItems = cart.items;
        setMeta({
          loading: false,
          notice: skipped > 0 ? cartCopy.mergeSkipped(skipped) : null,
          coupon: cart.coupon,
          couponDiscount: cart.couponDiscount,
        });
      } catch (error) {
        if (gen !== generation) return;
        setMeta({ loading: false, error: messageOf(error) });
      }
    });
  }

  function leave() {
    generation++;
    userId = null;
    serverItems = EMPTY;
    meta = LOCAL_META;
    emit();
  }

  function onAuth() {
    const state = auth.getSnapshot();
    if (state.status === "authenticated" && state.user) {
      if (userId !== state.user.id) {
        userId = state.user.id;
        void sync();
      }
    } else if (state.status === "guest" && (userId !== null || meta.mode === "server")) {
      leave();
    } else if (
      (state.status === "guest" || state.status === "error") &&
      meta.mode === "local" &&
      meta.loading
    ) {
      // مهمان است (یا بررسی ورود خطا داد): سبد مرورگر نمایش داده می‌شود.
      setMeta({ loading: false });
    }
  }

  /** یک تغییر در سبد سرور. بعد از خطا، سبد دوباره خوانده می‌شود تا صفحه با سرور هم‌خوان بماند. */
  function mutate(
    op: () => Promise<ServerCart>,
    options: { silent?: boolean } = {},
  ): Promise<CartResult> {
    const gen = generation;
    pendingCount++;
    setMeta({ pending: true, error: null, notice: null });
    return enqueue(async (): Promise<CartResult> => {
      let result: CartResult = OK;
      let couponPatch: Partial<CartMeta> = {};
      const take = (cart: ServerCart) => {
        if (gen !== generation) return;
        serverItems = cart.items;
        couponPatch = { coupon: cart.coupon, couponDiscount: cart.couponDiscount };
      };
      try {
        take(await op());
      } catch (error) {
        result = { ok: false, message: messageOf(error) };
        try {
          take(await server.get());
        } catch {
          // خواندن دوباره هم شکست خورد؛ همان خطای اول به کاربر نشان داده می‌شود.
        }
      }
      pendingCount--;
      if (gen === generation) {
        setMeta({
          ...couponPatch,
          pending: pendingCount > 0,
          // خطای کد تخفیف کنار همان کادر نشان داده می‌شود، نه بالای صفحه.
          error: result.ok || options.silent ? null : result.message,
        });
      }
      return result;
    });
  }

  const inServer = () => meta.mode === "server";
  const variantOf = (id: string) => serverItems.find((i) => i.id === id)?.variantId;

  return {
    getSnapshot: (): readonly CartItem[] => (inServer() ? serverItems : local.getSnapshot()),
    getServerSnapshot: (): readonly CartItem[] => local.getServerSnapshot(),
    getMeta: (): CartMeta => meta,
    getServerMeta: (): CartMeta => LOCAL_META,
    subscribe(listener: () => void) {
      listeners.add(listener);
      const off = local.subscribe(listener);
      return () => {
        listeners.delete(listener);
        off();
      };
    },
    /** شروع هم‌گام‌سازی با وضعیت ورود (چندبار صدا زدن بی‌اثر است). */
    start() {
      if (started) return;
      started = true;
      auth.subscribe(onAuth);
      void auth.load();
      onAuth();
    },
    /** تلاش دوباره بعد از خطای خواندن سبد. */
    retry: () => (inServer() ? sync() : Promise.resolve()),
    dismissMessages: () => setMeta({ error: null, notice: null }),

    add(product: CartableProduct, quantity = 1, variant?: CartVariant): Promise<CartResult> {
      if (!inServer()) {
        local.add(product, quantity, variant);
        return Promise.resolve(OK);
      }
      if (!variant) return Promise.resolve({ ok: false, message: cartCopy.variantRequired });
      return mutate(() => server.add(variant.id, quantity));
    },
    setQuantity(id: string, quantity: number): Promise<CartResult> {
      if (!inServer()) {
        local.setQuantity(id, quantity);
        return Promise.resolve(OK);
      }
      const variantId = variantOf(id);
      if (!variantId) return Promise.resolve(OK);
      return quantity < 1
        ? mutate(() => server.remove(variantId))
        : mutate(() => server.setQuantity(variantId, quantity));
    },
    remove(id: string): Promise<CartResult> {
      if (!inServer()) {
        local.remove(id);
        return Promise.resolve(OK);
      }
      const variantId = variantOf(id);
      return variantId ? mutate(() => server.remove(variantId)) : Promise.resolve(OK);
    },
    /** ثبت کد تخفیف روی سبد سرور؛ فقط برای کاربر واردشده. */
    applyCoupon(code: string): Promise<CartResult> {
      if (!inServer()) return Promise.resolve({ ok: false, message: cartCopy.couponLoginRequired });
      const trimmed = code.trim();
      if (!trimmed) return Promise.resolve({ ok: false, message: cartCopy.couponEmpty });
      return mutate(() => server.applyCoupon(trimmed), { silent: true });
    },
    removeCoupon(): Promise<CartResult> {
      if (!inServer()) return Promise.resolve(OK);
      return mutate(() => server.removeCoupon(), { silent: true });
    },
    clear(): Promise<CartResult> {
      if (!inServer()) {
        local.clear();
        return Promise.resolve(OK);
      }
      return mutate(() => server.clear());
    },
  };
}

export type CartService = ReturnType<typeof createCartService>;
