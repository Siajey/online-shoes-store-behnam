import Link from "next/link";
import { footerGroups } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { BrandLogo } from "./brand-logo";
import { layoutCopy } from "./copy";

export function SiteFooter() {
  const contact = [
    siteConfig.contact.phone,
    siteConfig.contact.email,
    siteConfig.contact.address,
  ].filter(Boolean);

  return (
    <footer className="bg-deep">
      <div className="mx-auto w-full max-w-300 px-6 pt-10 pb-6 lg:px-8 lg:pt-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <BrandLogo />
            <p className="text-fg-muted mt-4 text-sm leading-8 font-light">
              {siteConfig.description}
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-base font-medium">{group.title}</h3>
              <ul className="text-fg-muted flex flex-col gap-3 text-sm">
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-fg transition-colors motion-reduce:transition-none"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contact.length > 0 && (
            <div className="col-span-2 lg:col-span-1">
              <h3 className="mb-4 text-base font-medium">{layoutCopy.contactTitle}</h3>
              <ul className="text-fg-muted flex flex-col gap-3 text-sm">
                {contact.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-line text-fg-muted mt-10 border-t pt-5 text-[13px]">
          © {siteConfig.copyrightYear} {siteConfig.name}. {layoutCopy.rights}
        </div>
      </div>
    </footer>
  );
}
