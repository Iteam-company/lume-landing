"use client";

import Link from "next/link";
import { useState } from "react";
import {
  discount,
  finalPrice,
  launchUntilLabel,
  minutesLabel,
  perMinute,
  price,
  type Tier,
} from "../pricing";
import { trackPixel } from "../pixel";
import { Icon } from "./Icons";

export default function PlanCard({ tier }: { tier: Tier }) {
  const [index, setIndex] = useState(tier.defaultOption ?? 0);
  const option = tier.options[index];
  const off = discount(option);
  const isDiamond = tier.slug === "diamond";

  return (
    <article
      className={`plan${tier.featured ? " plan--featured" : ""}${
        isDiamond ? " plan--diamond" : ""
      }`}
    >
      {tier.badge ? <span className="plan__badge">{tier.badge}</span> : null}

      <h3 className="plan__name">{tier.name}</h3>
      <p className="plan__tagline">{tier.tagline}</p>

      <div
        className="plan__opts"
        role="group"
        aria-label={`Хронометраж, тариф ${tier.name}`}
      >
        {tier.options.map((o, i) => (
          <button
            key={o.minutes}
            type="button"
            className={`opt${i === index ? " is-active" : ""}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            {o.minutes} хв
          </button>
        ))}
      </div>

      <div className="plan__price">
        <span className="plan__now">{price(finalPrice(option))}</span>
        <span className="plan__per">
          {price(perMinute(option))} за хвилину · {minutesLabel(option.minutes)}
        </span>
        {option.sale ? (
          <>
            <span className="plan__was">
              <s>{price(option.base)}</s>
              {off ? <b className="plan__off">−{off}%</b> : null}
            </span>
            <span className="plan__launch">
              Стартова ціна діє до {launchUntilLabel()}
            </span>
          </>
        ) : null}
      </div>

      <ul className="plan__list">
        {tier.features.map((item) => (
          <li key={item}>
            <Icon name="i-star" className="star" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={`/?tier=${tier.slug}&minutes=${option.minutes}#form`}
        className={`btn ${
          isDiamond ? "btn--gold" : tier.featured ? "btn--light" : "btn--dark"
        } plan__cta`}
        onClick={() =>
          trackPixel("ViewContent", {
            content_name: `${tier.name} · ${option.minutes} хв`,
            content_category: tier.name,
            value: finalPrice(option),
            currency: "USD",
          })
        }
      >
        Замовити
      </Link>
    </article>
  );
}
