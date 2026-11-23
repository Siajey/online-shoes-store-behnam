import Link from "next/link";
import { landingCopy } from "../copy";
import { heroCopy as t } from "../hero-copy";
import { ASIDE_TILES, type AsideTile, type HeroSlide } from "../hero-slides";
import { HeroShoe } from "./hero-shoe";

const focus = "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2";
const ctaBase =
  "inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full px-7 text-base font-bold";

const ArrowStart = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

const Chevron = ({ dir }: { dir: "next" | "prev" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === "next" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

const roundBtn = `bg-surface-2 border-line text-fg flex size-11 items-center justify-center rounded-full border ${focus}`;

export type HeroViewProps = {
  slides: readonly HeroSlide[];
  index: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

function Tile({ tile }: { tile: AsideTile }) {
  const brand = tile.tone === "brand";
  return (
    <Link
      href={tile.href}
      className={`rounded-sheet flex min-w-65 snap-start flex-col justify-between gap-5 p-6 lg:min-w-0 lg:flex-1 lg:p-7 ${
        brand ? "bg-brand text-on-brand" : "bg-surface-2 text-fg"
      } ${focus}`}
    >
      <span className="flex flex-col gap-2">
        <span className={`text-sm font-bold ${brand ? "" : "text-ok"}`}>{tile.eyebrow}</span>
        <span className="text-lg leading-relaxed font-extrabold lg:text-2xl">{tile.title}</span>
        <span
          className={`hidden text-[15px] leading-8 lg:block ${brand ? "" : "text-fg-secondary"}`}
        >
          {tile.text}
        </span>
      </span>
      <span
        className={`inline-flex items-center gap-2 text-[15px] font-bold ${brand ? "" : "text-brand"}`}
      >
        {tile.cta}
        <ArrowStart />
      </span>
    </Link>
  );
}

export function HeroView({ slides, index, onSelect, onPrev, onNext }: HeroViewProps) {
  const slide = slides[index] ?? slides[0];
  if (!slide) return null;
  const many = slides.length > 1;
  const onImg = Boolean(slide.bg);
  return (
    <div className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 py-4 lg:flex-row lg:gap-5 lg:px-8 lg:py-8">
      <h1 className="sr-only">{landingCopy.heroTitle}</h1>
      <section
        aria-roledescription="carousel"
        aria-label={t.carouselLabel}
        className="bg-surface rounded-card lg:rounded-sheet relative flex min-w-0 flex-1 flex-col justify-between gap-4 overflow-hidden p-5 lg:min-h-144 lg:gap-6 lg:p-12"
      >
        {slide.bg && (
          <>
            <picture>
              <source media="(min-width: 60rem)" srcSet={slide.bg.desktop} />
              {}
              <img
                src={slide.bg.mobile}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/5 lg:bg-linear-to-l lg:from-black/80 lg:via-black/50 lg:to-transparent"
            />
          </>
        )}
        <div className="relative flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-8">
          <div
            aria-live="polite"
            className="relative z-10 flex min-w-0 flex-1 flex-col items-start gap-3 lg:gap-5"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium lg:px-4 lg:py-2 lg:text-sm ${
                onImg ? "bg-black/45 text-white" : "bg-surface-2 text-fg-secondary"
              }`}
            >
              <span className="size-2 rounded-full" style={{ background: slide.disc }} />
              {slide.eyebrow}
            </span>
            <h2
              className={`text-[28px] leading-normal font-extrabold lg:text-[46px] lg:leading-[1.45] ${onImg ? "text-white" : ""}`}
            >
              {slide.title}
            </h2>
            <p
              className={`max-w-110 text-[15px] leading-8 lg:text-[17px] lg:leading-9 ${onImg ? "text-white/85" : "text-fg-secondary"}`}
            >
              {slide.sub}
            </p>
            <div className="mt-1 flex w-full flex-wrap gap-3 lg:mt-2 lg:w-auto">
              <Link
                href={slide.href}
                className={`${ctaBase} w-full lg:w-auto ${focus}`}
                style={{ background: slide.disc, color: "#0f1a24" }}
              >
                {slide.cta}
                <ArrowStart />
              </Link>
              <Link
                href={t.secondaryHref}
                className={`${ctaBase} hidden border font-medium lg:inline-flex ${
                  onImg ? "border-white/40 text-white" : "border-line text-fg"
                } ${focus}`}
              >
                {t.secondaryCta}
              </Link>
            </div>
          </div>

          {slide.bg ? (
            <div
              aria-hidden="true"
              className="order-first min-h-57 flex-1 lg:order-none lg:min-h-85"
            />
          ) : (
            <div className="relative order-first flex min-h-57 flex-1 items-center justify-center lg:order-none lg:min-h-85">
              <div
                className="absolute size-52 rounded-full lg:size-90"
                style={{ background: slide.disc }}
              />
              <div className="border-line absolute size-64 rounded-full border-2 border-dashed lg:size-110" />
              <HeroShoe
                kind={slide.shoe}
                upper={slide.upper}
                stripe={slide.stripe}
                className="relative block h-auto w-75 max-w-full -rotate-9 lg:w-117.5"
              />
              <div
                className="absolute end-0 top-0 flex size-21 rotate-8 flex-col items-center justify-center rounded-full text-center lg:end-[4%] lg:top-[6%] lg:size-28"
                style={{
                  background: "#f2b84b",
                  color: "#14202b",
                  boxShadow: "0 0 0 5px var(--bg-surface)",
                }}
              >
                <span className="text-[22px] leading-tight font-extrabold lg:text-3xl">
                  {slide.badge.top}
                </span>
                <span className="text-xs leading-snug font-bold lg:text-sm">
                  {slide.badge.bottom}
                </span>
              </div>
            </div>
          )}
        </div>

        {many && (
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={t.goTo(i + 1)}
                  aria-current={i === index}
                  onClick={() => onSelect(i)}
                  className={`flex h-11 w-11 items-center justify-center ${focus}`}
                >
                  <span
                    className="block h-2.5 rounded-full transition-[width] motion-reduce:transition-none"
                    style={{
                      width: i === index ? 32 : 10,
                      background: i === index ? s.disc : "var(--line)",
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button type="button" aria-label={t.next} onClick={onNext} className={roundBtn}>
                <Chevron dir="next" />
              </button>
              <button type="button" aria-label={t.prev} onClick={onPrev} className={roundBtn}>
                <Chevron dir="prev" />
              </button>
            </div>
          </div>
        )}
      </section>

      <aside
        aria-label={t.asideLabel}
        className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:w-80 lg:snap-none lg:flex-col lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {ASIDE_TILES.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </aside>
    </div>
  );
}
