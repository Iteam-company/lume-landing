"use client";

import { useEffect, useRef } from "react";

/**
 * Перфорація кіноплівки на краю темної секції.
 * Зсув привʼязаний до прокрутки — стрічка «біжить» разом зі скролом.
 * `speed` — скільки пікселів зсуву на кожен піксель прокрутки.
 */
export default function FilmEdge({
  side,
  speed = 0.34,
}: {
  side: "top" | "bottom";
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const run = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      el.style.backgroundPositionX = (-y * speed).toFixed(1) + "px";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", run, { passive: true });
    run();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", run);
    };
  }, [speed]);

  return <span ref={ref} className={`film film--${side}`} aria-hidden="true" />;
}
