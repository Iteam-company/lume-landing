import { TIERS } from "../pricing";
import type { Dictionary } from "../i18n/dictionaries";
import type { Locale } from "../i18n/config";
import PlanCard from "./PlanCard";
import Reveal from "./Reveal";

export default function Pricing({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: Locale;
}) {
  const p = dict.pricing;

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <Reveal as="h2" className="h2 h2--dark">
          {p.heading}
        </Reveal>
        <Reveal as="p" className="pricing__lead">
          {p.lead}
        </Reveal>

        <div className="pricing__grid">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.slug} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <PlanCard
                tier={tier}
                lang={lang}
                copy={p.tiers[tier.slug]}
                labels={{
                  perMinute: p.perMinute,
                  minutesShort: p.minutesShort,
                  durationAria: p.durationAria,
                  launchNote: p.launchNote,
                  songAdd: p.songAdd,
                  songIncluded: p.songIncluded,
                  order: p.orderCard,
                }}
              />
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="pricing__common">
          {p.commonPrefix}
          {p.common.join(" · ")}
        </Reveal>
        <Reveal as="p" className="pricing__note">
          {p.noteCurrency} {p.noteConfirm}
        </Reveal>
      </div>
    </section>
  );
}
