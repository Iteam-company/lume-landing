"use client";

import Link from "next/link";
import { useState } from "react";
import {
  discount,
  finalPrice,
  LAUNCH_UNTIL,
  optionsFor,
  perMinute,
  songPrice,
  type Tier,
} from "../pricing";
import type { Currency } from "../location/types";
import { formatDateYmd, formatMinutes, formatPrice } from "../content/format";
import type { TierCopy } from "../content/types";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";

type Labels = {
  perMinute: string;
  minutesShort: string;
  durationAria: string;
  launchNote: string;
  songAdd: string;
  songIncluded: string;
  order: string;
};

export default function PlanCard({
  tier,
  currency,
  copy,
  labels,
}: {
  tier: Tier;
  currency: Currency;
  copy: TierCopy;
  labels: Labels;
}) {
  const options = optionsFor(tier, currency);

  const [index, setIndex] = useState(tier.defaultOption ?? 0);
  const [song, setSong] = useState(false);
  const option = options[index];
  const off = discount(option);

  // У CINEMA пісня входить у тариф, тож доплати немає.
  const songCost = tier.songIncluded || !song ? 0 : songPrice(currency);
  const total = finalPrice(option) + songCost;

  return (
    <article className={`plan${tier.featured ? " plan--featured" : ""}`}>
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
        <span className="plan__now">{formatPrice(total, currency)}</span>
        {/* Стару ціну тримаємо одразу під новою: пара «було / стало»
            має читатися з одного погляду. */}
        {option.sale ? (
          <span className="plan__was">
            <s>{formatPrice(option.base, currency)}</s>
            {off ? <b className="plan__off">−{off}%</b> : null}
          </span>
        ) : null}
        <span className="plan__per">
          {formatPrice(perMinute(option), currency)} {labels.perMinute} ·{" "}
          {formatMinutes(option.minutes)}
        </span>
        {option.sale ? (
          <span className="plan__launch">
            {labels.launchNote.replace("{date}", formatDateYmd(LAUNCH_UNTIL))}
          </span>
        ) : null}
      </div>

      {tier.songIncluded ? (
        <p className="plan__song plan__song--included">
          <Icon name="i-star" className="star" />
          {labels.songIncluded}
        </p>
      ) : (
        <label className="plan__song">
          <input
            type="checkbox"
            checked={song}
            onChange={(e) => setSong(e.target.checked)}
          />
          <span className="plan__song-box" aria-hidden="true" />
          <span className="plan__song-text">{labels.songAdd}</span>
          <span className="plan__song-price">
            +{formatPrice(songPrice(currency), currency)}
          </span>
        </label>
      )}

      <ul className="plan__list">
        {copy.features.map((item) => (
          <li key={item}>
            <Icon name="i-star" className="star" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={`/?tier=${tier.slug}&minutes=${option.minutes}${
          song && !tier.songIncluded ? "&song=1" : ""
        }#form`}
        className={`btn ${tier.featured ? "btn--light" : "btn--dark"} plan__cta`}
        onClick={() =>
          trackPixel("ViewContent", {
            content_name: `${tier.name} · ${option.minutes} ${labels.minutesShort}`,
            content_category: tier.name,
            value: total,
            currency,
          })
        }
      >
        {labels.order}
      </Link>
    </article>
  );
}
