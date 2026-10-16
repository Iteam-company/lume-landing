"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_PHOTOS, type SizeKey } from "../character";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";
import ChatLink from "./ChatLink";
import { TELEGRAM_LINK } from "../config";

export type StudioCopy = {
  eyebrow: string;
  heading: string;
  lead: string;
  dropTitle: string;
  dropHint: string;
  pick: string;
  clear: string;
  peopleLabel: string;
  peopleMany: string;
  formatLabel: string;
  formats: { square: string; portrait: string };
  generate: string;
  loading: string[];
  resultTitle: string;
  resultNote: string;
  download: string;
  cta: string;
  usedNote: string;
  privacy: string;
  errors: Record<string, string>;
};

type Phase = "idle" | "loading" | "done" | "used";

/** Фото з телефона важить 3-6 МБ, а моделі достатньо 1024 px по довгій
 *  стороні. Стискаємо в браузері: швидше завантаження і дешевша генерація. */
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("blob");

  const name = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
}

export default function CharacterStudio({ copy }: { copy: StudioCopy }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [size, setSize] = useState<SizeKey>("square");
  /* Кількість людей задає користувач: за трьома фото одного й того ж
     обличчя модель інакше вирішує сама й домальовує зайвих персонажів. */
  const [people, setPeople] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Спроба могла бути витрачена в минулому візиті — питаємо сервер,
     щоб не показувати кнопку, яка однаково відповість відмовою. */
  useEffect(() => {
    let alive = true;
    fetch("/api/character", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { used?: boolean }) => {
        if (alive && data.used) setPhase("used");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /* Підписи під час очікування змінюються — інакше хвилина мовчання
     виглядає як зависання. */
  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => setStep((s) => s + 1), 4000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next = Array.from(list).slice(0, MAX_PHOTOS);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(next);
    setPreviews(next.map((file) => URL.createObjectURL(file)));
    setError(null);
    setResult(null);
  }

  function clearFiles() {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function generate() {
    if (files.length === 0 || phase === "loading") return;
    setPhase("loading");
    setStep(0);
    setError(null);
    trackPixel("Lead", { content_name: "character-studio" });

    try {
      const form = new FormData();
      for (const file of files) {
        const prepared = await compress(file).catch(() => file);
        form.append("photos", prepared);
      }
      form.set("size", size);
      form.set("people", String(people));

      const response = await fetch("/api/character", { method: "POST", body: form });
      const data = (await response.json().catch(() => ({}))) as {
        image?: string;
        error?: string;
      };

      if (!response.ok || !data.image) {
        setError(copy.errors[data.error ?? "upstream"] ?? copy.errors.upstream);
        setPhase(data.error === "visitor-limit" ? "used" : "idle");
        return;
      }

      setResult(data.image);
      setPhase("done");
      trackPixel("CompleteRegistration", { content_name: "character-studio" });
    } catch {
      setError(copy.errors.upstream);
      setPhase("idle");
    }
  }

  const busy = phase === "loading";

  return (
    <div className={`studio studio--${size}`}>
      <div className="studio__panel">
        {phase === "done" && result ? (
          <figure className="studio__result">
            {/* результат приходить як data:-URL, next/image тут не застосовний */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} alt={copy.resultTitle} />
            <figcaption>{copy.resultNote}</figcaption>
          </figure>
        ) : busy ? (
          <div className="studio__loading" role="status" aria-live="polite">
            <span className="studio__spinner" aria-hidden="true">
              <Icon name="i-star" className="star" />
            </span>
            <p>{copy.loading[step % copy.loading.length]}</p>
            <span className="studio__bar" aria-hidden="true" />
          </div>
        ) : (
          <>
            <div
              className={`studio__drop${previews.length ? " has-files" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (phase !== "used") addFiles(e.dataTransfer.files);
              }}
            >
              {previews.length > 0 ? (
                <ul className="studio__thumbs">
                  {previews.map((url) => (
                    <li key={url}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" />
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <strong>{copy.dropTitle}</strong>
                  <span>{copy.dropHint}</span>
                </>
              )}

              <input
                ref={inputRef}
                id="studio-files"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={phase === "used"}
                onChange={(e) => addFiles(e.target.files)}
              />
              <label className="btn btn--light studio__pick" htmlFor="studio-files">
                {previews.length ? copy.clear : copy.pick}
              </label>
              {previews.length > 0 ? (
                <button type="button" className="studio__clear" onClick={clearFiles}>
                  ×
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>

      <div className="studio__side">
        <p className="studio__eyebrow">{copy.eyebrow}</p>
        <h2 className="h2 h2--sm h2--dark studio__heading">{copy.heading}</h2>
        <p className="studio__lead">{copy.lead}</p>

        <div className="studio__formats" role="group" aria-label={copy.peopleLabel}>
          <span className="studio__formats-label">{copy.peopleLabel}</span>
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              type="button"
              className={`opt${people === count ? " is-active" : ""}`}
              aria-pressed={people === count}
              disabled={busy}
              onClick={() => setPeople(count)}
            >
              {count === 3 ? copy.peopleMany : count}
            </button>
          ))}
        </div>

        <div className="studio__formats" role="group" aria-label={copy.formatLabel}>
          <span className="studio__formats-label">{copy.formatLabel}</span>
          {(["square", "portrait"] as SizeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`opt${size === key ? " is-active" : ""}`}
              aria-pressed={size === key}
              disabled={busy}
              onClick={() => setSize(key)}
            >
              {copy.formats[key]}
            </button>
          ))}
        </div>

        {phase === "done" && result ? (
          <div className="studio__actions">
            <a className="btn btn--dark" href={result} download="lume-character.png">
              {copy.download}
            </a>
            {/* момент найбільшого інтересу — одразу даємо шлях до замовлення */}
            <ChatLink href={TELEGRAM_LINK} channel="Telegram" className="btn btn--light">
              {copy.cta}
            </ChatLink>
            <p className="studio__note">{copy.usedNote}</p>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--dark studio__go"
            disabled={busy || phase === "used" || files.length === 0}
            onClick={generate}
          >
            {copy.generate}
          </button>
        )}

        {error ? (
          <p className="studio__error" role="alert">
            {error}
          </p>
        ) : null}
        {phase === "used" && !result ? <p className="studio__note">{copy.usedNote}</p> : null}
        <p className="studio__privacy">{copy.privacy}</p>
      </div>
    </div>
  );
}
