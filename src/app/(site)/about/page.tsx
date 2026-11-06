import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/features/info/components/info-page";
import { infoCopy } from "@/features/info/copy";

const c = infoCopy.about;

export const metadata: Metadata = { title: c.title, description: c.intro };

export default function AboutPage() {
  return (
    <InfoPage title={c.title} intro={c.intro}>
      {c.sections.map((s) => (
        <InfoSection key={s.title} title={s.title}>
          <p className="text-fg-secondary leading-8">{s.text}</p>
        </InfoSection>
      ))}
    </InfoPage>
  );
}
