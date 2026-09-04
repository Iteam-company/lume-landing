import type { Dictionary } from "../content/dictionary";
import Reveal from "./Reveal";

/* Текстовий блок під пошукові запити: описує приводи, аудиторію
   та географію звичайною мовою — це те, що читають і люди,
   і AI-асистенти, коли добирають, що порадити. */

export default function Audience({ dict }: { dict: Dictionary }) {
  const a = dict.audience;
  const cities = a.cities.join(", ");
  const [citiesBefore, citiesAfter] = a.citiesParagraph.split("{cities}");

  return (
    <section className="audience" id="audience">
      <div className="container">
        <Reveal as="h2" className="h2 h2--dark">
          {a.heading}
        </Reveal>

        <div className="audience__grid">
          <Reveal className="audience__text">
            <p className="audience__lead">{a.lead}</p>
            {a.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              {citiesBefore}
              {cities}
              {citiesAfter}
            </p>
          </Reveal>

          <Reveal className="audience__cards" delay={1}>
            {a.forWhom.map(({ who, what }) => (
              <div className="who" key={who}>
                <h3 className="who__title">{who}</h3>
                <p className="who__text">{what}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="audience__occasions" delay={2}>
          <h3 className="audience__sub">{a.occasionsHeading}</h3>
          <ul className="chips">
            {a.occasions.map((item) => (
              <li className="chip" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
