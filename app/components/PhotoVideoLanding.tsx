import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { TELEGRAM_LINK, WHATSAPP_LINK } from "../config";
import {
  PHOTO_VIDEO_PATH,
  photoVideoContent,
  photoVideoFaq,
  type PhotoVideoLang,
} from "../content/ai-video-from-photos";
import { getDictionary } from "../content/dictionaries";
import { formatPrice } from "../content/format";
import { langPath } from "../content/lang";
import { getVisitorLocation } from "../location";
import { bestPerMinute, TIERS } from "../pricing";
import ChatLink from "./ChatLink";
import ContactCta from "./ContactCta";
import Faq from "./Faq";
import FilmEdge from "./FilmEdge";
import { IconSprite } from "./Icons";
import LangSwitch from "./LangSwitch";
import LoopVideo from "./LoopVideo";
import Reveal from "./Reveal";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import StructuredData, { type PageVideo } from "./StructuredData";
import VideoBox from "./VideoBox";
import WhatsAppFloat from "./WhatsAppFloat";
import styles from "./PhotoVideoLanding.module.css";

/* ============================================================
   Медіа реального кейсу. Web-версії лежать у public/video/pipeline-page,
   важкі оригінали — у media-src/ (поза репозиторієм).
   Готовий фільм — той самий work-long-distance.mp4, що й у портфоліо
   головної: окрему копію не тримаємо.
   ============================================================ */
const CASE = "/video/pipeline-page";

type Img = { src: string; w: number; h: number };
const img = (name: string, w: number, h: number): Img => ({ src: `${CASE}/${name}.jpg`, w, h });
const character = (n: number) => img(`character-${n}`, n === 8 ? 400 : 448, 1008);
const still = (name: string) => img(name, 720, 1280);

/**
 * Постер для <video>. Атрибут poster браузер качає одразу, навіть для
 * роликів далеко внизу, тож віддаємо його через оптимізатор next/image
 * (WebP, ~640px) замість вихідного JPEG.
 */
const poster = (name: string) =>
  getImageProps({ src: `${CASE}/${name}.jpg`, alt: "", width: 320, height: 569 }).props.src;

const MEDIA = {
  hero: { photo: img("photo-real-5", 900, 1350), cartoon: still("film-evening") },
  // Сам момент «освідчення → сцена» показано окремим блоком із відео,
  // тож тут лише чотири опорні кадри.
  story: [img("photo-real-1", 900, 1200), character(6), still("film-proposal"), still("reaction-poster")],
  pairs: [
    { photo: img("photo-real-2", 900, 1200), characters: [character(10), character(9)], scene: still("film-home") },
    { photo: img("photo-real-4", 900, 1200), characters: [character(3), character(4)], scene: still("film-walk") },
    { photo: img("photo-real-7", 555, 793), characters: [character(8)], scene: still("film-dog") },
  ],
  sheet: img("sheet-3", 1600, 900),
  moment: {
    real: { src: `${CASE}/moment-real.mp4`, poster: poster("moment-real-poster") },
    cartoon: { src: `${CASE}/moment-ai.mp4`, poster: poster("moment-ai-poster") },
  },
  // Постер — кадр із самою парою: портфоліо-постер (келихи) тут нічого не каже.
  film: { src: "/video/work-long-distance.mp4", poster: poster("film-proposal") },
  reaction: { src: `${CASE}/reaction.mp4`, poster: poster("reaction-poster") },
};


/**
 * VideoObject для фільму й реакції. uploadDate — коли ролик з'явився на сайті:
 * фільм — у портфоліо з 2026-10-05, реакція — разом із цією сторінкою.
 * Короткі кліпи-петлі в блоці «момент → сцена» не розмічаємо: це фрагменти.
 */
