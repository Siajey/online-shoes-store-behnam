import type { ShoeKind } from "../hero-slides";
import { heroCopy } from "../hero-copy";

type Props = { kind: ShoeKind; upper: string; stripe: string; className?: string };

function Runner({ upper, stripe }: Pick<Props, "upper" | "stripe">) {
  return (
    <>
      <path
        d="M28 186 Q26 168 52 166 L352 166 Q384 168 376 196 Q368 218 336 218 L66 218 Q32 218 28 186 Z"
        fill="#ffffff"
      />
      <path
        d="M44 198 L366 198"
        stroke="#d5dce5"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M54 166 C52 130 64 94 100 86 L152 76 C178 72 198 80 212 100 C234 132 272 142 320 150 C354 156 372 164 374 166 Z"
        fill={upper}
      />
      <path d="M300 146 C340 152 366 160 374 166 L318 166 Z" fill={stripe} opacity="0.9" />
      <path d="M100 86 L116 46 C124 34 146 34 152 50 L152 76 Z" fill={upper} />
      <path d="M106 80 L119 53 C125 45 140 45 146 55 L150 74 Z" fill={stripe} opacity="0.28" />
      <path d="M96 152 C140 118 192 126 238 160 L224 166 L106 166 Z" fill={stripe} />
      <g stroke={stripe} strokeWidth="5" strokeLinecap="round">
        <path d="M164 78 L170 94" />
        <path d="M178 78 L188 96" />
        <path d="M192 84 L204 100" />
      </g>
    </>
  );
}

function Retro({ upper, stripe }: Pick<Props, "upper" | "stripe">) {
  return (
    <>
      <path
        d="M34 190 Q32 172 56 170 L350 170 Q378 172 372 196 Q366 214 336 214 L68 214 Q38 214 34 190 Z"
        fill="#ffffff"
      />
      <path d="M40 200 Q36 214 68 214 L336 214 Q366 214 370 200 Z" fill="#d9c7a0" />
      <path
        d="M58 170 C56 140 70 118 104 112 L150 106 C176 102 196 108 210 122 C236 146 276 150 322 156 C352 160 368 166 372 170 Z"
        fill={upper}
      />
      <path d="M104 112 L112 92 C118 84 138 84 146 96 L150 106 Z" fill={upper} />
      <path d="M96 150 C130 128 180 132 222 158 L212 170 L100 170 Z" fill={stripe} />
      <path d="M300 152 C338 158 364 164 372 170 L316 170 Z" fill={stripe} opacity="0.35" />
      <g stroke={stripe} strokeWidth="5" strokeLinecap="round">
        <path d="M156 108 L162 122" />
        <path d="M170 106 L180 122" />
        <path d="M184 108 L196 124" />
      </g>
    </>
  );
}

function Chunky({ upper, stripe }: Pick<Props, "upper" | "stripe">) {
  return (
    <>
      <path
        d="M24 176 Q22 150 56 150 L352 150 Q388 152 380 190 Q372 222 330 222 L62 222 Q28 222 24 176 Z"
        fill="#ffffff"
      />
      <path
        d="M34 192 L372 192"
        stroke={stripe}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M58 150 C54 112 70 78 108 70 L156 62 C184 58 204 68 218 90 C238 122 280 128 326 134 C362 140 376 148 378 150 Z"
        fill={upper}
      />
      <path d="M108 70 L120 34 C128 22 152 24 156 42 L156 62 Z" fill={upper} />
      <path d="M92 132 C140 100 196 108 244 142 L232 150 L100 150 Z" fill={stripe} />
      <g stroke={stripe} strokeWidth="5" strokeLinecap="round">
        <path d="M166 64 L172 82" />
        <path d="M180 64 L190 84" />
        <path d="M194 70 L206 90" />
      </g>
    </>
  );
}

/** تصویر برداری کفش (طراحی اختصاصی، بدون لوگو). وقتی عکس واقعی محصول آماده شد جایگزین شود. */
export function HeroShoe({ kind, upper, stripe, className }: Props) {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={heroCopy.shoeAlt} className={className}>
      <ellipse cx="200" cy="228" rx="150" ry="8" fill="#000000" opacity="0.28" />
      {kind === "retro" ? (
        <Retro upper={upper} stripe={stripe} />
      ) : kind === "chunky" ? (
        <Chunky upper={upper} stripe={stripe} />
      ) : (
        <Runner upper={upper} stripe={stripe} />
      )}
    </svg>
  );
}
