import { Icon } from "./Icons";

type Variant = "wide" | "16x9" | "9x16";

/**
 * Відео або плейсхолдер під нього.
 *
 * Коли `src` заданий, керування повністю віддане нативним контролам
 * браузера. Свій обробник кліку на контейнері тут ставити не можна:
 * тап по кнопці паузи спливає до контейнера, і той одразу вмикає
 * відео назад — на iPhone пауза через це не спрацьовувала взагалі.
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
  return (
    <div className={`video video--${variant}${src ? " has-video" : ""}`}>
      {src ? (
        <video src={src} poster={poster} controls playsInline preload="metadata" />
      ) : (
        <>
          <button className="play" type="button" aria-label={labels.play}>
            <Icon name="i-play" />
          </button>
          <span className="video__hint">{labels.placeholder}</span>
        </>
      )}
    </div>
  );
}