const CASE_VIDEOS = (copy: (typeof photoVideoContent)[PhotoVideoLang]): PageVideo[] => [
  {
    id: "film",
    ...copy.schema.film,
    thumbnail: `${CASE}/film-proposal.jpg`,
    contentUrl: MEDIA.film.src,
    duration: "PT2M34S",
    uploadDate: "2026-10-05",
  },
  {
    id: "reaction",
    ...copy.schema.reaction,
    thumbnail: `${CASE}/reaction-poster.jpg`,
    contentUrl: MEDIA.reaction.src,
    duration: "PT25S",
    uploadDate: "2026-10-09",
  },
];

export default async function PhotoVideoLanding({ lang }: { lang: PhotoVideoLang }) {
  const dict = getDictionary(lang);
  const copy = photoVideoContent[lang];
  const faq = photoVideoFaq(lang);
  const { currency } = await getVisitorLocation();
  const priceFrom = formatPrice(Math.min(...TIERS.map((tier) => bestPerMinute(tier, currency))), currency, lang);

  return (
    <>
      <StructuredData
        lang={lang}
        page={{ path: PHOTO_VIDEO_PATH, ...copy.meta, faq, breadcrumb: copy.schema.breadcrumb, videos: CASE_VIDEOS(copy) }}
      />
      <IconSprite />
      <SiteNav items={copy.nav} cta={dict.common.navCta} lang={lang} />
      <main className={styles.page}>
        {/* ============ HERO: фото → мультфільм ============ */}
        <header className={`hero ${styles.hero}`} id="top">
          <div className={`container ${styles.heroInner}`}>
            <Reveal className={styles.heroText}>
              <div className="hero__top">
                <Link href={langPath("/", lang)} className="logo" aria-label={dict.legal.back}>
                  <span className="logo__text">LUME</span>
                </Link>
                <LangSwitch lang={lang} />
              </div>
              <p className={`script ${styles.kicker}`}>{copy.hero.kicker}</p>
              <h1 className={styles.heroTitle}>{copy.heading}</h1>
              <p className={styles.heroLead}>{copy.hero.lead}</p>
              <p className={styles.heroNote}>{copy.hero.note}</p>
              <div className={`hero__cta ${styles.heroActions}`}>
                <ChatLink href={TELEGRAM_LINK} channel="Telegram" className="btn btn--dark">{copy.hero.order}</ChatLink>
                <ChatLink href={WHATSAPP_LINK} channel="WhatsApp" className="hero__cta-alt">{dict.common.orderCtaAlt}</ChatLink>
              </div>
            </Reveal>

            <div className={styles.heroVisual}>
              <figure className={`${styles.heroCard} ${styles.heroPhoto}`}>
                <Image
                  src={MEDIA.hero.photo.src}
                  width={MEDIA.hero.photo.w}
                  height={MEDIA.hero.photo.h}
                  alt={copy.hero.photoAlt}
                  sizes="(max-width: 960px) 50vw, 300px"
                  preload
                />
                <figcaption className="script">{copy.hero.photoLabel}</figcaption>
              </figure>
              <span className={`script ${styles.heroArrow}`} aria-hidden="true">→</span>
              <figure className={`${styles.heroCard} ${styles.heroCartoon}`}>
                <Image
                  src={MEDIA.hero.cartoon.src}
                  width={MEDIA.hero.cartoon.w}
                  height={MEDIA.hero.cartoon.h}
                  alt={copy.hero.cartoonAlt}
                  sizes="(max-width: 960px) 50vw, 300px"
                  preload
                />
                <figcaption className="script">{copy.hero.cartoonLabel}</figcaption>
              </figure>
            </div>
          </div>
        </header>

        {/* ============ ІСТОРІЯ: весь шлях одного кадру ============ */}
        <section className={`section--dark ${styles.story}`} id="story">
          <FilmEdge side="top" />
          <FilmEdge side="bottom" />
          <div className="container">
            <Reveal className={styles.storyHead}>
              <p className={`script ${styles.kickerLight}`}>{copy.story.kicker}</p>
              <h2 className={`h2 ${styles.h2}`}>{copy.story.heading}</h2>
              <p className={styles.storyLead}>{copy.story.lead}</p>
            </Reveal>

            <Reveal as="ol" className={styles.track}>
              {copy.story.steps.map((step, i) => {
                const media = MEDIA.story[i];
                const frame = (
                  <span className={styles.frame}>
                    <Image src={media.src} width={media.w} height={media.h} alt={step.alt} sizes="(max-width: 760px) 46vw, (max-width: 1100px) 45vw, 280px" />
                  </span>
                );
                return (
                  <li key={step.label} className={styles.step}>
                    {/* Останній крок веде до самого відео реакції нижче. */}
                    {i === copy.story.steps.length - 1 ? (
                      <a href="#film" className={styles.frameLink}>{frame}</a>
                    ) : frame}
                    <span className={styles.stepText}>
                      <span className={`script ${styles.stepLabel}`}>{step.label}</span>
                      <span className={styles.stepCaption}>{step.caption}</span>
                    </span>
                  </li>
                );
              })}
            </Reveal>
          </div>
        </section>

        {/* ============ З ФОТО — У ПЕРСОНАЖА ============ */}
        <section className={styles.pairs} id="likeness">
          <div className="container">
            <Reveal className={styles.sectionHead}>
              <h2 className={`h2 h2--dark ${styles.h2}`}>{copy.pairs.heading}</h2>
              <p className={styles.sectionLead}>{copy.pairs.lead}</p>
            </Reveal>

            <div className={styles.pairGrid}>
              {copy.pairs.items.map((pair, i) => {
                const media = MEDIA.pairs[i];
                return (
                  <Reveal as="article" key={pair.title} className={styles.pair} delay={i as 0 | 1 | 2}>
                    <div className={styles.pairVisual}>
                      <figure className={styles.pairPhoto}>
                        <Image src={media.photo.src} width={media.photo.w} height={media.photo.h} alt={pair.photoAlt} sizes="(max-width: 760px) 56vw, 330px" />
                      </figure>
                      <div className={styles.pairCharacters} data-count={media.characters.length}>
                        {media.characters.map((c, k) => (
                          <Image
                            key={c.src}
                            src={c.src}
                            width={c.w}
                            height={c.h}
                            alt={k === 0 ? pair.characterAlt : ""}
                            sizes="(max-width: 760px) 26vw, 150px"
                          />
                        ))}
                      </div>
                      <figure className={styles.pairScene}>
                        <Image src={media.scene.src} width={media.scene.w} height={media.scene.h} alt={pair.sceneAlt} sizes="96px" />
                        <figcaption>{copy.pairs.sceneLabel}</figcaption>
                      </figure>
                    </div>
                    <h3 className={`script ${styles.pairTitle}`}>{pair.title}</h3>
                    <p className={styles.details}>{pair.details.join(" · ")}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ ЩО ПОТРІБНО ВІД ВАС ============ */}
        <section className={styles.brief} id="brief">
          <div className={`container ${styles.briefInner}`}>
            <Reveal className={styles.briefLead}>
              <h2 className={`h2 h2--dark ${styles.h2}`}>{copy.brief.heading}</h2>
              <p className={styles.briefCount}>
                <span className={styles.bigNum}>{copy.brief.photosCount}</span>
                <span>{copy.brief.photosText}</span>
              </p>
            </Reveal>
            <Reveal className={styles.briefList} delay={1}>
              <ol>
                {copy.brief.items.map((item) => <li key={item}>{item}</li>)}
              </ol>
              <p className={`script ${styles.briefNote}`}>{copy.brief.note}</p>
            </Reveal>
          </div>
        </section>

        {/* ============ ЯК МИ ЗБЕРІГАЄМО СХОЖІСТЬ ============ */}
        <section className={styles.likeness}>
          <div className="container">
            <Reveal as="h2" className={`h2 h2--dark ${styles.h2}`}>{copy.likeness.heading}</Reveal>
            <div className={styles.likenessGrid}>
              <Reveal as="figure" className={styles.sheet}>
                <Image src={MEDIA.sheet.src} width={MEDIA.sheet.w} height={MEDIA.sheet.h} alt={copy.likeness.sheetAlt} sizes="(max-width: 960px) 100vw, 760px" />
                <figcaption className={styles.angles}>
                  {copy.likeness.angles.map((a) => <span key={a}>{a}</span>)}
                </figcaption>
              </Reveal>
              <Reveal as="ol" className={styles.points} delay={1}>
                {copy.likeness.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </Reveal>
            </div>

          </div>
        </section>

        {/* ============ СПРАВЖНІЙ МОМЕНТ → СЦЕНА ============ */}
        <section className={`section--dark ${styles.moment}`}>
          <FilmEdge side="top" />
          <FilmEdge side="bottom" />
          <div className="container">
            <Reveal className={styles.momentHead}>
              <h2 className={`h2 ${styles.h2}`}>{copy.moment.heading}</h2>
              <p className={styles.momentLead}>{copy.moment.lead}</p>
            </Reveal>
            <Reveal className={styles.momentPair}>
              <figure className={styles.momentClip}>
                <figcaption className="script">{copy.moment.real}</figcaption>
                <LoopVideo src={MEDIA.moment.real.src} poster={MEDIA.moment.real.poster} label={copy.moment.realAlt} />
              </figure>
              <span className={`script ${styles.momentArrow}`} aria-hidden="true">→</span>
              <figure className={styles.momentClip}>
                <figcaption className="script">{copy.moment.cartoon}</figcaption>
                <LoopVideo src={MEDIA.moment.cartoon.src} poster={MEDIA.moment.cartoon.poster} label={copy.moment.cartoonAlt} />
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ============ ГОТОВИЙ ФІЛЬМ + РЕАКЦІЯ ============ */}
        <section className={styles.film} id="film">
          <div className={`container ${styles.filmInner}`}>
            <Reveal className={styles.filmMain}>
              <h2 className={`h2 h2--dark ${styles.h2}`}>{copy.film.heading}</h2>
              <p className={styles.sectionLead}>{copy.film.lead}</p>
              <figure className={styles.filmVideo}>
                <VideoBox variant="9x16" src={MEDIA.film.src} poster={MEDIA.film.poster} labels={dict.video} preload="none" />
                <figcaption>{copy.film.filmCaption}</figcaption>
              </figure>
            </Reveal>
            <Reveal className={styles.filmReaction} delay={1}>
              <p className={`script ${styles.reactionHeading}`}>{copy.film.reactionHeading}</p>
              <figure className={styles.filmVideo}>
                <VideoBox variant="9x16" src={MEDIA.reaction.src} poster={MEDIA.reaction.poster} labels={dict.video} preload="none" />
                <figcaption>{copy.film.reactionCaption}</figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ============ ЩО ВИ ОТРИМУЄТЕ: студія, а не генератор + ціна ============ */}
        {/* id="pricing": на цей якір посилаються пропозиції в JSON-LD. */}
        <section className={styles.result} id="pricing">
          <div className={`container ${styles.resultInner}`}>
            <Reveal className={styles.resultList}>
              <h2 className={`h2 h2--dark ${styles.h2}`}>{copy.result.heading}</h2>
              <p className={styles.resultLead}>{copy.result.lead}</p>
              <ul>
                {copy.result.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
            <Reveal className={styles.price} delay={1}>
              <p className={styles.priceValue}>
                <span>{copy.result.priceFrom}</span>
                <strong>{priceFrom}</strong>
                <span>{copy.result.perMinute}</span>
              </p>
              <Link href={`${langPath("/", lang)}#pricing`} className="btn btn--dark">{copy.result.compareLink}</Link>
            </Reveal>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="faq section--dark" id="faq">
          <div className="container container--narrow">
            <Reveal as="h2" className="h2 h2--sm">{copy.faqHeading}</Reveal>
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
