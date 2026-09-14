"use client";

import { useEffect, useRef, useState } from "react";

export type PreviewLabels = {
  tag: string;
  hint: string;
  soundOn: string;
  soundOff: string;
};

/**
 * Короткий приклад якості тарифу всередині картки.
 *
 * Мишка: відео грає, поки курсор над карткою (`active` приходить з PlanCard),
 * і стає на паузу, коли курсор іде. Сенсорні екрани наведення не мають,
 * тож там ролик грає, коли картка помітна на екрані. Звук вимкнений —
 * інакше браузер не дозволить автозапуск; увімкнути можна кнопкою.
 */
export default function PlanPreview({
  src,
  poster,
  active,
  labels,
}: {
  src: string;
  poster: string;
  active: boolean;
  labels: PreviewLabels;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // Лише для пристроїв без наведення. Хто просить менше руху —
  // тому ролик сам не вмикаємо, лишається кнопка звуку.
  useEffect(() => {
    const box = boxRef.current;
    const touchOnly = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!box || !touchOnly || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active || inView) {
      // play() відхиляється, якщо паузу поставили раніше, ніж ролик завантажився.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, inView]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
    if (muted) video.play().catch(() => {});
  };

  return (
    <div ref={boxRef} className={`plan__media${playing ? " is-playing" : ""}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span className="plan__media-tag">{labels.tag}</span>
      <span className="plan__media-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        {labels.hint}
      </span>
      <button
        type="button"
        className="plan__sound"
        aria-label={muted ? labels.soundOn : labels.soundOff}
        aria-pressed={!muted}
        onClick={toggleSound}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" />
          {muted ? (
            <path d="M16 9l5 6M21 9l-5 6" fill="none" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path
              d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
