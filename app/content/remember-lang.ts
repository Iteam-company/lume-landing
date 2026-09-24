import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, type Lang } from "./lang";

/** Запамʼятовує вибір мови в куці — її читає proxy.ts і більше не
 *  перекидає відвідувача за гео. Живе окремо від компонента: запис у
 *  document з тіла компонента заборонений правилами React Compiler. */
export function rememberLang(lang: Lang): void {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`;
}
