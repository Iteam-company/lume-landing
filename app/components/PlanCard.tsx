"use client";

import Link from "next/link";
import { useState } from "react";
import {
  discount,
  finalPrice,
  minutesLabel,
  perMinute,
  price,
  type Tier,
} from "../pricing";
import { Icon } from "./Icons";

/** Спільні для всіх тарифів пункти — те, що вже обіцяє сайт. */
const INCLUDED = [
  "Готово за 1 день",
  "Full HD для телефона та соцмереж",
  "Особистий куратор",
];

export default function PlanCard({ tier }: { tier: Tier }) {
  const [index, setIndex] = useState(tier.defaultOption ?? 0);
  const option = tier.options[index];
  const off = discount(option);

  return (
    <article className={`plan${tier.featured ? " plan--featured" : ""}`}>
      {tier.badge ? <span className="plan__badge">{tier.badge}</span> : null}

      <h3 className="plan__name">{tier.name}</h3>
      <p className="plan__tagline">{tier.tagline}</p>

      <div className="plan__opts" role="group" aria-label={`Хронометраж, тариф ${tier.name}`}>
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
          <span className="plan__was">
            <s>{price(option.base)}</s>
            {off ? <b className="plan__off">−{off}%</b> : null}
          </span>
        ) : null}
      </div>

      <ul className="plan__list">
        {INCLUDED.map((item) => (
          <li key={item}>
            <Icon name="i-star" className="star" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/#form"
        className={`btn ${tier.featured ? "btn--light" : "btn--dark"} plan__cta`}
      >
        Замовити
      </Link>
    </article>
  );
}
