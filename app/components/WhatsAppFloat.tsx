"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_LINK, INSTAGRAM_LINK } from "../config";
import { Icon } from "./Icons";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`floats${visible ? " is-visible" : ""}`}>
      <a
        className="wa-float wa-float--ig"
        href={INSTAGRAM_LINK}
        target="_blank"
        rel="noopener"
        aria-label="Ми в Instagram"
      >
        <Icon name="i-ig" />
        <span>Instagram</span>
      </a>
      <a
        className="wa-float"
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener"
        aria-label="Написати у WhatsApp"
      >
        <Icon name="i-wa" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
