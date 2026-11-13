import Audience from "./Audience";
// СЕКЦІЯ ТИМЧАСОВО ПРИХОВАНА
// import CharacterStudio from "./CharacterStudio";
import Counter from "./Counter";
import Faq from "./Faq";
import FilmEdge from "./FilmEdge";
import { Icon, IconSprite } from "./Icons";
import ContactCta from "./ContactCta";
import OrderQuiz from "./OrderQuiz";
import Pricing from "./Pricing";
import Reveal from "./Reveal";
import ScrollToFormLink from "./ScrollToFormLink";
import StructuredData from "./StructuredData";
import ThemeStories from "./ThemeStories";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import LangSwitch from "./LangSwitch";
import OrderButton from "./OrderButton";
import VideoBox from "./VideoBox";
import { POSTER_WIDTH, videoPoster } from "./videoPoster";
import WhatsAppFloat from "./WhatsAppFloat";
import { getDictionary } from "../content/dictionaries";
import { langPath, type Lang } from "../content/lang";
import { buildFaq } from "../faq";
import { PHOTO_VIDEO_PATH, photoVideoContent } from "../content/ai-video-from-photos";
import { getDisplayCurrency } from "../location";

/* Тематики (папки «Работы Люм» на Drive клієнта) — єдиний блок робіт на
   сторінці. Для кожного ролика потрібні public/video/<slug>.mp4 і
   <slug>-poster.jpg. vertical — ролик 9:16. Тема без роликів на сторінці не
   показується. Порядок в «Історіях кохання» не випадковий: вертикальні
   рознесені, щоб у кладці вони потрапили в різні колонки. */
type ThemeId = "love" | "wedding" | "family" | "birthday" | "baby";
const THEMES: { id: ThemeId; videos: { slug: string; vertical?: boolean }[] }[] = [
  {
    id: "love",
    videos: [
      { slug: "theme-love-since-2016" },
      { slug: "theme-love-7-years" },
      { slug: "theme-love-summits" },
      { slug: "work-how-we-met" },
      { slug: "theme-love-30-years" },
      { slug: "work-anniversary" },
      { slug: "theme-love-distance", vertical: true },
      { slug: "theme-love-service-couple" },
      { slug: "work-for-my-beloved" },
      { slug: "theme-love-waiting-home" },
      { slug: "work-love-story" },
      { slug: "work-one-love", vertical: true },
    ],
  },
  {
    id: "wedding",
    videos: [{ slug: "theme-wedding-part-1" }, { slug: "theme-wedding-part-2" }],
  },
  { id: "family", videos: [{ slug: "theme-family-little-one" }] },
  {
    id: "birthday",
    videos: [{ slug: "theme-birthday-best-friends" }, { slug: "theme-birthday-game-hero" }],
  },
  { id: "baby", videos: [] },
];

/* Медіа для секцій. Текст (підписи, кроки, підписи цифр) — у content/dictionary. */
const REACTION_MEDIA: { src?: string; poster?: string }[] = [
  { src: "/video/reaction-one.mp4", poster: "/video/reaction-one-poster.jpg" },
  { src: "/video/reaction-two.mp4", poster: "/video/reaction-two-poster.jpg" },
  { src: "/video/reaction-three.mp4", poster: "/video/reaction-three-poster.jpg" },
  { src: "/video/reaction-four.mp4", poster: "/video/reaction-four-poster.jpg" },
];

const STEP_NUMS = ["01", "02", "03", "04"] as const;

/** Блок «Цифри» на основній сторінці приховано, доки клієнт не підтвердить
 *  реальні числа (ТЗ, пункти 4 і 9). На /demo він показаний — щоб клієнт
 *  подивився й вирішив. Підтвердили — true (і можна прибрати /demo). */
const SHOW_NUMBERS = false;

/** Розділи, яких зараз немає на сторінці: прибираємо їх і з меню, щоб
 *  пункт не вів у порожнечу. */
const HIDDEN_SECTIONS = ["studio"];

/**
 * Лендинг. Мову задає маршрут ("/" — українська, "/en" — англійська),
 * валюту — країна відвідувача, тож обидві версії можуть показувати
 * і гривні, і євро.
 */
