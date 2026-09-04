import Link from "next/link";

export default function NotFound() {
  return (
    <main className="legal">
      <div className="container container--narrow">
        <h1>404</h1>
        <p>Сторінку не знайдено</p>
        <p>
          <Link href="/" className="legal__back">
            На головну
          </Link>
        </p>
      </div>
    </main>
  );
}
