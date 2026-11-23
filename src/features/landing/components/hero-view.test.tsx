import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { heroCopy as t } from "../hero-copy";
import { activeSlides } from "../hero-slides";
import { HeroView } from "./hero-view";

const slides = activeSlides();
const noop = () => {};
const html = (index = 0, list = slides) =>
  renderToStaticMarkup(
    <HeroView slides={list} index={index} onSelect={noop} onPrev={noop} onNext={noop} />,
  );

describe("HeroView", () => {
  it("عنوان اسلاید جاری و دکمه‌ی اصلی را نشان می‌دهد", () => {
    const out = html(0);
    expect(out).toContain(slides[0].title);
    expect(out).toContain(slides[0].cta);
    expect(out).toContain('href="/products"');
  });
  it("فقط یک h1 دارد", () => {
    expect((html(0).match(/<h1/g) ?? []).length).toBe(1);
  });
  it("اسلاید دیگر عنوان خودش را دارد", () => {
    expect(html(1)).toContain(slides[1].title);
  });
  it("به تعداد اسلایدها نقطه و دو دکمه‌ی ناوبری دارد", () => {
    const out = html(0);
    for (let i = 1; i <= slides.length; i++) expect(out).toContain(`aria-label="${t.goTo(i)}"`);
    expect(out).toContain(`aria-label="${t.next}"`);
    expect(out).toContain(`aria-label="${t.prev}"`);
  });
  it("با یک اسلاید، ناوبری نمایش داده نمی‌شود", () => {
    expect(html(0, [slides[0]])).not.toContain(`aria-label="${t.next}"`);
  });
  it("کارت‌های کناری رندر می‌شوند", () => {
    expect(html(0)).toContain(t.asideLabel);
  });
  it("اندیس خارج از بازه به اسلاید اول برمی‌گردد", () => {
    expect(html(99)).toContain(slides[0].title);
  });
  it("با عکس پس‌زمینه، عکس رندر می‌شود و کفش برداری نه", () => {
    const withBg = [
      { ...slides[0], bg: { desktop: "/hero/a-desktop.webp", mobile: "/hero/a-mobile.webp" } },
    ];
    const out = html(0, withBg);
    expect(out).toContain('src="/hero/a-mobile.webp"');
    expect(out).toContain('srcSet="/hero/a-desktop.webp"');
    expect(out).not.toContain('role="img"');
    expect(out).toContain(withBg[0].title);
  });
  it("بدون عکس پس‌زمینه، کفش برداری نشان داده می‌شود", () => {
    expect(html(0)).toContain('role="img"');
  });
});
