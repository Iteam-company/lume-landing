"use client";

import { useEffect, useState } from "react";
import ChatLink from "./ChatLink";
import { TELEGRAM_LINK } from "../config";
import LangSwitch from "./LangSwitch";
import type { Lang } from "../content/lang";

export type NavItem = { id: string; label: string };

/**
 * Панель навігації по секціях.
 *
 * Зʼявляється лише після того, як відвідувач проскролив перший екран:
 * у шапці вже є логотип і кнопка замовлення, дублювати їх поверх героя
 * немає сенсу. Далі панель тримає під рукою головне — ціни й кнопку
 * «Написати».
 *
 * Активний пункт визначаємо через IntersectionObserver: слухати scroll
 * і рахувати позиції всіх секцій на кожен піксель прокрутки дорожче.
 */
export default function SiteNav({
  items,
  cta,
  lang,
}: {
  items: NavItem[];
  cta: string;
  lang: Lang;
}) {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      // Верхня третина екрана: секція вважається активною, коли доходить
      // до неї, а не коли зникає внизу.
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={`nav${shown ? " is-shown" : ""}`} aria-label="Розділи сайту">
      <div className="container nav__inner">
        <a className="nav__logo" href="#top">
          LUME
        </a>
        <ul className="nav__links">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? "is-active" : undefined}
                aria-current={active === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <LangSwitch lang={lang} />
        <ChatLink href={TELEGRAM_LINK} channel="Telegram" className="nav__cta">
          {cta}
        </ChatLink>
      </div>
    </nav>
  );
}
