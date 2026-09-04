import { Suspense } from "react";
import Link from "next/link";
import Audience from "./components/Audience";
import Counter from "./components/Counter";
import Faq from "./components/Faq";
import FilmEdge from "./components/FilmEdge";
import { Icon, IconSprite } from "./components/Icons";
import OrderForm from "./components/OrderForm";
import PaddleProvider from "./components/PaddleProvider";
// ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: секцію вимкнено. Повернути — розкоментувати імпорт і рендер нижче.
// import Pricing from "./components/Pricing";
import Reveal from "./components/Reveal";
import StructuredData from "./components/StructuredData";
import SiteFooter from "./components/SiteFooter";
import VideoBox from "./components/VideoBox";
import WhatsAppFloat from "./components/WhatsAppFloat";
import dict from "./content/dictionary";
import { buildFaq } from "./faq";
import { getVisitorLocation } from "./location";

/* Медіа для секцій. Текст (підписи, кроки, підписи цифр) — у content/dictionary. */
const REACTION_MEDIA: { src?: string; poster?: string }[] = [
  { src: "/video/reaction-one.mp4", poster: "/video/reaction-one-poster.jpg" },
  { src: "/video/reaction-two.mp4", poster: "/video/reaction-two-poster.jpg" },
  { src: "/video/reaction-three.mp4", poster: "/video/reaction-three-poster.jpg" },
  { src: "/video/reaction-four.mp4", poster: "/video/reaction-four-poster.jpg" },
];

const STEP_NUMS = ["01", "02", "03", "04"] as const;

// ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: якоря #pricing на сторінці немає, тож кнопки ведуть на форму.
const pricingHref = "/#form";

