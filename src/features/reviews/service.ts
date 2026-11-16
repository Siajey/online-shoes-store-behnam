import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { ReviewError, type ReviewsGateway } from "./gateway";
import type { NewReview, Review } from "./types";

export type ReviewsEntry =
  | { status: "idle"; reviews: readonly Review[]; error: null }
  | { status: "loading"; reviews: readonly Review[]; error: null }
  | { status: "ready"; reviews: readonly Review[]; error: null }
  | { status: "error"; reviews: readonly Review[]; error: string };

export const IDLE_ENTRY: ReviewsEntry = Object.freeze({
  status: "idle",
  reviews: Object.freeze([]) as readonly Review[],
  error: null,
});

export type SubmitResult = { ok: true; review: Review } | { ok: false; message: string };

const productKey = (id: string) => `product:${id}`;
const mineKey = (userId: string) => `mine:${userId}`;

function messageOf(error: unknown): string {
  if (error instanceof ReviewError) return error.message;
  if (isApiRequestError(error)) return error.message;
  return apiCopy.unknown;
}

/** فروشگاه نظرها (سازگار با useSyncExternalStore)؛ هر کالا و «نظرات من» یک ورودی جدا دارند. */
export function createReviewsService(gateway: ReviewsGateway) {
  const entries = new Map<string, ReviewsEntry>();
  const inFlight = new Map<string, Promise<void>>();
  const listeners = new Set<() => void>();

  const set = (key: string, entry: ReviewsEntry) => {
    entries.set(key, entry);
    listeners.forEach((l) => l());
  };
  const get = (key: string): ReviewsEntry => entries.get(key) ?? IDLE_ENTRY;

  function load(key: string, fetcher: () => Promise<readonly Review[]>, force = false) {
    const current = get(key);
    if (!force && (current.status === "ready" || current.status === "loading")) {
      return inFlight.get(key) ?? Promise.resolve();
    }
    set(key, { status: "loading", reviews: current.reviews, error: null });
    const job = fetcher()
      .then((reviews) => set(key, { status: "ready", reviews, error: null }))
      .catch((error: unknown) =>
        set(key, { status: "error", reviews: current.reviews, error: messageOf(error) }),
      )
      .finally(() => inFlight.delete(key));
    inFlight.set(key, job);
    return job;
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getProduct: (productId: string) => get(productKey(productId)),
    getMine: (userId: string) => get(mineKey(userId)),
    loadProduct: (productId: string, force = false) =>
      load(productKey(productId), () => gateway.listForProduct(productId), force),
    loadMine: (userId: string, force = false) =>
      load(mineKey(userId), () => gateway.listMine(userId), force),

    async submit(input: NewReview): Promise<SubmitResult> {
      try {
        const review = await gateway.create(input);
        const key = productKey(input.productId);
        const current = get(key);
        set(key, {
          status: "ready",
          reviews: [review, ...current.reviews.filter((r) => r.id !== review.id)],
          error: null,
        });
        // «نظرات من» دفعه‌ی بعد تازه خوانده شود.
        entries.delete(mineKey(input.author.id));
        return { ok: true, review };
      } catch (error) {
        return { ok: false, message: messageOf(error) };
      }
    },
  };
}

export type ReviewsService = ReturnType<typeof createReviewsService>;