export default async function Landing({ lang, demo = false }: { lang: Lang; demo?: boolean }) {
  const showNumbers = SHOW_NUMBERS || demo;
  const dict = getDictionary(lang);

  // Валюту задає мова: UA і RU — гривні, EN — євро.
  const currency = getDisplayCurrency(lang);

  const home = langPath("/", lang);
  const pricingHref = `${home}#pricing`;

  const reactions = dict.reactions.captions.map((caption, i) => ({
    caption,
    ...REACTION_MEDIA[i],
  }));

  const numbers = [
    { to: 1000, suffix: "+", label: dict.numbers.labels[0] },
    { to: 1000, suffix: "+", label: dict.numbers.labels[1] },
    { text: dict.numbers.response, label: dict.numbers.labels[2] },
    { text: dict.numbers.delivery, label: dict.numbers.labels[3] },
  ] as const;

  return (
    <>
      <StructuredData lang={lang} />
      <IconSprite />
      <SiteNav
        items={dict.common.nav.filter(
          (item) =>
            !HIDDEN_SECTIONS.includes(item.id) &&
            (item.id !== "themes" || THEMES.some((t) => t.videos.length > 0)),
        )}
        cta={dict.common.navCta}
        lang={lang}
      />

      {/* ============ HERO ============ */}
      <header className="hero" id="top">
        <div className="container hero__inner">
          <Reveal className="hero__left">
            <div className="hero__top">
              <ScrollToFormLink href={pricingHref} className="logo" aria-label="LUME">
                <span className="logo__text">LUME</span>
              </ScrollToFormLink>
              {/* панель навігації зʼявляється лише нижче першого екрана,
                  тож перемикач мови потрібен і тут */}
              <LangSwitch lang={lang} />
            </div>
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
            <div className="hero__cta">
              <OrderButton className="btn btn--dark">{dict.common.orderCta}</OrderButton>
            </div>
          </Reveal>

          <Reveal className="hero__right" delay={1}>
            <span className="script-badge">
              Personal
              <br />
              Stories
            </span>
            <VideoBox
              src="/video/hero.mp4"
              poster={videoPoster("/video/hero-poster.jpg", POSTER_WIDTH.hero)}
              variant="wide"
              labels={dict.video}
            />
          </Reveal>
        </div>
      </header>

      {/* ============ ТАРИФИ ============ */}
      <Pricing dict={dict} currency={currency} lang={lang} />

      {/* ============ СТУДІЯ ПЕРСОНАЖІВ ============ */}
      {/* СЕКЦІЯ ТИМЧАСОВО ПРИХОВАНА: повернути — розкоментувати блок нижче
          і прибрати "studio" з HIDDEN_SECTIONS. Код, маршрут /api/character
          і тексти лишаються на місці. */}
      {/*
      <section className="studio-sec" id="studio">
        <div className="container">
          <Reveal>
            <CharacterStudio copy={dict.studio} />
          </Reveal>
        </div>
      </section>
      */}

      {/* ============ ТЕМАТИКИ ============ */}
      <ThemeStories
        themes={THEMES.filter((t) => t.videos.length > 0).map((t) => ({
          id: t.id,
          ...dict.themes.items[t.id],
          videos: t.videos.map(({ slug, vertical }) => ({
            src: `/video/${slug}.mp4`,
            poster: videoPoster(
              `/video/${slug}-poster.jpg`,
              vertical ? POSTER_WIDTH.vertical : POSTER_WIDTH.wide,
            ),
            vertical,
          })),
        }))}
        heading={dict.themes.heading}
        lead={dict.themes.lead}
        order={dict.themes.order}
        tabsAria={dict.themes.tabsAria}
        videoLabels={dict.video}
        // Посилання на сторінку-кейс раніше стояло під «Нашими роботами».
        caseLink={{ href: langPath(PHOTO_VIDEO_PATH, lang), label: photoVideoContent[lang].caseLink }}
      />

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
                  poster={r.poster && videoPoster(r.poster, POSTER_WIDTH.vertical)}
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
            <OrderButton className="btn btn--light">{dict.common.orderCta}</OrderButton>
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

      {/* ============ ЦИФРИ ============ */}
      {showNumbers ? (
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
      ) : null}

      {/* ============ КОМУ ПІДІЙДЕ ============ */}
      <Audience dict={dict} lang={lang} />

      {/* ============ FAQ ============ */}
      <section className="faq section--dark" id="faq">
        <div className="container container--narrow">
          <Reveal as="h2" className="h2 h2--sm">
            {dict.faq.heading}
          </Reveal>
          <Reveal>
            <Faq items={buildFaq(currency, lang)} />
          </Reveal>
        </div>
      </section>

      {/* ============ ЗВʼЯЗОК ============ */}
      <section className="formsec" id="form">
        <div className="container container--form">
          <Reveal>
            <ContactCta dict={dict.form} orderLabel={dict.common.orderCta} lang={lang} />
          </Reveal>
        </div>
      </section>

      <SiteFooter dict={dict} lang={lang} />
      <WhatsAppFloat labels={dict.floats} />
      <OrderQuiz copy={dict.quiz} pricing={dict.pricing} currency={currency} lang={lang} />
    </>
  );
}
