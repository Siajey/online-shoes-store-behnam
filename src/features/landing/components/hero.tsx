"use client";

import { useState } from "react";
import { activeSlides, stepIndex } from "../hero-slides";
import { HeroView } from "./hero-view";

const SLIDES = activeSlides();

/** هیرو صفحه‌ی اصلی: اسلایدر بنر + دو کارت پیشنهاد. اسلایدها از hero-slides.ts می‌آیند. */
export function Hero() {
  const [index, setIndex] = useState(0);
  const step = (delta: number) => setIndex((i) => stepIndex(i, delta, SLIDES.length));
  return (
    <HeroView
      slides={SLIDES}
      index={index}
      onSelect={setIndex}
      onPrev={() => step(-1)}
      onNext={() => step(1)}
    />
  );
}
