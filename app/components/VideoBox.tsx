"use client";

import { useRef, useState } from "react";
import { Icon } from "./Icons";

type Variant = "wide" | "16x9" | "9x16";

/**
 * Відео або плейсхолдер під нього.
 *
 * До першого запуску показуємо постер із фірмовою кнопкою play, а нативні
 * контроли вмикаємо лише після старту. Так сітка робіт не перетворюється
 * на стіну чорних смуг із таймкодами.
 *
 * Оверлей ЗНИКАЄ, щойно відео стартувало, і більше нічого не перехоплює
 * кліки. Це принципово: раніше обробник на контейнері ловив тап по
 * нативній кнопці паузи й одразу вмикав відео назад — на iPhone пауза
 * через це не працювала взагалі.
 */
export default function VideoBox({
  variant,
  src,
  poster,
  labels,
}: {
  variant: Variant;
  src?: string;
  poster?: string;
  labels: { play: string; placeholder: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  if (!src) {
    return (
      <div className={`video video--${variant}`}>
        <button className="play" type="button" aria-label={labels.play}>
          <Icon name="i-play" />
        </button>
        <span className="video__hint">{labels.placeholder}</span>
      </div>
    );
  }

  return (
    <div className={`video video--${variant} has-video${started ? " is-playing" : ""}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="metadata"
      />
      {!started && (
        <button
          className="video__start"
          type="button"
          aria-label={labels.play}
          onClick={() => {
            setStarted(true);
            videoRef.current?.play();
          }}
        >
          <span className="video__start-chip">
            <Icon name="i-play" />
          </span>
        </button>
      )}
    </div>
  );
}
