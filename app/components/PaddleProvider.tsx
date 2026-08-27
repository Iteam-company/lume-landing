"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CheckoutEventNames,
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";
import { PADDLE_CLIENT_TOKEN, PADDLE_ENV } from "../paddle";

export type CheckoutPhase = "idle" | "loaded" | "closed" | "completed";

type PaddleContextValue = {
  paddle: Paddle | null;
  checkoutPhase: CheckoutPhase;
  resetCheckout: () => void;
};

const PaddleContext = createContext<PaddleContextValue>({
  paddle: null,
  checkoutPhase: "idle",
  resetCheckout: () => {},
});

export function usePaddle(): PaddleContextValue {
  return useContext(PaddleContext);
}

export default function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutPhase, setCheckoutPhase] = useState<CheckoutPhase>("idle");

  const resetCheckout = useCallback(() => setCheckoutPhase("idle"), []);

  useEffect(() => {
    if (!PADDLE_CLIENT_TOKEN) return;
    if (paddle?.Initialized) return;

    initializePaddle({
      token: PADDLE_CLIENT_TOKEN,
      environment: PADDLE_ENV,
      eventCallback: (event) => {
        switch (event.name) {
          case CheckoutEventNames.CHECKOUT_LOADED:
            setCheckoutPhase((p) => (p === "completed" ? p : "loaded"));
            break;
          case CheckoutEventNames.CHECKOUT_COMPLETED:
            setCheckoutPhase("completed");
            break;
          case CheckoutEventNames.CHECKOUT_CLOSED:
            setCheckoutPhase((p) => (p === "completed" ? p : "closed"));
            break;
        }
        if (process.env.NODE_ENV !== "production") {
          console.debug("[paddle]", event.name, event.data);
        }
      },
    })
      .then((instance) => {
        if (instance) setPaddle(instance);
      })
      .catch(() => {
      });
  }, [paddle?.Initialized]);

  return (
    <PaddleContext.Provider value={{ paddle, checkoutPhase, resetCheckout }}>
      {children}
    </PaddleContext.Provider>
  );
}
