import type { Metadata } from "next";
import { FaqList } from "@/features/info/components/faq-list";
import { InfoPage } from "@/features/info/components/info-page";
import { infoCopy } from "@/features/info/copy";

const c = infoCopy.faq;

export const metadata: Metadata = { title: c.title, description: c.intro };

export default function FaqPage() {
  return (
    <InfoPage title={c.title} intro={c.intro}>
      <FaqList />
    </InfoPage>
  );
}
