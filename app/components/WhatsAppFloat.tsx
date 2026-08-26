"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_LINK } from "../config";
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
    <a
      className={`wa-float${visible ? " is-visible" : ""}`}
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener"
      aria-label="Написати у WhatsApp"
    >
      <Icon name="i-wa" />
      <span>WhatsApp</span>
    </a>
  );
}
