"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Скільки часу займає створення?",
    a: "1 день",
  },
  {
    q: "Чи точно вийде передати те, що я хочу?",
    a: "Перед початком роботи ми детально узгоджуємо сценарій і фотографії, щоб Ви отримали саме те, що задумували",
  },
  {
    q: "У якому форматі отримаю мультфільм?",
    a: "Full HD, файл для телефона та соцмереж",
  },
  {
    q: "Як почати?",
    a: "Залиште заявку — куратор звʼяжеться протягом 15 хвилин",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq__list">
      {ITEMS.map((item, i) => (
        <div key={item.q} className={`faq__item${open === i ? " is-open" : ""}`}>
          <button
            className="faq__q"
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <span className="faq__ico" />
          </button>
          <div className="faq__a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
