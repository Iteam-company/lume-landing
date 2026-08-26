"use client";

import { useRef } from "react";
import { Icon } from "./Icons";

type Variant = "wide" | "16x9" | "9x16";

/**
 * Плейсхолдер під відео. Поки `src` порожній — показує кнопку play
 * і підпис «Відео буде додано». Щойно вкажете шлях до файлу
 * (напр. "/video/work-1.mp4") — на його місці зʼявиться плеєр.
 */
export default function VideoBox({
  variant,
  src,
  poster,
}: {
  variant: Variant;
  src?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
  };

  return (
    <div
      className={`video video--${variant}${src ? " has-video" : ""}`}
      onClick={src ? toggle : undefined}
    >
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
        />
      ) : (
        <>
          <button className="play" type="button" aria-label="Відтворити відео">
            <Icon name="i-play" />
          </button>
          <span className="video__hint">Відео буде додано</span>
        </>
      )}
    </div>
  );
}
