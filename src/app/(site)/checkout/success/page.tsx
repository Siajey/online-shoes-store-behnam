import type { Metadata } from "next";
import { ResultView } from "@/features/checkout/components/result-view";
import { infoCopy } from "@/features/info/copy";

export const metadata: Metadata = {
  title: infoCopy.result.success.title,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResultView kind="success" />;
}
