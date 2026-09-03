"use client";

import { useEffect, useState } from "react";
import { INSTAGRAM_LINK, TELEGRAM_LINK, WHATSAPP_LINK } from "../config";
import { Icon } from "./Icons";

export default function WhatsAppFloat({
  labels,
}: {
  labels: {
    instagramAria: string;
    telegramAria: string;
    whatsappAria: string;
  };
}) {
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
        aria-label={labels.instagramAria}
      >
        <Icon name="i-ig" />
        <span>Instagram</span>
      </a>
      <a
        className="wa-float wa-float--tg"
        href={TELEGRAM_LINK}
        target="_blank"
        rel="noopener"
        aria-label={labels.telegramAria}
      >
        <Icon name="i-tg" />
        <span>Telegram</span>
      </a>
      <a
        className="wa-float"
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener"
        aria-label={labels.whatsappAria}
      >
        <Icon name="i-wa" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
