import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InfoList, InfoPage, InfoSection } from "./components/info-page";
import { SizeTable } from "./components/size-table";
import { infoCopy } from "./copy";

describe("InfoPage", () => {
  it("عنوان h1، مقدمه و بخش‌ها را می‌چیند", () => {
    const out = renderToStaticMarkup(
      <InfoPage title="عنوان" intro="مقدمه">
        <InfoSection title="بخش">
          <InfoList items={["الف", "ب"]} />
        </InfoSection>
      </InfoPage>,
    );
    expect(out).toContain("<h1");
    expect(out).toContain("مقدمه");
    expect(out).toContain("<h2");
    expect(out).toContain("<ul");
  });
  it("فهرست مرتب با ol و فقط ویژگی‌های منطقی", () => {
    const out = renderToStaticMarkup(<InfoList ordered items={["الف"]} />);
    expect(out).toContain("<ol");
    expect(out).toContain("ps-6");
    expect(out).not.toMatch(/\b(pl|pr|ml|mr)-/);
  });
});

describe("SizeTable", () => {
  const out = renderToStaticMarkup(<SizeTable />);
  it("ارقام فارسی با ممیز فارسی، و سرستون‌های دسترس‌پذیر", () => {
    expect(out).toContain("۴۰");
    expect(out).toContain("۲۵٫۲");
    expect(out).toContain('scope="col"');
    expect(out).toContain("<caption");
  });
  it("به ازای هر سایز یک ردیف", () => {
    expect((out.match(/<tr/g) ?? []).length).toBe(1 + 11);
  });
});

describe("متن‌ها", () => {
  it("همه‌ی پرسش‌ها پاسخ دارند و لینک‌ها داخلی‌اند", () => {
    for (const item of infoCopy.faq.items) {
      expect(item.q.length).toBeGreaterThan(5);
      expect(item.a.length).toBeGreaterThan(10);
      if ("link" in item) expect(item.link.href.startsWith("/")).toBe(true);
    }
  });
  it("پرسش‌ها تکراری نیستند", () => {
    const qs = infoCopy.faq.items.map((i) => i.q);
    expect(new Set(qs).size).toBe(qs.length);
  });
  it("مقدمه‌ی بازگشت، عدد مهلت را می‌گیرد", () => {
    expect(infoCopy.returns.intro("۷")).toContain("۷ روز");
  });
});
