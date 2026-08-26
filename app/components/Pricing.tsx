import { TIERS } from "../pricing";
import PlanCard from "./PlanCard";
import Reveal from "./Reveal";

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <Reveal as="h2" className="h2 h2--dark">
          Вартість:
        </Reveal>
        <Reveal as="p" className="pricing__lead">
          Оберіть хронометраж — вартість перерахується разом із ціною за хвилину.
        </Reveal>

        <div className="pricing__grid">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <PlanCard tier={tier} />
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="pricing__note">
          Ціни вказані в доларах США. Точну вартість куратор підтвердить після брифу.
        </Reveal>
      </div>
    </section>
  );
}
