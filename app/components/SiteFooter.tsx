import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer__bottom">
        <p>© LUME, 2026. Усі права захищені.</p>
        <nav className="footer__nav">
          <Link href="/terms">Користувацька угода</Link>
          <Link href="/privacy">Політика конфіденційності</Link>
          {/* Підтримка: за потреби замініть на mailto:ваша@пошта */}
          <Link href="/#form">Підтримка</Link>
        </nav>
      </div>
    </footer>
  );
}
