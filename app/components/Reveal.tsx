"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

const DELAY = ["", "reveal--delay", "reveal--delay2", "reveal--delay3"];

/** Плавна поява блоку при потраплянні у видиму частину екрана. */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${DELAY[delay]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
