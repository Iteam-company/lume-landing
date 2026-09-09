"use client";

import { useSyncExternalStore } from "react";
import { formatDateYmd } from "../content/format";
import { LAUNCH_UNTIL } from "../pricing";

export type OfferLabels = {
  title: string;
  note: string;
  until: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

/** Кінець дня, у який ще діє стартова ціна. */
const DEADLINE = new Date(`${LAUNCH_UNTIL}T23:59:59`).getTime();

/* Тик раз на секунду через useSyncExternalStore: на сервері знімок —
   null, тож розмітка збігається й немає стрибка при гідратації. */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

function split(nowSec: number) {
  const left = Math.floor(DEADLINE / 1000) - nowSec;
  if (left <= 0) return null;
  return {
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Зворотний відлік до реальної дати завершення стартових цін.
 *
 * Свідомо НЕ робимо персональний таймер, що перезапускається в кожного
 * відвідувача: вигаданий дедлайн — це оманлива практика, за яку б'ють
 * і закон про захист прав споживачів, і рекламні правила Meta.
 * Дата одна для всіх і збігається з LAUNCH_UNTIL у моделі цін.
 */
export default function OfferCountdown({ labels }: { labels: OfferLabels }) {
  const nowSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (nowSec === null) return null;

  const left = split(nowSec);
  if (!left) return null; // акція завершилась — блок зникає сам

  const units: [number, string][] = [
    [left.days, labels.days],
    [left.hours, labels.hours],
    [left.minutes, labels.minutes],
    [left.seconds, labels.seconds],
  ];

  return (
    <div className="offer" role="status">
      <p className="offer__title">{labels.title}</p>
      <div className="offer__clock" aria-hidden="true">
        {units.map(([value, unit]) => (
          <span className="offer__unit" key={unit}>
            <b>{pad(value)}</b>
            <i>{unit}</i>
          </span>
        ))}
      </div>
      <p className="offer__note">
        {labels.until.replace("{date}", formatDateYmd(LAUNCH_UNTIL))} · {labels.note}
      </p>
    </div>
  );
}
