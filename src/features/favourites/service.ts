import type { Product } from "@/features/products/types";
import { isApiRequestError } from "@/lib/api/errors";
import { favouritesCopy } from "./copy";
import type { FavouritesServerApi } from "./server/types";

type LocalLike = {
  getSnapshot(): readonly Product[];
  getServerSnapshot(): readonly Product[];
  subscribe(listener: () => void): () => void;
  toggle(product: Product): void;
  clear(): void;
};

type AuthLike = {
  getSnapshot(): { status: string; user: { id: string } | null };
  subscribe(listener: () => void): () => void;
  load(): Promise<void>;
};

export type FavouritesMeta = {
  /** local: مرورگر (مهمان)؛ server: حساب کاربر */
  mode: "local" | "server";
  /** در حال خواندن یا ادغام */
  loading: boolean;
  error: string | null;
  /** پیام بعد از ادغام (مثلاً «۱ کالا اضافه نشد») */
  notice: string | null;
};

/** فهرست صفحه‌به‌صفحه‌ی حساب (فقط در حالت server). idle یعنی باید خوانده شود. */
export type FavouritesList = {
  status: "idle" | "loading" | "ready" | "error";
  items: readonly Product[];
  nextCursor: string | null;
  loadingMore: boolean;
  error: string | null;
};

export type FavouritesResult = { ok: true } | { ok: false; message: string };

const OK: FavouritesResult = { ok: true };
const NO_IDS: ReadonlySet<string> = new Set();
const NO_ITEMS: readonly Product[] = Object.freeze([]);
const IDLE_LIST: FavouritesList = {
  status: "idle",
  items: NO_ITEMS,
  nextCursor: null,
  loadingMore: false,
  error: null,
};
const LOCAL_META: FavouritesMeta = { mode: "local", loading: false, error: null, notice: null };

const messageOf = (error: unknown) =>
  isApiRequestError(error) ? error.message : favouritesCopy.syncError;

/** سقف تعداد شناسه در یک ادغام. */
const MERGE_MAX = 200;

type Deps = { local: LocalLike; server: FavouritesServerApi; auth: AuthLike };

/**
 * علاقه‌مندی‌های برنامه. مهمان: مرورگر. واردشده: حساب کاربر روی سرور.
 * هنگام ورود، علاقه‌مندی‌های مرورگر ادغام و پاک می‌شوند و شناسه‌ها از سرور خوانده می‌شوند.
 * تغییرها خوش‌بینانه نمایش داده می‌شوند و با خطا به حالت قبل برمی‌گردند.
 */
