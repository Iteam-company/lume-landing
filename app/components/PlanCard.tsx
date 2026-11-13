"use client";

import { useState } from "react";
import { POSTER_WIDTH, videoPoster } from "./videoPoster";
import {
  finalPrice,
  optionsFor,
  perMinute,
  songPrice,
  type Tier,
} from "../pricing";
import type { Currency } from "../location/types";
import type { Lang } from "../content/lang";
import { formatMinutes, formatPrice } from "../content/format";
import type { TierCopy } from "../content/types";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";
import PlanPreview, { type PreviewLabels } from "./PlanPreview";
import OrderButton from "./OrderButton";

type Labels = {
  perMinute: string;
  perMinuteShort: string;
  minutesShort: string;
  durationAria: string;
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
        poster={videoPoster(`/video/plan-${tier.slug}-poster.jpg`, POSTER_WIDTH.vertical)}
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
        {/* Як у чаті з менеджером: ставка за хвилину і сума за обраний
            хронометраж («2 хвилини = 5 600 ₴»). */}
        <span className="plan__now">
          {formatPrice(perMinute(option), currency, lang)}
          <small>/ {labels.perMinuteShort}</small>
        </span>
        <span className="plan__per">
          {formatMinutes(option.minutes, lang)} = <b>{formatPrice(total, currency, lang)}</b>
        </span>
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

      {/* Вибір із картки переходить в анкету: людина одразу потрапляє на
          крок контактів, а назад до тарифу й хвилин може повернутися. */}
      <OrderButton
        prefill={{ tier: tier.slug, minutes: option.minutes, song: song && !tier.songIncluded }}
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
      </OrderButton>
    </article>
  );
}
