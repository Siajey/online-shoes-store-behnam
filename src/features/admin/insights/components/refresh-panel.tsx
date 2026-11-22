"use client";

import { useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { refreshProductStats } from "../api";
import { refreshErrorMessage } from "../copy";
import { RefreshPanelView, type RefreshState } from "./refresh-panel-view";

/** onRefreshed: بعد از موفقیت، فهرست/جزئیاتی که ادمین می‌بیند را دوباره بگیرید. */
export function RefreshPanel({ onRefreshed }: { onRefreshed?: () => void }) {
  const [state, setState] = useState<RefreshState>({ status: "idle" });

  async function refresh() {
    if (state.status === "loading") return;
    setState({ status: "loading" });
    try {
      const result = await refreshProductStats();
      setState({ status: "success", result });
      onRefreshed?.();
    } catch (e) {
      setState({
        status: "error",
        message: refreshErrorMessage(isApiRequestError(e) ? e.code : undefined),
      });
    }
  }

  return <RefreshPanelView state={state} onRefresh={() => void refresh()} />;
}
