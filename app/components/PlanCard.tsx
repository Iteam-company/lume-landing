"use client";

import Link from "next/link";
import { useState } from "react";
import {
  discount,
  finalPrice,
  LAUNCH_UNTIL,
  optionsFor,
  perMinute,
  type Tier,
} from "../pricing";
import { localeToCurrency, type Locale } from "../i18n/config";
import { formatDateYmd, formatMinutes, formatPrice } from "../i18n/format";
import { localeHref } from "../i18n/locale-path";
import type { TierCopy } from "../i18n/dictionaries/types";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";

type Labels = {
  perMinute: string;
  minutesShort: string;
  durationAria: string;
  launchNote: string;
  order: string;
};

export default function PlanCard({
  tier,
  lang,
  copy,
  labels,
}: {
  tier: Tier;
  lang: Locale;
  copy: TierCopy;
  labels: Labels;
}) {
  const currency = localeToCurrency(lang);
  const options = optionsFor(tier, currency);

  const [index, setIndex] = useState(tier.defaultOption ?? 0);
  const option = options[index];
  const off = discount(option);
  const isDiamond = tier.slug === "diamond";

  return (
    <article
      className={`plan${tier.featured ? " plan--featured" : ""}${
        isDiamond ? " plan--diamond" : ""
      }`}
    >
      {copy.badge ? <span className="plan__badge">{copy.badge}</span> : null}

      <h3 className="plan__name">{tier.name}</h3>
      <p className="plan__tagline">{copy.tagline}</p>

      <div
        className="plan__opts"
        role="group"
        aria-label={labels.durationAria.replace("{name}", tier.name)}
      >
        {options.map((o, i) => (
          <button
            key={o.minutes}
            type="button"
            className={`opt${i === index ? " is-active" : ""}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {o.minutes} {labels.minutesShort}
          </button>
        ))}
      </div>

      <div className="plan__price">
        <span className="plan__now">{formatPrice(finalPrice(option), lang)}</span>
        <span className="plan__per">
          {formatPrice(perMinute(option), lang)} {labels.perMinute} ·{" "}
          {formatMinutes(option.minutes, lang)}
        </span>
        {option.sale ? (
          <>
            <span className="plan__was">
              <s>{formatPrice(option.base, lang)}</s>
              {off ? <b className="plan__off">−{off}%</b> : null}
            </span>
            <span className="plan__launch">
              {labels.launchNote.replace(
                "{date}",
                formatDateYmd(LAUNCH_UNTIL, lang),
              )}
            </span>
          </>
        ) : null}
      </div>

      <ul className="plan__list">
        {copy.features.map((item) => (
          <li key={item}>
            <Icon name="i-star" className="star" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={localeHref(
          lang,
          `/?tier=${tier.slug}&minutes=${option.minutes}#form`,
        )}
        className={`btn ${
          isDiamond ? "btn--gold" : tier.featured ? "btn--light" : "btn--dark"
        } plan__cta`}
        onClick={() =>
          trackPixel("ViewContent", {
            content_name: `${tier.name} · ${option.minutes} ${labels.minutesShort}`,
            content_category: tier.name,
            value: finalPrice(option),
            currency,
          })
        }
      >
        {labels.order}
      </Link>
    </article>
  );
}
