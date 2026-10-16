"use client";

import { useEffect, useState } from "react";
import { trackPixel } from "../pixel";
import { WFP_WIDGET_SRC, type PaymentParams } from "../wayforpay";

type WayforpayWidget = {
  run: (
    params: PaymentParams,
    approved: (r: unknown) => void,
    declined: (r: unknown) => void,
    pending: (r: unknown) => void,
  ) => void;
};

declare global {
  interface Window {
    Wayforpay?: new () => WayforpayWidget;
  }
}

export type PayCopy = {
  pay: string;
  loading: string;
  approved: string;
  declined: string;
  pending: string;
  error: string;
};

/** Вантажимо скрипт віджета один раз і лише на першу спробу оплати. */
let widgetPromise: Promise<void> | null = null;
function loadWidget(): Promise<void> {
  if (window.Wayforpay) return Promise.resolve();
  if (!widgetPromise) {
    widgetPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = WFP_WIDGET_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        widgetPromise = null;
        reject(new Error("widget"));
      };
      document.head.appendChild(script);
    });
  }
  return widgetPromise;
}

/**
 * Кнопка оплати карткою через віджет WayForPay.
 *
 * Сам платіж створює сервер: сюди приходить готовий набір параметрів
 * із підписом. Сума в ньому вже накрита підписом, тож підмінити її в
 * браузері неможливо.
 *
 * Кнопка показується лише там, де оплата справді доступна: ключ
 * налаштований і відвідувач у гривневому ринку (WayForPay не приймає євро).
 */
export default function PayButton({
  tier,
  minutes,
  song,
  amount,
  copy,
  className = "",
}: {
  tier: string;
  minutes: number;
  song: boolean;
  amount: number;
  copy: PayCopy;
  className?: string;
}) {
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/payment", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { enabled?: boolean }) => {
        if (alive && data.enabled) setAvailable(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!available) return null;

  async function pay() {
    if (busy) return;
    setBusy(true);
    setNote(null);

    try {
      trackPixel("InitiateCheckout", {
        content_name: tier,
        value: amount,
        currency: "UAH",
      });

      const [params] = await Promise.all([
        fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier, minutes, song }),
        }).then(async (r) => {
          if (!r.ok) throw new Error(String(r.status));
          return (await r.json()) as PaymentParams;
        }),
        loadWidget(),
      ]);

      if (!window.Wayforpay) throw new Error("widget");

      new window.Wayforpay().run(
        params,
        () => {
          // Це лише сигнал для інтерфейсу. Справжнє підтвердження оплати
          // приходить на /api/payment/callback з серверів WayForPay.
          trackPixel("Purchase", { value: amount, currency: "UAH" });
          setNote(copy.approved);
          setBusy(false);
        },
        () => {
          setNote(copy.declined);
          setBusy(false);
        },
        () => {
          setNote(copy.pending);
          setBusy(false);
        },
      );
    } catch {
      setNote(copy.error);
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={pay} disabled={busy}>
        {busy ? copy.loading : copy.pay}
      </button>
      {note ? (
        <p className="plan__pay-note" role="status">
          {note}
        </p>
      ) : null}
    </>
  );
}
