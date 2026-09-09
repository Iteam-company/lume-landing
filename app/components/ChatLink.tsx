"use client";

import type { ReactNode } from "react";
import { trackPixel } from "../pixel";

/**
 * Кнопка переходу в месенджер.
 *
 * Після відмови від форми клік сюди — основна конверсія воронки, тому
 * шлемо і Lead (щоб Meta мала на чому оптимізувати кампанії, як раніше
 * на відправці форми), і Contact.
 */
export default function ChatLink({
  href,
  channel,
  className,
  children,
}: {
  href: string;
  channel: "Telegram" | "WhatsApp";
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackPixel("Lead", { content_name: channel });
        trackPixel("Contact", { content_name: channel });
      }}
    >
      {children}
    </a>
  );
}
