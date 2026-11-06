import type { Metadata } from "next";
import Link from "next/link";
import { ContactLines } from "@/features/info/components/contact-lines";
import { InfoPage, InfoSection } from "@/features/info/components/info-page";
import { infoCopy } from "@/features/info/copy";

const c = infoCopy.contact;

export const metadata: Metadata = { title: c.title, description: c.intro };

export default function ContactPage() {
  return (
    <InfoPage title={c.title} intro={c.intro}>
      <InfoSection title={c.title}>
        <ContactLines empty={c.noContact} />
      </InfoSection>
      <p className="text-fg-muted">
        {c.faqHint}{" "}
        <Link href="/faq" className="text-brand underline underline-offset-4">
          {c.faqLink}
        </Link>
      </p>
    </InfoPage>
  );
}
