import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { InfoList, InfoPage, InfoSection } from "@/features/info/components/info-page";
import { ReturnsContact } from "@/features/info/components/returns-contact";
import { infoCopy } from "@/features/info/copy";
import { toPersianDigits } from "@/lib/format";

const c = infoCopy.returns;
const intro = c.intro(toPersianDigits(siteConfig.policies.returnWindowDays));

export const metadata: Metadata = { title: c.title, description: intro };

export default function ReturnsPage() {
  return (
    <InfoPage title={c.title} intro={intro}>
      <InfoSection title={c.conditionsTitle}>
        <InfoList items={c.conditions} />
      </InfoSection>
      <InfoSection title={c.howTitle}>
        <p className="text-fg-secondary leading-8">{c.how}</p>
      </InfoSection>
      <InfoSection title={c.contactTitle}>
        <ReturnsContact />
      </InfoSection>
      <InfoSection title={c.refundTitle}>
        <p className="text-fg-secondary leading-8">{c.refund}</p>
      </InfoSection>
    </InfoPage>
  );
}
