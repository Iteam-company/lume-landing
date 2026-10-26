"use client";

import type { ReactNode } from "react";
import { openOrder, type OrderPrefill } from "./order-events";

/** Кнопка «Зробити замовлення»: відкриває анкету замість переходу в чат. */
export default function OrderButton({
  className,
  prefill,
  onClick,
  children,
}: {
  className?: string;
  prefill?: OrderPrefill;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => {
        onClick?.();
        openOrder(prefill);
      }}
    >
      {children}
    </button>
  );
}
