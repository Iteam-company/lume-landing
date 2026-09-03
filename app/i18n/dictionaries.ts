/* ============================================================
   Словники — точка входу.

   Синхронно, зі статичної мапи: лендинг невеликий, обидва словники
   разом — кілька КБ. Server Components викликають getDictionary(lang);
   клієнтські компоненти отримують потрібний зріз пропсом (щоб не тягти
   обидві мови в клієнтський бандл — не імпортуйте цей файл із "use client").
   ============================================================ */

import type { Locale } from "./config";
import uk, { type Dictionary } from "./dictionaries/uk";
import en from "./dictionaries/en";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { uk, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