export default async function Home() {
  // Мова сайту завжди українська. Валюта — від Geo відвідувача
  // (Location Observer): UA → UAH, решта країн і fallback → USD.
  // headers() усередині робить цю сторінку динамічною (SSR на кожен
  // запит) — свідомий компроміс заради ціни без "флешу" валюти.
  const { currency } = await getVisitorLocation();

  const reactions = dict.reactions.captions.map((caption, i) => ({
    caption,
    ...REACTION_MEDIA[i],
  }));

  const numbers = [
    { to: 200, suffix: "+", label: dict.numbers.labels[0] },
    { to: 100, suffix: "+", label: dict.numbers.labels[1] },
    { text: dict.numbers.response, label: dict.numbers.labels[2] },
    { text: dict.numbers.delivery, label: dict.numbers.labels[3] },
  ] as const;

  return (
    <>
      <StructuredData />
      <IconSprite />

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="container hero__inner">
          <Reveal className="hero__left">
            <Link href={pricingHref} className="logo" aria-label="LUME">
              <span className="logo__text">LUME</span>
            </Link>
            <h1 className="hero__title">
              {dict.hero.titleLines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < dict.hero.titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className="hero__sub">{dict.hero.sub}</p>
            <ul className="hero__bullets">
              {dict.hero.bullets.map((bullet) => (
                <li key={bullet}>
                  <Icon name="i-star" className="star" />
                  {bullet}
                </li>
              ))}
            </ul>
            <Link href={pricingHref} className="btn btn--dark">
              {dict.common.orderCta}
            </Link>
          </Reveal>

          <Reveal className="hero__right" delay={1}>
            <span className="script-badge">
              Personal
              <br />
              Stories
            </span>
            <VideoBox
              src="/video/hero.mp4"
              poster="/video/hero-poster.jpg"
              variant="wide"
              labels={dict.video}
            />
          </Reveal>
        </div>
      </header>

      {/* ============ НАШІ РОБОТИ ============ */}
      <section className="works section--dark" id="works">
        <FilmEdge side="top" />
        <FilmEdge side="bottom" />
        <div className="container">
          <Reveal className="works__head">
            <svg className="heart-doodle" viewBox="0 0 220 90" fill="none" aria-hidden="true">
              <path
                d="M62 46c-14 14-31 3-31-12C31 22 41 14 52 16c8 1.5 12 8 12 15 0 14-13 26-27 33 44 14 106 13 160-1"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M62 46c9-9 18-19 18-29 0-8-6-13-13-12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <h2 className="h2">{dict.works.heading}</h2>
          </Reveal>

          <div className="works__grid">
            <Reveal>
              <VideoBox
                variant="16x9"
                src="/video/work-example-one.mp4"
                poster="/video/work-example-one-poster.jpg"
                labels={dict.video}
              />
            </Reveal>
            <Icon name="i-star" className="star star--sep" />
            <Reveal delay={1}>
              <VideoBox
                variant="16x9"
                src="/video/work-example-two.mp4"
                poster="/video/work-example-two-poster.jpg"
                labels={dict.video}
              />
            </Reveal>
            <Icon name="i-star" className="star star--sep" />
            <Reveal delay={2}>
              <VideoBox
                variant="16x9"
                src="/video/work-example-three.mp4"
                poster="/video/work-example-three-poster.jpg"
                labels={dict.video}
              />
            </Reveal>
            <Reveal>
              <VideoBox
                variant="16x9"
                src="/video/work-example-four.mp4"
                poster="/video/work-example-four-poster.jpg"
                labels={dict.video}
              />
            </Reveal>
            <Icon name="i-star" className="star star--sep" />
            <Reveal delay={1}>
              <VideoBox
                variant="16x9"
                src="/video/work-example-five.mp4"
                poster="/video/work-example-five-poster.jpg"
                labels={dict.video}
              />
            </Reveal>
            <Icon name="i-star" className="star star--sep" />
            <Reveal delay={2}>
              <VideoBox
                variant="16x9"
                src="/video/work-example-six.mp4"
                poster="/video/work-example-six-poster.jpg"
                labels={dict.video}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ РЕАКЦІЇ КЛІЄНТІВ ============ */}
      <section className="reactions" id="reactions">
        <div className="container">
          <Reveal as="h2" className="h2 h2--dark">
            {dict.reactions.heading}
          </Reveal>
          <div className="reactions__grid">
            {reactions.map((r, i) => (
              <Reveal
                key={`${r.caption}-${i}`}
                as="figure"
                className="reaction"
                delay={(i % 4) as 0 | 1 | 2 | 3}
              >
                <VideoBox
                  variant="9x16"
                  src={r.src}
                  poster={r.poster}
                  labels={dict.video}
                />
                <figcaption className="script">{r.caption}</figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ПРОЦЕС ============ */}
      <section className="process section--dark" id="process">
        <FilmEdge side="top" speed={0.5} />
        <FilmEdge side="bottom" speed={0.5} />
        <div className="container">
          <Reveal className="process__head">
            <h2 className="h2 h2--left">
              {dict.process.headingPrefix}
              <span className="script script--xl">{dict.process.headingAccent}</span>
            </h2>
            <Link href={pricingHref} className="btn btn--light">
              {dict.common.orderCta}
            </Link>
          </Reveal>

          <div className="process__track">
            <div className="arch arch--1" aria-hidden="true" />
            <div className="arch arch--2" aria-hidden="true" />
            <div className="arch arch--3" aria-hidden="true" />
            <span className="arch-tail" aria-hidden="true" />

            {dict.process.steps.map((step, i) => (
              <Reveal
                key={STEP_NUMS[i]}
                as="article"
                className={`step step--${i % 2 === 0 ? "up" : "down"}`}
                delay={i as 0 | 1 | 2 | 3}
              >
                <span className="step__num">{STEP_NUMS[i]}</span>
                <h3 className="script step__title">
                  {step.title.map((line, k) => (
                    <span key={line}>
                      {line}
                      {k < step.title.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h3>
                <p>
                  {i === 0 ? <span className="dot" /> : null}
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ТАРИФИ ============ */}
      {/* ЦІНИ ТИМЧАСОВО ПРИХОВАНІ */}
      {/* <Pricing dict={dict} currency={currency} /> */}

      {/* ============ ЦИФРИ ============ */}
      <section className="numbers" id="numbers">
        <div className="container">
          <Reveal as="h2" className="h2 h2--dark">
            {dict.numbers.heading}
          </Reveal>
          <div className="numbers__grid">
            {numbers.map((n, i) => (
              <Reveal key={n.label} className="num" delay={i as 0 | 1 | 2 | 3}>
                <Icon name="i-star" className="star star--num" />
                {"to" in n ? (
                  <Counter to={n.to} suffix={n.suffix} />
                ) : (
                  <span className="num__val">{n.text}</span>
                )}
                <span className="num__label script">{n.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ КОМУ ПІДІЙДЕ ============ */}
      <Audience dict={dict} />

      {/* ============ FAQ ============ */}
      <section className="faq section--dark" id="faq">
        <div className="container container--narrow">
          <Reveal as="h2" className="h2 h2--sm">
            {dict.faq.heading}
          </Reveal>
          <Reveal>
            <Faq items={buildFaq(currency)} />
          </Reveal>
        </div>
      </section>

      {/* ============ ФОРМА ============ */}
      <section className="formsec" id="form">
        <div className="container container--form">
          <Reveal>
            <PaddleProvider>
              <Suspense fallback={null}>
                <OrderForm dict={dict.form} currency={currency} />
              </Suspense>
            </PaddleProvider>
          </Reveal>
        </div>
      </section>

      <SiteFooter dict={dict} />
      <WhatsAppFloat labels={dict.floats} />
    </>
  );
}
