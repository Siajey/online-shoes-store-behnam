import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { adminCopy } from "../copy";
import { AdminGateView } from "./admin-gate-view";
import { AdminNavView } from "./admin-nav";

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
    expect(out).toContain('href="/admin/brands"');
    expect(out).toContain('href="/admin/users"');
  });
});
