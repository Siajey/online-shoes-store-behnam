import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { adminCopy } from "../copy";
import { adminTitle } from "../titles";
import { AdminGateView } from "./admin-gate-view";
import { AdminNavView } from "./admin-nav";
import { AdminTopbarView } from "./admin-topbar-view";

describe("AdminGateView", () => {
  it("مدیر محتوا را می‌بیند", () => {
    expect(
      renderToStaticMarkup(
        <AdminGateView access="ok">
          <p>داخل</p>
        </AdminGateView>,
      ),
    ).toContain("داخل");
  });

  it("غیرمدیر و حالت‌های دیگر محتوا را نمی‌بینند", () => {
    for (const access of ["forbidden", "error", "loading", "guest"] as const) {
      expect(
        renderToStaticMarkup(
          <AdminGateView access={access}>
            <p>داخل</p>
          </AdminGateView>,
        ),
      ).not.toContain("داخل");
    }
    expect(
      renderToStaticMarkup(
        <AdminGateView access="forbidden">
          <i />
        </AdminGateView>,
      ),
    ).toContain(adminCopy.forbiddenTitle);
  });
});

describe("AdminNavView", () => {
  it("مسیر فعال aria-current دارد و همهٔ بخش‌ها لینک‌اند", () => {
    const out = renderToStaticMarkup(<AdminNavView pathname="/admin/products" />);
    expect(out).toContain('aria-current="page"');
    expect(out).toContain('href="/admin/products"');
    expect(out).toContain('href="/admin/categories"');
    expect(out).toContain('href="/admin/brands"');
    expect(out).toContain('href="/admin/users"');
  });

  it("لینک بازگشت به فروشگاه دارد و هر آیتم آیکن دارد", () => {
    const out = renderToStaticMarkup(<AdminNavView pathname="/admin/users" />);
    expect(out).toMatch(/<a[^>]*href="\/"[^>]*>.*بازگشت به فروشگاه/);
    expect(out.match(/<svg/g)?.length).toBe(5);
  });

  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    const out = renderToStaticMarkup(<AdminNavView pathname="/admin/products" />);
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

describe("AdminTopbarView", () => {
  it("عنوان و شماره‌ی مدیر را نشان می‌دهد", () => {
    const out = renderToStaticMarkup(<AdminTopbarView title="محصولات" phone="09120000000" />);
    expect(out).toContain("<h1");
    expect(out).toContain("محصولات");
    expect(out).toContain("۰۹۱۲۰۰۰۰۰۰۰");
    expect(out).toContain(adminCopy.adminRole);
  });

  it("بدون شماره فقط نقش را نشان می‌دهد", () => {
    expect(renderToStaticMarkup(<AdminTopbarView title="x" />)).not.toContain("۰۹");
  });
});

describe("adminTitle", () => {
  it("عنوان هر صفحه", () => {
    expect(adminTitle("/admin/products")).toBe("محصولات");
    expect(adminTitle("/admin/products/new")).toBe("محصول جدید");
    expect(adminTitle("/admin/products/abc-123")).toBe("ویرایش محصول");
    expect(adminTitle("/admin/categories")).toBe("دسته‌بندی‌ها");
    expect(adminTitle("/admin/brands")).toBe("برندها");
    expect(adminTitle("/admin/users")).toBe("کاربران");
    expect(adminTitle(null)).toBe("پنل مدیریت");
  });
});
