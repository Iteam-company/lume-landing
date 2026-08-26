"use client";

import { useState } from "react";
import { FAQ } from "../faq";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq__list">
      {FAQ.map((item, i) => (
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
