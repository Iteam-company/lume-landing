"use client";

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
import type { Lang } from "../content/lang";
import { formatDateYmd, formatMinutes, formatPrice } from "../content/format";
import type { TierCopy } from "../content/types";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";
import PlanPreview, { type PreviewLabels } from "./PlanPreview";
import ScrollToFormLink from "./ScrollToFormLink";

type Labels = {
  perMinute: string;
  minutesShort: string;
  durationAria: string;
  launchNote: string;
  songAdd: string;
  songIncluded: string;
  order: string;
  preview: PreviewLabels;
};

export default function PlanCard({
  tier,
  currency,
  lang,
  copy,
  labels,
}: {
  tier: Tier;
  currency: Currency;
  lang: Lang;
  copy: TierCopy;
  labels: Labels;
}) {
  const options = optionsFor(tier, currency);

  const [index, setIndex] = useState(tier.defaultOption ?? 0);
  const [song, setSong] = useState(false);
  // Наведення тільки мишкою: на сенсорних екранах pointerenter
  // спрацьовує від тапу й «залипає», там превʼю вмикає сама прокрутка.
  const [hovered, setHovered] = useState(false);
  const option = options[index];
  const off = discount(option);

  // У CINEMA пісня входить у тариф, тож доплати немає.
  const songCost = tier.songIncluded || !song ? 0 : songPrice(currency);
  const total = finalPrice(option) + songCost;

  return (
    <article
      className={`plan${tier.featured ? " plan--featured" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {copy.badge ? <span className="plan__badge">{copy.badge}</span> : null}

      <PlanPreview
        src={`/video/plan-${tier.slug}.mp4`}
        poster={`/video/plan-${tier.slug}-poster.jpg`}
        active={hovered}
        labels={labels.preview}
      />

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
        <span className="plan__now">{formatPrice(total, currency, lang)}</span>
        {/* Стару ціну тримаємо одразу під новою: пара «було / стало»
            має читатися з одного погляду. */}
        {option.sale ? (
          <span className="plan__was">
            <s>{formatPrice(option.base, currency, lang)}</s>
            {off ? <b className="plan__off">−{off}%</b> : null}
          </span>
        ) : null}
        <span className="plan__per">
          {formatPrice(perMinute(option), currency, lang)} {labels.perMinute} ·{" "}
          {formatMinutes(option.minutes, lang)}
        </span>
        {option.sale ? (
          <span className="plan__launch">
            {labels.launchNote.replace("{date}", formatDateYmd(LAUNCH_UNTIL, lang))}
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
            +{formatPrice(songPrice(currency), currency, lang)}
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

      <ScrollToFormLink
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
      </ScrollToFormLink>
    </article>
  );
}
