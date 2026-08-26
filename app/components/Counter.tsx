"use client";

import { useEffect, useRef, useState } from "react";

/** Лічильник, який добігає до значення, коли блок зʼявляється на екрані. */
export default function Counter({
  to,
  suffix = "",
  duration = 1400,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();

        // за увімкненого «зменшити рух» показуємо підсумок без анімації
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValue(to);
          setDone(true);
          return;
        }

        let start: number | null = null;
        const tick = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="num__val">
      {value}
      {done ? suffix : ""}
    </span>
  );
}
