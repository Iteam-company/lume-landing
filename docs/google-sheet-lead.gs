/**
 * LUME — приймач заявок для Google-таблиці.
 *
 * Як підключити:
 *  1. Створіть таблицю на drive.google.com.
 *  2. Розширення → Apps Script. Видаліть вміст файлу й вставте цей код.
 *  3. Збережіть, далі Deploy → New deployment → тип "Web app":
 *       Execute as:      Me
 *       Who has access:  Anyone
 *  4. Скопіюйте адресу вигляду https://script.google.com/macros/s/.../exec
 *     і покладіть її у змінну GOOGLE_SHEET_WEBHOOK_URL (.env.local і Vercel).
 *
 * Перший запит сам створить рядок заголовків.
 */

var HEADERS = [
  'Дата',
  'Телефон',
  'Мова',
  'Сторінка',
  'Країна',
  'Звідки (форма)',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid / gclid',
  '_fbp',
  '_fbc',
  'Реферер',
  'Браузер'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var utm = data.utm || {};
    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      // Апостроф зберігає «+» і нулі: інакше таблиця зробить із номера число.
      "'" + (data.phone || ''),
      data.lang || '',
      data.page || '',
      data.country || '',
      data.source || '',
      utm.utm_source || '',
      utm.utm_medium || '',
      utm.utm_campaign || '',
      utm.utm_content || '',
      utm.utm_term || '',
      utm.fbclid || utm.gclid || '',
      data.fbp || '',
      data.fbc || '',
      data.referrer || '',
      data.userAgent || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/** Перевірка, що застосунок живий: відкрийте адресу у браузері. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'lume-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}
