/* ============================================================
   Студія персонажів — налаштування генерації.

   Числа тут напряму впливають на витрати: модель, якість і розмір
   визначають ціну одного зображення. Бюджет — 10 $ на місяць, тому
   ліміти нижче навмисно жорсткі.
   ============================================================ */

/** Модель генерації зображень OpenAI. */
export const IMAGE_MODEL = "gpt-image-1";

/** Якість: medium — компроміс ціни й вигляду (low помітно гірший). */
export const IMAGE_QUALITY = "medium";

/** Формати на вибір користувача. Більше не даємо — кожен інший розмір
 *  це інша ціна. */
export const SIZES = {
  square: "1024x1024",
  portrait: "1024x1536",
} as const;

export type SizeKey = keyof typeof SIZES;

export function isSizeKey(value: unknown): value is SizeKey {
  return value === "square" || value === "portrait";
}

/** Скільки фото приймаємо за раз. Кожне фото — це вхідні токени, тобто гроші. */
export const MAX_PHOTOS = 3;

/** Межа на один файл після стиснення в браузері. Із запасом: клієнт
 *  стискає до ~1024 px, це рідко більше за мегабайт. */
export const MAX_FILE_BYTES = 6 * 1024 * 1024;

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Скільки генерацій дозволяємо одному відвідувачу. */
export const ATTEMPTS_PER_VISITOR = 1;

/** Запобіжник від того, хто чистить куки: скільки генерацій з однієї
 *  IP-адреси на добу. */
export const ATTEMPTS_PER_IP_PER_DAY = 3;

/**
 * Скільки генерацій дозволяємо всім разом за місяць.
 *
 * Орієнтир: medium 1024x1024 коштує близько 4 центів, портрет —
 * трохи дорожче. 150 генерацій ≈ 6-9 $, тобто вкладаємося в 10 $
 * із запасом на вхідні фото.
 *
 * УВАГА: це програмний запобіжник, а не гарантія. Єдине, що справді
 * не дасть перевитратити гроші, — ліміт витрат у кабінеті OpenAI
 * (Settings → Limits → Monthly budget). Поставте там 10 $.
 */
export const GENERATIONS_PER_MONTH = 150;

/** Скільки персонажів дозволяємо замовити. */
export const MAX_PEOPLE = 3;

export function normalizePeople(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_PEOPLE, Math.max(1, Math.round(n)));
}

/**
 * Промпт для моделі. Англійською незалежно від мови сайту: так модель
 * стабільніша, а користувач бачить лише результат.
 *
 * Кількість персонажів задана числом і повторена словами: кілька фото
 * однієї людини модель інакше читає як різних людей і домальовує зайвих.
 */
export function buildPrompt(people: number): string {
  const count = normalizePeople(people);
  const plural = count === 1 ? "character" : "characters";

  return [
    `Draw exactly ${count} ${plural} — no more, no fewer.`,
    count === 1
      ? "All reference photos show the SAME single person, possibly from different angles: draw that one person alone, with nobody else in the frame."
      : `The reference photos show ${count} people in total; draw each of them once.`,
    "Do not invent extra people, partners, children, background characters or crowds.",
    "Turn them into one warm, cinematic 3D animated cartoon illustration in the style of a modern family animated film:",
    "soft volumetric lighting, gentle rim light, shallow depth of field,",
    "expressive friendly faces, slightly stylized proportions.",
    "Keep each person recognizable — hair color and style, face shape, skin tone,",
    "facial hair, glasses and clothing colors must match the photos.",
    "Softly blurred cozy background. No text, no watermarks, no logos, no frames.",
  ].join(" ");
}
