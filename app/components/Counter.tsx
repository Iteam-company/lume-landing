"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Число з анімацією «добігання».
 *
 * Сервер віддає фінальне значення («1000+») прямо в HTML: його бачать
 * пошуковики, превʼю посилань і всі, у кого JS вимкнений або ще не
 * завантажився. Анімація — лише прикраса: якщо блок ще не на екрані,
 * скидаємо число й даємо йому добігти, коли людина до нього доскролить.
 */
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
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Блок уже видно (відкрили сторінку посередині) — лишаємо фінальне число.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        let start: number | null = null;
        const tick = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="num__val">
      {value}
      {suffix}
    </span>
  );
}
