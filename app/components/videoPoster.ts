import { getImageProps } from "next/image";

/**
 * Постер для <video> через оптимізатор next/image.
 *
 * Атрибут poster браузер качає одразу, навіть для роликів далеко внизу
 * сторінки, і повз next/image — тобто вихідним JPEG на 100–180 КБ.
 * Тут віддаємо WebP потрібного розміру.
 *
 * `width` — ширина, з якою постер показується на сторінці (CSS-пікселі);
 * оптимізатор бере вдвічі більшу під щільні екрани.
 */
export function videoPoster(src: string, width: number): string {
  return getImageProps({ src, alt: "", width, height: width }).props.src;
}

/** Типові ширини показу: вертикальні ролики 9:16, горизонтальні 16:9, шапка. */
export const POSTER_WIDTH = { vertical: 320, wide: 414, hero: 560 } as const;
