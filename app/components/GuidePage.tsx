import Image from "next/image";
import Link from "next/link";
import { TELEGRAM_LINK, WHATSAPP_LINK } from "../config";
import { GUIDE_PATH, guideContent, type GuideLang } from "../content/cartoon-guide";
import { PHOTO_VIDEO_PATH } from "../content/ai-video-from-photos";
import { getDictionary } from "../content/dictionaries";
import { formatPrice } from "../content/format";
import { langPath } from "../content/lang";
import { getVisitorLocation } from "../location";
import { bestPerMinute, TIERS } from "../pricing";
import ChatLink from "./ChatLink";
import ContactCta from "./ContactCta";
import Faq from "./Faq";
import { IconSprite } from "./Icons";
import LangSwitch from "./LangSwitch";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import StructuredData from "./StructuredData";
import WhatsAppFloat from "./WhatsAppFloat";
import styles from "./GuidePage.module.css";

/** Та сама композиція «фото → мультфільм», що й у прев'ю кейсу. */
const HERO_IMAGE = { src: "/video/pipeline-page/og-case.jpg", w: 1200, h: 630 };

/**
 * Гайд «Як зробити мультфільм з фото»: пряма відповідь на запит,
 * два способи, порівняння й посилання на реальний кейс.
 */
export default async function GuidePage({ lang }: { lang: GuideLang }) {
  const dict = getDictionary(lang);
  const copy = guideContent[lang];
  const { currency } = await getVisitorLocation();
  const priceFrom = formatPrice(Math.min(...TIERS.map((tier) => bestPerMinute(tier, currency))), currency, lang);
  const { lume, self } = copy.ways;

  return (
    <>
      <StructuredData
        lang={lang}
        page={{ path: GUIDE_PATH, ...copy.meta, faq: copy.faq, breadcrumb: copy.breadcrumb }}
      />
      <IconSprite />
      <SiteNav items={copy.nav} cta={dict.common.navCta} lang={lang} />
      <main className={styles.page}>
        {/* ============ HERO: коротка відповідь ============ */}
        <header className={`hero ${styles.hero}`} id="top">
          <div className={`container ${styles.heroInner}`}>
            <Reveal>
              <div className="hero__top">
                <Link href={langPath("/", lang)} className="logo" aria-label={dict.legal.back}>
                  <span className="logo__text">LUME</span>
                </Link>
                <LangSwitch lang={lang} />
              </div>
              <p className={`script ${styles.kicker}`}>{copy.hero.kicker}</p>
              <h1 className={styles.title}>{copy.heading}</h1>
              <p className={styles.answer}>{copy.hero.answer}</p>
              <p className={styles.about}>{copy.hero.about}</p>
              <div className="hero__cta">
                <ChatLink href={TELEGRAM_LINK} channel="Telegram" className="btn btn--dark">{copy.hero.order}</ChatLink>
                <ChatLink href={WHATSAPP_LINK} channel="WhatsApp" className="hero__cta-alt">{dict.common.orderCtaAlt}</ChatLink>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <Link href={langPath(PHOTO_VIDEO_PATH, lang)} className={styles.heroImage}>
                <Image
                  src={HERO_IMAGE.src}
                  width={HERO_IMAGE.w}
                  height={HERO_IMAGE.h}
                  alt={copy.hero.imageAlt}
                  sizes="(max-width: 960px) 100vw, 600px"
                  preload
                />
              </Link>
            </Reveal>
          </div>
        </header>

        {/* ============ ДВА СПОСОБИ ============ */}
        <section className={styles.ways} id="ways">
          <div className="container">
            <Reveal as="h2" className={`h2 h2--dark ${styles.h2}`}>{copy.ways.heading}</Reveal>
            <div className={styles.wayGrid}>
              <Reveal as="article" className={styles.waySelf}>
                <h3>{self.title}</h3>
                <ol>{self.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                <p className={styles.fit}>{self.fit}</p>
              </Reveal>
              <Reveal as="article" className={styles.wayLume} delay={1}>
                <h3>{lume.title}</h3>
                <ol>{lume.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                <p className={styles.fit}>{lume.fit}</p>
                <div className={styles.price}>
                  <p>
                    <span>{lume.priceFrom}</span> <strong>{priceFrom}</strong> <span>{lume.perMinute}</span>
                  </p>
                  <Link href={`${langPath("/", lang)}#pricing`} className="btn btn--light">{lume.pricingLink}</Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ ПОРІВНЯННЯ ============ */}
        <section className={styles.compare} id="compare">
          <div className="container">
            <Reveal as="h2" className={`h2 h2--dark ${styles.h2}`}>{copy.compare.heading}</Reveal>
            <Reveal>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <td />
                    <th scope="col">{copy.compare.columns[0]}</th>
                    <th scope="col">{copy.compare.columns[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.compare.rows.map(([label, selfCell, lumeCell]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td data-label={copy.compare.columns[0]}>{selfCell}</td>
                      <td data-label={copy.compare.columns[1]} className={styles.lumeCell}>{lumeCell}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        {/* ============ ЯКІ ФОТО ПІДІЙДУТЬ + КЕЙС ============ */}
        <section className={styles.photos} id="photos">
          <div className={`container ${styles.photosInner}`}>
            <Reveal>
              <h2 className={`h2 h2--dark ${styles.h2}`}>{copy.photos.heading}</h2>
              <ul className={styles.photoList}>
                {copy.photos.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
            <Reveal delay={1}>
              <Link href={langPath(PHOTO_VIDEO_PATH, lang)} className={styles.caseCard}>
                <Image src={HERO_IMAGE.src} width={HERO_IMAGE.w} height={HERO_IMAGE.h} alt="" sizes="(max-width: 960px) 100vw, 520px" />
                <span className={styles.caseBody}>
                  <span className={`script ${styles.caseTitle}`}>{copy.photos.caseTitle}</span>
                  <span>{copy.photos.caseText}</span>
                  <span className={styles.caseLink}>{copy.photos.caseLink}</span>
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="faq section--dark" id="faq">
          <div className="container container--narrow">
            <Reveal as="h2" className="h2 h2--sm">{copy.faqHeading}</Reveal>
            <Faq items={copy.faq} />
          </div>
        </section>

        <section className="formsec" id="form">
          <div className="container container--form">
            <ContactCta dict={dict.form} lang={lang} />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} lang={lang} />
      <WhatsAppFloat labels={dict.floats} />
    </>
  );
}
