import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";

/** Спільний каркас юридичних сторінок: шапка з логотипом і футер. */
export default function LegalShell({
  title,
  date,
  children,
}: {
  title: string;
  date: string;
  children: ReactNode;
}) {
  return (
    <>
      <main className="legal">
        <div className="container container--narrow">
          <div className="legal__top">
            <Link href="/" className="logo">
              <span className="logo__text">LUME</span>
            </Link>
            <Link href="/" className="legal__back">
              На головну
            </Link>
          </div>

          <h1>{title}</h1>
          <p className="legal__date">{date}</p>

          {children}

          <hr />
          {/* ЗАПОВНІТЬ: назва юрособи / ФОП, реєстраційні дані та контактний e-mail */}
          <h2>Контактна інформація</h2>
          <p>
            Найменування: <span className="fill">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <br />
            Реєстраційний номер: <span className="fill">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <br />
            E-mail: <span className="fill">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
