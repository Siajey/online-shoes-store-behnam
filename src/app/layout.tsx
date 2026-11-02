import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DEFAULT_THEME, themeInitScript } from "@/features/theme/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: اسکریپت تم پیش از hydrate مقدار data-theme را عوض می‌کند و این عمدی است.
    <html lang="fa" dir="rtl" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-page text-fg font-sans antialiased">{children}</body>
    </html>
  );
}
