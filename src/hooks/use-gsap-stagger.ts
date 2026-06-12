"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

interface UseGsapStaggerOptions {
  delay?: number;
  stagger?: number;
  y?: number;
}

export function useGsapStagger<T extends HTMLElement>(
  options: UseGsapStaggerOptions = {},
) {
  const ref = useRef<T>(null);
  const { delay = 0, stagger = 0.08, y = 28 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const children = el.querySelectorAll("[data-animate-item]");
    if (children.length === 0) {
      return;
    }

    gsap.fromTo(
      children,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger,
        delay,
        ease: "power3.out",
      },
    );
  }, [delay, stagger, y]);

  return ref;
}

export function useGsapFadeIn<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out" },
    );
  }, [delay]);

  return ref;
}
