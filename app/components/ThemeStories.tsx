"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OrderButton from "./OrderButton";
import Reveal from "./Reveal";
import VideoBox from "./VideoBox";

export type ThemeVideo = { src: string; poster: string; vertical?: boolean };

export type Theme = {
  id: string;
  tag: string;
  title: string;
  text: string;
  videos: ThemeVideo[];
};

/** Адреса вкладки: lume.kyiv.ua/#theme-birthday відкриває саме її. */
const hashFor = (id: string) => `theme-${id}`;

/**
 * Тематики мультфільмів — вкладки з роботами під привід.
 *
 * У кожної вкладки своя адреса (#theme-<id>): менеджер може надіслати
 * клієнту посилання одразу на потрібну тему, і сторінка відкриється
 * на ній. Перемикання вкладки оновлює адресу без перезавантаження.
 */
export default function ThemeStories({
  themes,
  heading,
  lead,
  order,
  tabsAria,
  videoLabels,
  caseLink,
}: {
  themes: Theme[];
  heading: string;
  lead: string;
  order: string;
  tabsAria: string;
  videoLabels: { play: string; placeholder: string };
  caseLink?: { href: string; label: string };
}) {
  const [active, setActive] = useState(themes[0]?.id);

  // Відкрили за посиланням на тему — вмикаємо її й прокручуємо до секції.
  useEffect(() => {
    function fromHash() {
      const id = window.location.hash.replace(/^#theme-/, "");
      if (!themes.some((t) => t.id === id)) return;
      setActive(id);
      document.getElementById("themes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [themes]);

  function choose(id: string) {
    setActive(id);
    history.replaceState(null, "", `#${hashFor(id)}`);
  }

  return (
    <section className="themes" id="themes">
      <div className="container">
        <Reveal className="themes__head">
          <h2 className="h2 h2--dark">{heading}</h2>
          <p className="themes__lead">{lead}</p>
        </Reveal>

        <div className="themes__tabs" role="tablist" aria-label={tabsAria}>
          {themes.map((t) => (
            <button
              key={t.id}
              id={`tab-${hashFor(t.id)}`}
              type="button"
              role="tab"
              aria-selected={t.id === active}
              aria-controls={hashFor(t.id)}
              className={`themes__tab${t.id === active ? " is-active" : ""}`}
              onClick={() => choose(t.id)}
            >
              <span className="themes__tab-tag">{t.tag}</span>
              <span className="themes__tab-title">{t.title}</span>
            </button>
          ))}
        </div>

        {themes.map((t) => (
          <div
            key={t.id}
            id={hashFor(t.id)}
            role="tabpanel"
            aria-labelledby={`tab-${hashFor(t.id)}`}
            className="themes__panel"
            // Неактивні панелі лишаються в HTML — їх бачать пошуковики.
            hidden={t.id !== active}
          >
            {/* 1–2 ролики — рівна сітка; більше — кладка на три колонки,
                бо серед них бувають вертикальні. */}
            <div className={`themes__grid themes__grid--${Math.min(t.videos.length, 3)}`}>
              {t.videos.map((v) => (
                <VideoBox
                  key={v.src}
                  variant={v.vertical ? "9x16" : "16x9"}
                  src={v.src}
                  poster={v.poster}
                  labels={videoLabels}
                />
              ))}
            </div>
            <div className="themes__foot">
              <p className="themes__text">{t.text}</p>
              <OrderButton className="btn btn--dark themes__order">{order}</OrderButton>
            </div>
          </div>
        ))}

        {caseLink ? (
          <p className="themes__case-row">
            <Link href={caseLink.href} className="themes__case">
              {caseLink.label}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
