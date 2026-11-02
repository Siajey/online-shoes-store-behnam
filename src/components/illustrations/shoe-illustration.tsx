import type { CSSProperties } from "react";

type Props = {
  /** رنگ بدنه و سایه؛ پیش‌فرض از رنگ برند می‌آید و با تم عوض می‌شود. */
  body?: string;
  shade?: string;
  className?: string;
  /** اگر نداده شود، تصویر تزئینی است و برای صفحه‌خوان پنهان می‌ماند. */
  title?: string;
};

/** تصویر برداری کفش (از طرح تأییدشده). رنگ‌های ثابت داخل آن بخشی از خود تصویرند، نه رنگ رابط. */
export function ShoeIllustration({
  body = "var(--brand)",
  shade = "color-mix(in srgb, var(--brand) 60%, black)",
  className,
  title,
}: Props) {
  const bodyStyle: CSSProperties = { fill: body };
  const shadeStyle: CSSProperties = { fill: shade };
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <ellipse cx="122" cy="110" rx="100" ry="6" fill="#000" opacity="0.25" />
      <path
        d="M14 90 C14 82 22 78 34 78 L202 76 C224 76 234 83 234 93 C234 100 227 104 216 104 L32 104 C20 104 14 99 14 90 Z"
        fill="#F2F5F8"
      />
      <path
        d="M34 80 C34 64 50 54 70 52 L94 38 C102 33 111 33 117 39 L125 52 C152 52 178 58 198 68 C214 76 226 82 230 90 L34 90 Z"
        style={bodyStyle}
      />
      <path d="M150 56 C176 60 206 74 230 90 L170 90 C168 76 160 64 150 56 Z" style={shadeStyle} />
      <path
        d="M96 72 C122 62 152 64 178 78"
        stroke="#F2F5F8"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 46 l14 14 M110 42 l14 14 M121 45 l12 12"
        stroke="#F2F5F8"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M117 39 C128 35 148 37 160 46 L168 56 L127 52 Z" style={shadeStyle} />
    </svg>
  );
}
