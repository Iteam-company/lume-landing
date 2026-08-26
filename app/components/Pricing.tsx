import Link from "next/link";
import { discount, price, PLANS } from "../pricing";
import { Icon } from "./Icons";
import Reveal from "./Reveal";

/** Спільні для всіх тарифів пункти — те, що вже обіцяє сайт. */
const INCLUDED = ["Готово за 1 день", "Full HD для телефона та соцмереж", "Особистий куратор"];

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <Reveal as="h2" className="h2 h2--dark">
          Вартість:
        </Reveal>

        <div className="pricing__grid">
          {PLANS.map((plan, i) => {
            const off = discount(plan);
            return (
              <Reveal
                key={plan.name}
                as="article"
                className={`plan${plan.featured ? " plan--featured" : ""}`}
                delay={(i % 4) as 0 | 1 | 2 | 3}
              >
                {plan.badge ? <span className="plan__badge">{plan.badge}</span> : null}

                <h3 className="plan__name">{plan.name}</h3>
                <p className="plan__dur script">{plan.duration}</p>

                <div className="plan__price">
                  <span className="plan__now">{price(plan.sale ?? plan.base)}</span>
                  {plan.sale ? (
                    <span className="plan__was">
                      <s>{price(plan.base)}</s>
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
                  className={`btn ${plan.featured ? "btn--light" : "btn--dark"} plan__cta`}
                >
                  Замовити
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal as="p" className="pricing__note">
          Ціни вказані в доларах США. Точну вартість куратор підтвердить після брифу.
        </Reveal>
      </div>
    </section>
  );
}
