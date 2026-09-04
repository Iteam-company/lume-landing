"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

const FORM_ID = "form";

/** "/?tier=story&minutes=2#form" -> { path: "/", query: "tier=story&minutes=2" }. */
function parseHref(href: string): { path: string; query: string } {
  const withoutHash = href.split("#")[0];
  const [path, query = ""] = withoutHash.split("?");
  return { path: path || "/", query };
}

/**
 * CTA-посилання на секцію форми замовлення (#form).
 *
 * Проблема звичайного <Link href="#form">: якщо hash в адресному рядку
 * вже "#form", повторний клік нічого не змінює в URL, тож браузер не
 * скролить вдруге — ані сам, ані через Next.js router. Тому на клік
 * ЗАВЖДИ виконуємо scrollIntoView програмно, незалежно від того, чи
 * зміниться URL.
 *
 * router.push лишається — він синхронізує адресний рядок і, коли href
 * несе власний query (PlanCard: "?tier=story&minutes=2#form"), реактивно
 * оновлює useSearchParams() в OrderForm. Якщо власного query нема (hero,
 * логотип, кнопки секцій — просто "/#form"), поточний query в URL
 * зберігається як є, а не затирається.
 *
 * href лишається справжнім "#form"-посиланням: без JS чи з модифікатором
 * кліку (нова вкладка, Cmd/Ctrl-клік) спрацьовує звичайна навігація.
 */
export default function ScrollToFormLink({
  href,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Відкриття в новій вкладці / іншою кнопкою миші — не перехоплюємо.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const form = document.getElementById(FORM_ID);
    if (!form) return; // форми на сторінці немає — нехай спрацює звичайний перехід

    e.preventDefault();

    const { path, query } = parseHref(href);
    const targetSearch = query ? `?${query}` : window.location.search;
    router.push(`${path}${targetSearch}#${FORM_ID}`, { scroll: false });

    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
