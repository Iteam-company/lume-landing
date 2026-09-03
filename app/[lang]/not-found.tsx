import Link from "next/link";

/* Рендериться всередині app/[lang]/layout.tsx (стилі підключені).
   Посилання веде на "/" — proxy.ts перекине на потрібну локаль. */
export default function NotFound() {
  return (
    <main className="legal">
      <div className="container container--narrow">
        <h1>404</h1>
        <p>Сторінку не знайдено · Page not found</p>
        <p>
          <Link href="/" className="legal__back">
            На головну · Home
          </Link>
        </p>
      </div>
    </main>
  );
}