export function createFavouritesService({ local, server, auth }: Deps) {
  let serverIds: ReadonlySet<string> = NO_IDS;
  let list: FavouritesList = IDLE_LIST;
  let meta: FavouritesMeta = { ...LOCAL_META, loading: true };
  let userId: string | null = null;
  let generation = 0;
  let queue: Promise<unknown> = Promise.resolve();
  let started = false;
  const listeners = new Set<() => void>();

  let localIds: { ref: readonly Product[]; ids: ReadonlySet<string> } | null = null;
  const idsOfLocal = (): ReadonlySet<string> => {
    const ref = local.getSnapshot();
    if (!localIds || localIds.ref !== ref) localIds = { ref, ids: new Set(ref.map((p) => p.id)) };
    return localIds.ids;
  };

  const emit = () => listeners.forEach((l) => l());
  const setMeta = (patch: Partial<FavouritesMeta>) => {
    meta = { ...meta, ...patch };
    emit();
  };
  const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };
  const inServer = () => meta.mode === "server";

  function sync(): Promise<void> {
    const gen = ++generation;
    list = IDLE_LIST;
    setMeta({ mode: "server", loading: true, error: null, notice: null });
    return enqueue(async () => {
      if (gen !== generation) return;
      try {
        const all = local.getSnapshot();
        const mergeable = all.map((p) => p.id).slice(0, MERGE_MAX);
        let skipped = all.length - mergeable.length;
        if (mergeable.length > 0) {
          skipped += (await server.merge(mergeable)).skippedProductIds.length;
        }
        const ids = await server.ids();
        if (gen !== generation) return;
        if (all.length > 0) local.clear();
        serverIds = new Set(ids);
        setMeta({
          loading: false,
          notice: skipped > 0 ? favouritesCopy.mergeSkipped(skipped) : null,
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
    serverIds = NO_IDS;
    list = IDLE_LIST;
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
      setMeta({ loading: false });
    }
  }

  function setList(patch: Partial<FavouritesList>) {
    list = { ...list, ...patch };
    emit();
  }

  async function loadList(more: boolean) {
    const gen = generation;
    const cursor = more ? (list.nextCursor ?? undefined) : undefined;
    if (more && !cursor) return;
    if (more) setList({ loadingMore: true, error: null });
    else setList({ status: "loading", items: NO_ITEMS, nextCursor: null, error: null });
    try {
      const page = await server.list(cursor);
      if (gen !== generation) return;
      const seen = new Set(more ? list.items.map((p) => p.id) : []);
      const fresh = page.items.filter((p) => !seen.has(p.id));
      setList({
        status: "ready",
        items: more ? [...list.items, ...fresh] : fresh,
        nextCursor: page.nextCursor,
        loadingMore: false,
      });
    } catch (error) {
      if (gen !== generation) return;
      setList({
        status: more ? list.status : "error",
        loadingMore: false,
        error: messageOf(error),
      });
    }
  }

  function toggleOnServer(product: Product): Promise<FavouritesResult> {
    const gen = generation;
    const was = serverIds.has(product.id);
    const prevIds = serverIds;
    const prevList = list;
    const nextIds = new Set(serverIds);
    if (was) nextIds.delete(product.id);
    else nextIds.add(product.id);
    serverIds = nextIds;
    if (was) list = { ...list, items: list.items.filter((p) => p.id !== product.id) };
    setMeta({ error: null, notice: null });

    return enqueue(async (): Promise<FavouritesResult> => {
      try {
        await (was ? server.remove(product.id) : server.add(product.id));
        // بعد از افزودن، فهرست صفحه‌بندی‌شده کهنه است و دفعه‌ی بعد دوباره خوانده می‌شود.
        if (!was && gen === generation && list.status === "ready") {
          list = IDLE_LIST;
          emit();
        }
        return OK;
      } catch (error) {
        const message = messageOf(error);
        if (gen === generation) {
          serverIds = prevIds;
          list = prevList;
          setMeta({ error: message });
        }
        return { ok: false, message };
      }
    });
  }

  return {
    /** مجموعه‌ی شناسه‌ها؛ برای نشان دادن قلب روی کارت‌ها */
    getIds: (): ReadonlySet<string> => (inServer() ? serverIds : idsOfLocal()),
    getServerIds: (): ReadonlySet<string> => NO_IDS,
    getItems: (): readonly Product[] => local.getSnapshot(),
    getServerItems: (): readonly Product[] => local.getServerSnapshot(),
    getList: (): FavouritesList => list,
    getServerList: (): FavouritesList => IDLE_LIST,
    getMeta: (): FavouritesMeta => meta,
    getServerMeta: (): FavouritesMeta => LOCAL_META,
    subscribe(listener: () => void) {
      listeners.add(listener);
      const off = local.subscribe(listener);
      return () => {
        listeners.delete(listener);
        off();
      };
    },
    start() {
      if (started) return;
      started = true;
      auth.subscribe(onAuth);
      void auth.load();
      onAuth();
    },
    retry: () => (inServer() ? sync() : Promise.resolve()),
    dismissMessages: () => setMeta({ error: null, notice: null }),
    /** خواندن صفحه‌ی اول فهرست حساب (فقط حالت server). */
    loadList: () => (inServer() ? loadList(false) : Promise.resolve()),
    loadMore: () => (inServer() ? loadList(true) : Promise.resolve()),

    toggle(product: Product): Promise<FavouritesResult> {
      if (!inServer()) {
        local.toggle(product);
        return Promise.resolve(OK);
      }
      return toggleOnServer(product);
    },
  };
}

export type FavouritesService = ReturnType<typeof createFavouritesService>;
