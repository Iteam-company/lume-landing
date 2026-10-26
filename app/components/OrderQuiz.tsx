"use client";

import { useEffect, useRef, useState } from "react";
import { TELEGRAM_LINK, WHATSAPP_LINK } from "../config";
import type { Dictionary } from "../content/dictionary";
import { formatMinutes, formatPrice } from "../content/format";
import type { Lang } from "../content/lang";
import type { Currency } from "../location/types";
import { trackPixel } from "../pixel";
import {
  discount,
  optionsFor,
  priceFor,
  songPrice,
  TIERS,
  type TierSlug,
} from "../pricing";
import { Icon } from "./Icons";
import { POSTER_WIDTH, videoPoster } from "./videoPoster";
import { offerActive } from "./OfferCountdown";
import { ORDER_EVENT, type OrderPrefill } from "./order-events";

type Channel = "telegram" | "whatsapp";

/** Кроки анкети. Останній — вибір месенджера, він же й відправляє заявку. */
const STEPS = ["tier", "minutes", "contacts", "messenger"] as const;
type Step = (typeof STEPS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** UTM-мітки з адреси: по них видно, з якої реклами прийшла заявка. */
function readUtm(): Record<string, string> {
  const utm: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(window.location.search)) {
    if (key.startsWith("utm_") || key === "gclid" || key === "fbclid") utm[key] = value;
  }
  return utm;
}

function timeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

/**
 * Анкета замовлення: тариф → хвилини → контакти → месенджер.
 *
 * Номер обовʼязковий, e-mail — ні. На останньому кроці людина обирає
 * Telegram чи WhatsApp: клік одночасно відправляє заявку (разом із
 * локацією — країну, регіон і місто сервер бере з гео Vercel, часовий
 * пояс — з браузера) і відкриває чат. Чат відкриваємо звичайним
 * посиланням у момент кліку, не чекаючи відповіді сервера: відкриття
 * вікна після await браузери блокують як спливаюче.
 */
