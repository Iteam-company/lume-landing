import Link from "next/link";
import { TELEGRAM_LINK, WHATSAPP_LINK } from "../config";
import {
  PHOTO_VIDEO_PATH,
  photoVideoContent,
  photoVideoFaq,
  type PhotoVideoLang,
} from "../content/ai-video-from-photos";
import { getDictionary } from "../content/dictionaries";
import { langPath } from "../content/lang";
import { getVisitorLocation } from "../location";
import ChatLink from "./ChatLink";
import ContactCta from "./ContactCta";
import Faq from "./Faq";
import FilmEdge from "./FilmEdge";
import { IconSprite } from "./Icons";
import LangSwitch from "./LangSwitch";
import Pricing from "./Pricing";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import StructuredData from "./StructuredData";
import VideoBox from "./VideoBox";
import WhatsAppFloat from "./WhatsAppFloat";
import styles from "./PhotoVideoLanding.module.css";

// Добірка з наявного портфоліо головної. Усі файли вже є в public/video.
const EXAMPLES = ["work-love-story", "work-how-we-met", "work-birthday-surprise"];

export default async function PhotoVideoLanding({ lang }: { lang: PhotoVideoLang }) {
  const dict = getDictionary(lang);
  const copy = photoVideoContent[lang];
  const faq = photoVideoFaq(lang);
  const { currency } = await getVisitorLocation();
  const nav = dict.common.nav.filter(({ id }) => ["works", "process", "audience", "pricing", "faq"].includes(id));

  return (
    <>
      <StructuredData lang={lang} page={{ path: PHOTO_VIDEO_PATH, ...copy.meta, faq }} />
      <IconSprite />
      <SiteNav items={nav} cta={dict.common.navCta} lang={lang} />
      <main>
        <header className="hero" id="top">
          <div className="container hero__inner">
            <div className="hero__left">
              <div className="hero__top">
                <Link href={langPath("/", lang)} className="logo" aria-label={dict.legal.back}>
                  <span className="logo__text">LUME</span>
                </Link>
                <LangSwitch lang={lang} />
              </div>
              <h1 className={`hero__title ${styles.heroTitle}`}>{copy.heading}</h1>
              <p className={styles.lead}>{copy.lead}</p>
              <p className={styles.note}>{copy.handsOff}</p>
              <ul className={`chips ${styles.highlights}`}>
                {dict.pricing.common.map((item) => <li className="chip" key={item}>{item}</li>)}
              </ul>
              <div className={`hero__cta ${styles.heroActions}`}>
                <ChatLink href={TELEGRAM_LINK} channel="Telegram" className="btn btn--dark">{copy.order}</ChatLink>
                <ChatLink href={WHATSAPP_LINK} channel="WhatsApp" className="hero__cta-alt">{dict.common.orderCtaAlt}</ChatLink>
              </div>
            </div>
            <div className="hero__right">
              <VideoBox src="/video/hero.mp4" poster="/video/hero-poster.jpg" variant="wide" labels={dict.video} />
            </div>
          </div>
        </header>

        <section className="works section--dark" id="works">
          <FilmEdge side="top" />
          <FilmEdge side="bottom" />
          <div className="container">
            <Reveal className="works__head">
              <h2 className="h2">{copy.worksHeading}</h2>
            </Reveal>
            <p className={styles.lead}>{copy.worksLead}</p>
            <div className="works__grid">
              {EXAMPLES.map((slug, i) => (
                <Reveal as="figure" key={slug} className={styles.figure}>
                  <VideoBox src={`/video/${slug}.mp4`} poster={`/video/${slug}-poster.jpg`} variant="16x9" labels={dict.video} />
                  <figcaption className={styles.caption}>{copy.example} · {String(i + 1).padStart(2, "0")}</figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="process" id="process">
          <div className="container">
            <Reveal as="h2" className="h2 h2--dark">{copy.processHeading}</Reveal>
            <ol className={styles.steps}>
              {copy.steps.map((step, i) => (
                <li className="who" key={step.title}>
                  <span className={styles.stepNumber} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="who__title">{step.title}</h3>
                  <p className="who__text">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`audience ${styles.service}`} id="service">
          <div className="container container--narrow">
            <Reveal as="h2" className="h2 h2--dark">{copy.serviceHeading}</Reveal>
            <p className={styles.lead}>{copy.serviceText}</p>
            <p className={styles.note}>{copy.serviceNote}</p>
          </div>
        </section>

        <section className="audience" id="audience">
          <div className="container container--narrow">
            <Reveal as="h2" className="h2 h2--dark">{copy.occasionsHeading}</Reveal>
            <p className={styles.lead}>{copy.occasionsLead}</p>
            <ul className="chips">
              {dict.audience.occasions.map((occasion) => <li className="chip" key={occasion}>{occasion}</li>)}
            </ul>
          </div>
        </section>

        <Pricing dict={dict} currency={currency} lang={lang} />

        <section className="faq section--dark" id="faq">
          <div className="container container--narrow">
            <Reveal as="h2" className="h2 h2--sm">{dict.faq.heading}</Reveal>
            <Faq items={faq} />
          </div>
        </section>

        <section className="formsec" id="form">
          <div className={`container container--form ${styles.contactContainer}`}>
            <ContactCta dict={dict.form} lang={lang} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} lang={lang} />
      <WhatsAppFloat labels={dict.floats} />
    </>
  );
}
