import type { Metadata } from "next";
import { InfoList, InfoPage, InfoSection } from "@/features/info/components/info-page";
import { SizeTable } from "@/features/info/components/size-table";
import { infoCopy } from "@/features/info/copy";

const c = infoCopy.sizeGuide;

export const metadata: Metadata = { title: c.title, description: c.intro };

export default function SizeGuidePage() {
  return (
    <InfoPage title={c.title} intro={c.intro}>
      <InfoSection title={c.measureTitle}>
        <InfoList ordered items={c.measureSteps} />
      </InfoSection>
      <InfoSection title={c.tableTitle}>
        <SizeTable />
        <p className="text-fg-muted text-sm leading-7">{c.note}</p>
      </InfoSection>
    </InfoPage>
  );
}