export default function OrderQuiz({
  copy,
  pricing,
  currency,
  lang,
}: {
  copy: Dictionary["quiz"];
  pricing: Dictionary["pricing"];
  currency: Currency;
  lang: Lang;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("tier");
  const [tierSlug, setTierSlug] = useState<TierSlug | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [song, setSong] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<"phone" | "email" | null>(null);
  const [sent, setSent] = useState<{ channel: Channel; href: string } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  // Телефон: тарифи — вкладками, видно одну картку (див. крок «tier»).
  const [tab, setTab] = useState<TierSlug>("signature");
  const swipeX = useRef<number | null>(null);

  const tier = TIERS.find((t) => t.slug === tierSlug) ?? null;
  const options = tier ? optionsFor(tier, currency) : [];
  const songCost = tier && !tier.songIncluded && song ? songPrice(currency) : 0;
  const total = tier && minutes ? priceFor(tier, minutes, currency) + songCost : 0;

  // Відкриття — з будь-якої кнопки сторінки (див. order-events.ts).
  useEffect(() => {
    function onOpen(event: Event) {
      const prefill = (event as CustomEvent<OrderPrefill>).detail ?? {};
      const known = TIERS.find((t) => t.slug === prefill.tier);

      // Після надісланої заявки починаємо з чистого аркуша.
      setSent(null);
      setSendError(null);
      setFieldError(null);

      if (known) {
        setTierSlug(known.slug);
        setTab(known.slug);
        const valid = optionsFor(known, currency).some((o) => o.minutes === prefill.minutes);
        setMinutes(valid ? prefill.minutes! : null);
        setSong(Boolean(prefill.song) && !known.songIncluded);
        // Тариф і хвилини вже обрані в картці — одразу до контактів.
        setStep(valid ? "contacts" : "minutes");
      } else {
        setStep("tier");
      }

      dialogRef.current?.showModal();
    }
    window.addEventListener(ORDER_EVENT, onOpen);
    return () => window.removeEventListener(ORDER_EVENT, onOpen);
  }, [currency]);

  useEffect(() => {
    if (step === "contacts") phoneRef.current?.focus();
  }, [step]);

  const stepIndex = STEPS.indexOf(step);

  function close() {
    dialogRef.current?.close();
  }

  function back() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
  }

  function chooseTier(slug: TierSlug) {
    const next = TIERS.find((t) => t.slug === slug)!;
    if (slug !== tierSlug) {
      setTierSlug(slug);
      setMinutes(null);
      setSong(false);
    }
    trackPixel("ViewContent", { content_name: next.name, content_category: next.name, currency });
    setStep("minutes");
  }

  function submitContacts(event: React.FormEvent) {
    event.preventDefault();
    if (phone.replace(/\D/g, "").length < 9) {
      setFieldError("phone");
      phoneRef.current?.focus();
      return;
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      setFieldError("email");
      return;
    }
    setFieldError(null);
    setStep("messenger");
  }

  const summary =
    tier && minutes
      ? `${tier.name} · ${formatMinutes(minutes, lang)}${songCost ? ` + ♪` : ""} · ${formatPrice(total, currency, lang)}`
      : "";

  function chatHref(channel: Channel): string {
    if (channel === "telegram") return TELEGRAM_LINK;
    // WhatsApp уміє підставити текст — куратор одразу бачить вибір.
    const text = copy.chatText.replace("{summary}", summary);
    return `${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`;
  }

  function send(channel: Channel) {
    if (!tier || !minutes) return;
    const href = chatHref(channel);

    trackPixel("Lead", {
      content_name: `quiz-${channel}`,
      content_category: tier.name,
      value: total,
      currency,
    });
    trackPixel("Contact", { content_name: channel === "telegram" ? "Telegram" : "WhatsApp" });

    setSent({ channel, href });
    setSendError(null);

    // keepalive: запит доживе, навіть якщо вкладка піде у фон через чат.
    fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "quiz",
        phone,
        email: email.trim(),
        tier: tier.slug,
        minutes,
        song: song && !tier.songIncluded,
        messenger: channel,
        offer: offerActive(),
        timeZone: timeZone(),
        page: window.location.pathname,
        referrer: document.referrer,
        lang: document.documentElement.lang,
        utm: readUtm(),
      }),
    })
      .then(async (response) => {
        if (response.ok) return;
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setSendError(data.error === "too-many" ? copy.errorMany : copy.errorStorage);
      })
      .catch(() => setSendError(copy.errorStorage));
  }

  return (
    <dialog
      ref={dialogRef}
      // Крок тарифів ширший і на всю висоту: картки з роликами.
      className={`quiz${step === "tier" && !sent ? " quiz--plans" : ""}`}
      aria-labelledby="quiz-title"
      // Клік по затемненню довкола картки закриває вікно.
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="quiz__card">
        <header className="quiz__head">
          {stepIndex > 0 && !sent ? (
            <button type="button" className="quiz__icon-btn" onClick={back} aria-label={copy.back}>
              ←
            </button>
          ) : (
            <span className="quiz__icon-spacer" />
          )}
          <div className="quiz__heading">
            <h2 id="quiz-title" className="quiz__title">
              {copy.title}
            </h2>

          </div>
          <button type="button" className="quiz__icon-btn" onClick={close} aria-label={copy.close}>
            ×
          </button>
        </header>

        {!sent ? (
          /* Степер: пройдені кроки — з галочкою і клікабельні (повернутися
             й змінити вибір), поточний — винний, наступні — контуром. */
          <nav className="quiz__steps" aria-label={copy.step.replace("{n}", String(stepIndex + 1)).replace("{total}", String(STEPS.length))}>
            <span
              className="quiz__steps-line"
              aria-hidden="true"
              style={{ ["--done" as string]: stepIndex / (STEPS.length - 1) }}
            />
            {STEPS.map((key, i) => {
              const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "todo";
              return (
                <button
                  key={key}
                  type="button"
                  className={`quiz__steps-item is-${state}`}
                  disabled={state !== "done"}
                  aria-current={state === "current" ? "step" : undefined}
                  onClick={() => setStep(key)}
                >
                  <span className="quiz__steps-dot">
                    {state === "done" ? (
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3.5 8.5l3 3 6-7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="quiz__steps-label">{copy.stepLabels[i]}</span>
                </button>
              );
            })}
          </nav>
        ) : null}

        <div className="quiz__body">
          {sent ? (
            <div className="quiz__done" role="status">
              <Icon name="i-star" className="star" />
              <h3 className="quiz__q">{copy.doneTitle}</h3>
              <p className="quiz__hint">
                {copy.doneText}
                <a href={sent.href} target="_blank" rel="noopener noreferrer">
                  {copy.doneLink}
                </a>
                .
              </p>
              {sendError ? (
                <p className="quiz__error" role="alert">
                  {sendError}
                </p>
              ) : null}
            </div>
          ) : step === "tier" ? (
            <>
              <h3 className="quiz__q">{copy.tierTitle}</h3>
              {/* Картки в мові секції тарифів: ролик-приклад зверху, опис під
                  ним. Десктоп: три в ряд; телефон: свайп-карусель. */}
              <div className="quiz__tabs" role="tablist" aria-label={copy.tierTitle}>
                {TIERS.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    role="tab"
                    aria-selected={t.slug === tab}
                    className={`quiz__tab${t.slug === tab ? " is-active" : ""}`}
                    onClick={() => setTab(t.slug)}
                  >
                    {t.name}
                    {t.featured ? <span className="quiz__tab-dot" aria-hidden="true" /> : null}
                  </button>
                ))}
              </div>
              <div
                className="quiz__plans"
                // Свайп по картці гортає вкладки — на телефоні це очікуваний жест.
                onTouchStart={(e) => {
                  swipeX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (swipeX.current === null) return;
                  const dx = e.changedTouches[0].clientX - swipeX.current;
                  swipeX.current = null;
                  if (Math.abs(dx) < 50) return;
                  const i = TIERS.findIndex((t) => t.slug === tab);
                  const next = TIERS[Math.min(TIERS.length - 1, Math.max(0, i + (dx < 0 ? 1 : -1)))];
                  setTab(next.slug);
                }}
              >
                {TIERS.map((t) => {
                  const tc = pricing.tiers[t.slug];
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      className={`quiz__plan${t.featured ? " quiz__plan--featured" : ""}${
                        t.slug === tierSlug ? " is-active" : ""
                      }${t.slug === tab ? " is-tab" : ""}`}
                      aria-pressed={t.slug === tierSlug}
                      onClick={() => chooseTier(t.slug)}
                    >
                      <span className="quiz__plan-media">
                        <video
                          src={`/video/plan-${t.slug}.mp4`}
                          poster={videoPoster(`/video/plan-${t.slug}-poster.jpg`, POSTER_WIDTH.hero)}
                          muted
                          loop
                          autoPlay
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                        />
                        {tc.badge ? <em className="quiz__badge quiz__plan-badge">{tc.badge}</em> : null}
                      </span>
                      <span className="quiz__plan-info">
                        <span className="quiz__plan-name">{t.name}</span>
                        <span className="quiz__plan-tagline">{tc.tagline}</span>
                        <TierPrice tier={t} currency={currency} lang={lang} perMinute={pricing.perMinute} />
                        <ul className="quiz__features">
                          {tc.features.map((item) => (
                            <li key={item}>
                              <Icon name="i-star" className="star" />
                              {item}
                            </li>
                          ))}
                          {t.songIncluded ? (
                            <li className="quiz__feature-accent">
                              <Icon name="i-star" className="star" />
                              {pricing.songIncluded}
                            </li>
                          ) : null}
                        </ul>
                      </span>
                      <span className="quiz__plan-cta" aria-hidden="true">
                        {copy.choose} {t.name}
                        <span className="quiz__plan-arrow">→</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : step === "minutes" && tier ? (
            <>
              <h3 className="quiz__q">{copy.minutesTitle}</h3>
              <p className="quiz__hint">{copy.minutesHint}</p>
              <div className="quiz__minutes">
                {options.map((o) => (
                  <button
                    key={o.minutes}
                    type="button"
                    className={`quiz__minute${o.minutes === minutes ? " is-active" : ""}`}
                    aria-pressed={o.minutes === minutes}
                    onClick={() => setMinutes(o.minutes)}
                  >
                    <b>{o.minutes}</b>
                    <span>{pricing.minutesShort}</span>
                    <small>{formatPrice(o.sale ?? o.base, currency, lang)}</small>
                  </button>
                ))}
              </div>
              {tier.songIncluded ? (
                <p className="quiz__song quiz__song--included">
                  <Icon name="i-star" className="star" />
                  {pricing.songIncluded}
                </p>
              ) : (
                <label className="quiz__song">
                  <input type="checkbox" checked={song} onChange={(e) => setSong(e.target.checked)} />
                  <span>{pricing.songAdd}</span>
                  <b>+{formatPrice(songPrice(currency), currency, lang)}</b>
                </label>
              )}
              <div className="quiz__foot">
                {minutes ? (
                  <span className="quiz__total">
                    {copy.total}: <b>{formatPrice(total, currency, lang)}</b>
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  className="btn btn--dark quiz__next"
                  disabled={!minutes}
                  onClick={() => setStep("contacts")}
                >
                  {copy.next}
                </button>
              </div>
            </>
          ) : step === "contacts" ? (
            <form onSubmit={submitContacts} noValidate>
              <h3 className="quiz__q">{copy.contactsTitle}</h3>
              <label className="quiz__field">
                <span className="quiz__label">{copy.phoneLabel} *</span>
                <span className="quiz__input-wrap">
                  <svg className="quiz__input-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z" />
                  </svg>
                <input
                  ref={phoneRef}
                  type="tel"
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  className="lead__input"
                  placeholder={copy.phonePlaceholder}
                  value={phone}
                  aria-invalid={fieldError === "phone"}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldError === "phone") setFieldError(null);
                  }}
                />
                </span>
                {fieldError === "phone" ? (
                  <span className="quiz__error" role="alert">
                    {copy.phoneError}
                  </span>
                ) : (
                  /* Помітна підказка: без месенджера на номері куратор не
                     зможе написати — це головна причина «загублених» заявок. */
                  <span className="quiz__callout">
                    <span className="quiz__callout-icons" aria-hidden="true">
                      <span className="quiz__callout-icon quiz__callout-icon--tg">
                        <Icon name="i-tg" />
                      </span>
                      <span className="quiz__callout-icon quiz__callout-icon--wa">
                        <Icon name="i-wa" />
                      </span>
                    </span>
                    <span>{copy.phoneNote}</span>
                  </span>
                )}
              </label>
              <label className="quiz__field">
                <span className="quiz__label">
                  {copy.emailLabel} <i>({copy.emailOptional})</i>
                </span>
                <span className="quiz__input-wrap">
                  <svg className="quiz__input-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
                    <path d="M4.5 7l7.5 6 7.5-6" />
                  </svg>
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  className="lead__input"
                  placeholder={copy.emailPlaceholder}
                  value={email}
                  aria-invalid={fieldError === "email"}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError === "email") setFieldError(null);
                  }}
                />
                </span>
                {fieldError === "email" ? (
                  <span className="quiz__error" role="alert">
                    {copy.emailError}
                  </span>
                ) : null}
              </label>
              <div className="quiz__foot">
                <span className="quiz__total">{summary}</span>
                <button type="submit" className="btn btn--dark quiz__next">
                  {copy.next}
                </button>
              </div>
            </form>
          ) : step === "messenger" ? (
            <>
              <h3 className="quiz__q">{copy.messengerTitle}</h3>
              <p className="quiz__hint">{copy.messengerHint}</p>
              <div className="quiz__messengers">
                <a
                  href={chatHref("telegram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--tg"
                  onClick={() => send("telegram")}
                >
                  <span className="icon-chip">
                    <Icon name="i-tg" />
                  </span>
                  Telegram
                </a>
                <a
                  href={chatHref("whatsapp")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--wa"
                  onClick={() => send("whatsapp")}
                >
                  <span className="icon-chip">
                    <Icon name="i-wa" />
                  </span>
                  WhatsApp
                </a>
              </div>
              <p className="quiz__summary">{summary}</p>
            </>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

/**
 * Ставка тарифу за хвилину — крупно, як головне число картки. Над нею —
 * та сама пара «було / стало», що й у секції тарифів.
 */
function TierPrice({
  tier,
  currency,
  lang,
  perMinute,
}: {
  tier: (typeof TIERS)[number];
  currency: Currency;
  lang: Lang;
  perMinute: string;
}) {
  // Ставка однакова для будь-якого хронометражу — беремо одну хвилину.
  const one = optionsFor(tier, currency)[0];
  const off = discount(one);
  return (
    <span className="quiz__price">
      {one.sale ? (
        <span className="quiz__price-was">
          <s>{formatPrice(one.base, currency, lang)}</s>
          {off ? <b>−{off}%</b> : null}
        </span>
      ) : null}
      <span className="quiz__price-now">
        <strong>{formatPrice(one.sale ?? one.base, currency, lang)}</strong>
        <span>/ {perMinute}</span>
      </span>
    </span>
  );
}
