"use client";

import { useSyncExternalStore } from "react";

export type OfferLabels = {
  title: string;
  note: string;
  until: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

/** Скільки триває вікно знижки, у секундах. */
const WINDOW_SEC = 30 * 60;

/* Відлік починається заново при кожному завантаженні сторінки: модуль
   виконується один раз на клієнті, тож момент старту — це момент, коли
   відвідувач відкрив сайт. На сервері знімок — null, тож розмітка
   збігається й немає стрибка при гідратації. */
const STARTED_AT = Date.now();

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

function split(nowSec: number) {
  const left = Math.floor(STARTED_AT / 1000) + WINDOW_SEC - nowSec;
  if (left <= 0) return null;
  return {
    minutes: Math.floor(left / 60),
    seconds: left % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Зворотний відлік вікна, протягом якого за відвідувачем тримається знижка.
 *
 * Обіцянку треба виконувати: куратор має давати цю знижку всім, хто
 * написав. Таймер, після якого ціна насправді не змінюється, — оманлива
 * практика і ризик і за законом про захист прав споживачів, і за
 * рекламними правилами Meta.
 */
export default function OfferCountdown({ labels }: { labels: OfferLabels }) {
  const nowSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (nowSec === null) return null;

  const left = split(nowSec);
  if (!left) return null; // вікно вичерпано — блок зникає

  const units: [number, string][] = [
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
        {labels.until} · {labels.note}
      </p>
    </div>
  );
}
