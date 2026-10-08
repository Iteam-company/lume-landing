"use client";

import { useEffect, useRef } from "react";

/**
 * Короткий беззвучний кліп, що крутиться по колу, поки він на екрані.
 *
 * Поза екраном ставимо на паузу — щоб не витрачати батарею й трафік.
 * preload="none": до першого показу файл не качаємо зовсім, видно постер.
 * Якщо відвідувач просить менше руху (prefers-reduced-motion), сам кліп
 * не запускаємо: показуємо постер і звичайні контроли, решта — на його
 * вибір.
 */
export default function LoopVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      // Без автозапуску — віддаємо керування відвідувачу.
      video.controls = true;
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() відхиляється, якщо браузер заборонив автозапуск, —
          // тоді лишається постер, це не помилка.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
