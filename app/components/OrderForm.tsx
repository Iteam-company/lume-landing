"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { finalPrice, optionsFor, TIERS } from "../pricing";
import { localeToCurrency, type Locale } from "../i18n/config";
import { formatMinutes, formatPrice } from "../i18n/format";
import { localeHref } from "../i18n/locale-path";
import type { Dictionary } from "../i18n/dictionaries";
import {
  isMinutes,
  isTierSlug,
  resolvePaddlePriceId,
  type CheckoutCustomData,
} from "../paddle";
import { usePaddle } from "./PaddleProvider";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";

type Errors = Partial<Record<"name" | "phone" | "telegram" | "email", boolean>>;

function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("380")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 9);
  let out = "+380";
  if (d.length) out += " (" + d.slice(0, 2);
  if (d.length >= 2) out += ") " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}

const isValid = {
  name: (v: string) => v.trim().length >= 2,
  phone: (v: string) => v.replace(/\D/g, "").length >= 12,
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),
  telegram: (v: string) =>
    v.trim() === "" ||
    /^@?[A-Za-z0-9_]{4,32}$/.test(v.trim().replace(/^https?:\/\/t\.me\//i, "")),
};

export default function OrderForm({
  dict,
  lang,
}: {
  dict: Dictionary["form"];
  lang: Locale;
}) {
  const currency = localeToCurrency(lang);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    telegram: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const { paddle, checkoutPhase, resetCheckout } = usePaddle();
  const searchParams = useSearchParams();

  const selection = useMemo(() => {
    const tierParam = searchParams.get("tier");
    const minutesParam = Number(searchParams.get("minutes"));
    if (!isTierSlug(tierParam) || !isMinutes(minutesParam)) return null;

    const tier = TIERS.find((t) => t.slug === tierParam);
    const option = optionsFor(tier ?? TIERS[0], currency).find(
      (o) => o.minutes === minutesParam,
    );
    if (!tier || !option) return null;

    return {
      slug: tierParam,
      minutes: minutesParam,
      tierName: tier.name,
      amount: finalPrice(option),
      priceId: resolvePaddlePriceId(tierParam, minutesParam),
    };
  }, [searchParams, currency]);

  const [checkoutRequested, setCheckoutRequested] = useState(false);

  const set = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: false }));
    setSubmitError(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    (Object.keys(values) as (keyof typeof values)[]).forEach((k) => {
      if (!isValid[k](values[k])) next[k] = true;
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    const priceId = selection?.priceId ?? null;

    setSubmitting(true);
    setSubmitError(false);

    let ok = false;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          telegram: values.telegram.trim(),
          email: values.email.trim(),
          locale: lang,
          ...(selection
            ? { tier: selection.slug, minutes: selection.minutes }
            : {}),
        }),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }

    setSubmitting(false);

    if (!ok) {
      setSubmitError(true);
      return;
    }

    setSent(true);

    const selectionName = selection
      ? `${selection.tierName} · ${formatMinutes(selection.minutes, lang)}`
      : dict.leadContentName;

    // Основна конверсія воронки: заявку заповнено і надіслано.
    trackPixel("Lead", {
      content_name: selectionName,
      ...(selection ? { value: selection.amount, currency } : {}),
    });

    if (paddle && priceId && selection) {
      resetCheckout();
      setCheckoutRequested(true);
      trackPixel("InitiateCheckout", {
        content_name: selectionName,
        value: selection.amount,
        currency,
      });
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: values.email.trim() },
        customData: {
          tier: selection.slug,
          minutes: selection.minutes,
        } satisfies CheckoutCustomData,
        settings: { variant: "one-page" },
      });
    }
  };

  return (
    <form className={`form${sent ? " is-sent" : ""}`} onSubmit={onSubmit} noValidate>
      <svg className="butterfly" viewBox="0 0 64 52" aria-hidden="true">
        <path
          d="M32 26c-2-9-9-20-18-23-7-2-12 3-12 11 0 9 8 17 17 20-8 2-14 7-14 13 0 4 3 6 7 5 9-2 17-13 20-22-.2-1.3-.2-2.7 0-4z"
          fill="currentColor"
        />
        <path
          d="M32 26c2-9 9-20 18-23 7-2 12 3 12 11 0 9-8 17-17 20 8 2 14 7 14 13 0 4-3 6-7 5-9-2-17-13-20-22 .2-1.3 .2-2.7 0-4z"
          fill="currentColor"
        />
        <path
          d="M32 22c1.2 0 2 1 2 2.4v13c0 2-1 3.6-2 3.6s-2-1.6-2-3.6v-13c0-1.4.8-2.4 2-2.4z"
          fill="currentColor"
        />
      </svg>

      <label className={`field${errors.name ? " is-error" : ""}`}>
        <span className="field__label">{dict.nameLabel}</span>
        <input
          type="text"
          name="name"
          placeholder={dict.namePlaceholder}
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <span className="field__err">{dict.nameError}</span>
      </label>

      <div className={`field${errors.phone ? " is-error" : ""}`}>
        <span className="field__label">
          {dict.phoneLabel}
          <Icon name="i-wa" className="badge badge--wa" />
        </span>
        <div className="phone">
          <span className="phone__flag">
            <span className="flag">🇺🇦</span>
            <span className="caret" />
          </span>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            placeholder={dict.phonePlaceholder}
            autoComplete="tel"
            value={values.phone}
            onFocus={() => !values.phone && set("phone", "+380 (")}
            onChange={(e) => set("phone", maskPhone(e.target.value))}
          />
        </div>
        <span className="field__err">{dict.phoneError}</span>
      </div>

      <label className={`field${errors.telegram ? " is-error" : ""}`}>
        <span className="field__label">
          {dict.telegramLabel}
          <Icon name="i-tg" className="badge badge--tg" />
        </span>
        <span className="field__hint">{dict.telegramHint}</span>
        <input
          type="text"
          name="telegram"
          placeholder={dict.telegramPlaceholder}
          autoComplete="off"
          value={values.telegram}
          onChange={(e) => set("telegram", e.target.value)}
        />
        <span className="field__err">{dict.telegramError}</span>
      </label>

      <label className={`field${errors.email ? " is-error" : ""}`}>
        <span className="field__label">
          {dict.emailLabel}
          <Icon name="i-mail" className="badge badge--mail" />
        </span>
        <span className="field__hint">{dict.emailHint}</span>
        <input
          type="email"
          name="email"
          placeholder={dict.emailPlaceholder}
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <span className="field__err">{dict.emailError}</span>
      </label>

      {selection && (
        <p className="form__selection">
          <span className="form__selection-tier">{selection.tierName}</span>
          {" · "}
          {formatMinutes(selection.minutes, lang)}
          {" · "}
          <b>{formatPrice(selection.amount, lang)}</b>
        </p>
      )}

      <button className="btn btn--cta" type="submit" disabled={submitting}>
        {submitting
          ? dict.submitting
          : selection && paddle && selection.priceId
            ? dict.submitToPay
            : dict.submit}
      </button>

      {submitError && (
        <p className="form__error" role="alert">
          {dict.submitError}
        </p>
      )}

      <p className="form__note">
        {dict.privacyNoteBefore}
        <Link href={localeHref(lang, "/privacy")}>{dict.privacyNoteLink}</Link>
      </p>

      {sent && (
        <div className="form__ok">
          {checkoutRequested && checkoutPhase === "completed" ? (
            <>
              <strong>{dict.okPaidTitle}</strong>
              <span>{dict.okPaidText}</span>
            </>
          ) : checkoutRequested && checkoutPhase === "closed" ? (
            <>
              <strong>{dict.okClosedTitle}</strong>
              <span>{dict.okClosedText}</span>
            </>
          ) : checkoutRequested ? (
            <>
              <strong>{dict.okOpeningTitle}</strong>
              <span>{dict.okOpeningText}</span>
            </>
          ) : (
            <>
              <strong>{dict.okSentTitle}</strong>
              <span>{dict.okSentText}</span>
            </>
          )}
        </div>
      )}
    </form>
  );
}
