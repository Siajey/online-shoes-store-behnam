import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import type { ProductStatsRefreshDto } from "../dto";
import { insightsCopy as t } from "../copy";

export type RefreshState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: ProductStatsRefreshDto }
  | { status: "error"; message: string };

export type RefreshPanelViewProps = { state: RefreshState; onRefresh: () => void };

export function RefreshPanelView({ state, onRefresh }: RefreshPanelViewProps) {
  const loading = state.status === "loading";
  return (
    <section
      aria-label={t.title}
      className="rounded-card bg-surface flex flex-col gap-3 p-4 lg:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-medium">{t.title}</h2>
          <p className="text-fg-muted text-sm">{t.description}</p>
        </div>
        <Button variant="secondary" disabled={loading} onClick={onRefresh}>
          {loading ? t.running : t.cta}
        </Button>
      </div>
      <div role="status" aria-live="polite">
        {state.status === "success" && <StateMessage>{t.summary(state.result)}</StateMessage>}
        {state.status === "error" && <StateMessage tone="error">{state.message}</StateMessage>}
      </div>
    </section>
  );
}
