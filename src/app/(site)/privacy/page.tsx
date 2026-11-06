import type { Metadata } from "next";
import { DraftNote } from "@/features/info/components/draft-note";
import { InfoList, InfoPage, InfoSection } from "@/features/info/components/info-page";
import { infoCopy } from "@/features/info/copy";

const c = infoCopy.privacy;

export const metadata: Metadata = { title: c.title, description: c.intro };

export default function Page() {
  return (
    <InfoPage title={c.title} intro={c.intro}>
      <DraftNote />
      {c.sections.map((s) => (
        <InfoSection key={s.title} title={s.title}>
          <InfoList items={s.items} />
        </InfoSection>
      ))}
    </InfoPage>
  );
}
