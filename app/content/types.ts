/* ============================================================
   Типи для текстового контенту. Тут — лише ті форми, де потрібен
   дискримінований union / нульове поле, щоб `typeof dict` не
   звужував їх занадто.
   ============================================================ */

/** Блок юридичного документа. `link` — вставка посилання на «/privacy»:
 *  текст містить плейсхолдер "{link}", який рендер замінює на <Link>. */
export type LegalBlock =
  | { kind: "p"; text: string; link?: { label: string } }
  | { kind: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

/** Копірайт тарифу (числа живуть у pricing.ts). */
export type TierCopy = {
  tagline: string;
  features: string[];
  badge: string | null;
};

export type TierSlugKey = "story" | "signature" | "cinema";
