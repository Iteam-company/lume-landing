/* Словники сайту за мовою. Український — джерело структури,
   англійський типізований через Dictionary, тож пропущений ключ
   не пройде збірку. */

import uk, { type Dictionary } from "./dictionary";
import en from "./dictionary.en";
import ru from "./dictionary.ru";
import type { Lang } from "./lang";

const DICTIONARIES: Record<Lang, Dictionary> = { uk, en, ru };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
