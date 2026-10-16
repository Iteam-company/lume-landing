"use client";

import { useState } from "react";
import { TELEGRAM_LINK } from "../config";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";

export type LeadCopy = {
  placeholder: string;
  submit: string;
  submitting: string;
  success: string;
  hint: string;
  errors: { phone: string; storage: string; many: string };
};

/** UTM-мітки з адреси: по них видно, з якої реклами прийшла заявка. */
function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [key, value] of params) {
    if (key.startsWith("utm_") || key === "gclid" || key === "fbclid") utm[key] = value;
  }
  return utm;
}

/**
 * Телефон в один рядок: або людина одразу йде в месенджер кнопкою поруч,
 * або лишає номер — тоді ми пишемо його в таблицю разом із міткою
 * реклами й куками Meta і відкриваємо Telegram.
 */
export default function LeadForm({
  copy,
  source,
  className = "",
}: {
  copy: LeadCopy;
  source: "hero" | "contact";
  className?: string;
}) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending") return;

    if (phone.replace(/\D/g, "").length < 9) {
      setError(copy.errors.phone);
      return;
    }

    setState("sending");
    setError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          source,
          page: window.location.pathname,
          referrer: document.referrer,
          lang: document.documentElement.lang,
          utm: readUtm(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error === "too-many" ? copy.errors.many : copy.errors.storage);
        setState("idle");
        return;
      }

      trackPixel("Lead", { content_name: `phone-${source}` });
      setState("done");
      // Людина лишила номер — далі веземо її туди ж, куди веде кнопка.
      window.open(TELEGRAM_LINK, "_blank", "noopener");
    } catch {
      setError(copy.errors.storage);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className={`lead lead--done ${className}`.trim()} role="status">
        <Icon name="i-star" className="star" />
        {copy.success}
      </p>
    );
  }

  return (
    <form className={`lead ${className}`.trim()} onSubmit={submit} noValidate>
      <div className="lead__row">
        <input
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          className="lead__input"
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError(null);
          }}
        />
        <button type="submit" className="btn btn--dark lead__submit" disabled={state === "sending"}>
          {state === "sending" ? copy.submitting : copy.submit}
        </button>
      </div>
      {error ? (
        <p className="lead__error" role="alert">
          {error}
        </p>
      ) : (
        <p className="lead__hint">{copy.hint}</p>
      )}
    </form>
  );
}
