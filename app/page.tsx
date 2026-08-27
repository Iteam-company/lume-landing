import Link from "next/link";
import Audience from "./components/Audience";
import Counter from "./components/Counter";
import Faq from "./components/Faq";
import FilmEdge from "./components/FilmEdge";
import { Icon, IconSprite } from "./components/Icons";
import OrderForm from "./components/OrderForm";
import Pricing from "./components/Pricing";
import Reveal from "./components/Reveal";
import StructuredData from "./components/StructuredData";
import SiteFooter from "./components/SiteFooter";
import VideoBox from "./components/VideoBox";
import WhatsAppFloat from "./components/WhatsAppFloat";

/* Щоб додати відео — покладіть файл у public/video/
   і впишіть шлях, напр. src="/video/work-1.mp4" */

const REACTIONS = [
  { caption: "Любов" },
  { caption: "День народження" },
  { caption: "День народження" },
  { caption: "Гендер паті" },
] as const;

const STEPS = [
  {
    num: "01",
    title: ["Бриф"],
    text: "Ви проходите коротке опитування: розповідаєте історію, ділитеся деталями та важливими моментами",
    dot: true,
  },
  {
    num: "02",
    title: ["Фото та", "персонажі"],
    text: "Ви надсилаєте фотографії — ми малюємо персонажів, максимально схожих на вас",
  },
  {
    num: "03",
    title: ["Сценарій і", "розкадровка"],
    text: "Опрацьовуємо сюжет, ритм і драматургію — щоб історія виглядала цілісно та зворушливо",
  },
  {
    num: "04",
    title: ["Монтаж і", "мультфільм"],
    text: "Поєднуємо все разом: рухи, ефекти, атмосферу. За бажанням — озвучення або ваша улюблена пісня",
  },
] as const;

const NUMBERS = [
  { to: 200, suffix: "+", label: "створених мультфільмів" },
  { to: 100, suffix: "+", label: "щасливих клієнтів" },
  { text: "15 хв", label: "відповідь куратора" },
  { text: "1 день", label: "термін виготовлення" },
] as const;

export default function Home() {
  return (
    <>
      <StructuredData />
      <IconSprite />

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="container hero__inner">
          <Reveal className="hero__left">
            <Link href="/#form" className="logo" aria-label="LUME">
              <span className="logo__text">LUME</span>
            </Link>
            <h1 className="hero__title">
              Подаруй близькій людині
              <br />
              мультфільм
              <br />
              за вашою історією
            </h1>
            <p className="hero__sub">Для пар, батьків, дітей, друзів і близьких</p>
            <ul className="hero__bullets">
              <li>
                <Icon name="i-star" className="star" />
                200+ створених мультфільмів
              </li>
              <li>
                <Icon name="i-star" className="star" />
                Термін створення — 1 день
              </li>
              <li>
                <Icon name="i-star" className="star" />
                Особистий куратор
              </li>
            </ul>
            <Link href="/#form" className="btn btn--dark">
              Замовити мультфільм
            </Link>
          </Reveal>

          <Reveal className="hero__right" delay={1}>
            <span className="script-badge">
              Personal
              <br />
              Stories
            </span>
            <VideoBox src="/video/hero.mp4" poster="/video/hero-poster.jpg" variant="wide" />
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
            <h2 className="h2">Наші роботи</h2>
          </Reveal>

          <div className="works__grid">
            <Reveal>
              <VideoBox variant="16x9" />
            </Reveal>
            <Icon name="i-star" className="star star--sep" />
            <Reveal delay={1}>
              <VideoBox variant="16x9" />
            </Reveal>
            <Icon name="i-star" className="star star--sep" />
            <Reveal delay={2}>
              <VideoBox variant="16x9" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ РЕАКЦІЇ КЛІЄНТІВ ============ */}
      <section className="reactions" id="reactions">
        <div className="container">
          <Reveal as="h2" className="h2 h2--dark">
            Реакції клієнтів:
          </Reveal>
          <div className="reactions__grid">
            {REACTIONS.map((r, i) => (
              <Reveal
                key={`${r.caption}-${i}`}
                as="figure"
                className="reaction"
                delay={(i % 4) as 0 | 1 | 2 | 3}
              >
                <VideoBox variant="9x16" />
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
              Мультфільм за <span className="script script--xl">1 день</span>
            </h2>
            <Link href="/#form" className="btn btn--light">
              Замовити мультфільм
            </Link>
          </Reveal>

          <div className="process__track">
            <div className="arch arch--1" aria-hidden="true" />
            <div className="arch arch--2" aria-hidden="true" />
            <div className="arch arch--3" aria-hidden="true" />
            <span className="arch-tail" aria-hidden="true" />

            {STEPS.map((step, i) => (
              <Reveal
                key={step.num}
                as="article"
                className={`step step--${i % 2 === 0 ? "up" : "down"}`}
                delay={i as 0 | 1 | 2 | 3}
              >
                <span className="step__num">{step.num}</span>
                <h3 className="script step__title">
                  {step.title.map((line, k) => (
                    <span key={line}>
                      {line}
                      {k < step.title.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h3>
                <p>
                  {"dot" in step && step.dot ? <span className="dot" /> : null}
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ТАРИФИ ============ */}
      <Pricing />

      {/* ============ ЦИФРИ ============ */}
      <section className="numbers" id="numbers">
        <div className="container">
          <Reveal as="h2" className="h2 h2--dark">
            Цифри:
          </Reveal>
          <div className="numbers__grid">
            {NUMBERS.map((n, i) => (
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
      <Audience />

      {/* ============ FAQ ============ */}
      <section className="faq section--dark" id="faq">
        <div className="container container--narrow">
          <Reveal as="h2" className="h2 h2--sm">
            FAQ:
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* ============ ФОРМА ============ */}
      <section className="formsec" id="form">
        <div className="container container--form">
          <Reveal>
            <OrderForm />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
