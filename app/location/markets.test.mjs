/* ============================================================
   Тести чистої логіки Location Observer.

   Вбудований у Node тест-раннер (node:test) — без нових залежностей.
   Файл навмисно .mjs: так Node напряму виконує імпорт ./markets.ts
   (type stripping), а tsc його не чіпає.

   Запуск:
       node --test app/location/markets.test.mjs
   ============================================================ */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  fallbackVisitorLocation,
  normalizeCountry,
  resolveMarket,
  toVisitorLocation,
} from "./markets.ts";

test("normalizeCountry: валідний ISO alpha-2 (з trim / uppercase)", () => {
  assert.equal(normalizeCountry("UA"), "UA");
  assert.equal(normalizeCountry("ua"), "UA");
  assert.equal(normalizeCountry("  pl  "), "PL");
  assert.equal(normalizeCountry("De"), "DE");
});

test("normalizeCountry: невідоме / некоректне значення → null", () => {
  const bad = [
    "XX",
    "ZZ",
    "O1",
    "A1",
    "A2",
    "EU",
    "AP",
    "",
    "   ",
    "U",
    "USA",
    "1A",
    "!!",
    "u a",
    null,
    undefined,
  ];
  for (const value of bad) {
    assert.equal(
      normalizeCountry(value),
      null,
      `очікували null для ${JSON.stringify(value)}`,
    );
  }
});

test("resolveMarket: UA → ukraine, решта та null → international", () => {
  assert.equal(resolveMarket("UA"), "ukraine");
  assert.equal(resolveMarket("PL"), "international");
  assert.equal(resolveMarket("DE"), "international");
  assert.equal(resolveMarket("US"), "international");
  assert.equal(resolveMarket(null), "international");
});

test("toVisitorLocation: UA → ukraine / uk / UAH", () => {
  assert.deepEqual(toVisitorLocation("UA", "geo-header"), {
    country: "UA",
    market: "ukraine",
    defaultLocale: "uk",
    currency: "UAH",
    source: "geo-header",
  });
});

test("toVisitorLocation: PL / DE / US → international / en / USD", () => {
  for (const country of ["PL", "DE", "US"]) {
    assert.deepEqual(toVisitorLocation(country, "geo-header"), {
      country,
      market: "international",
      defaultLocale: "en",
      currency: "USD",
      source: "geo-header",
    });
  }
});

test("toVisitorLocation: null → international / en / USD", () => {
  assert.deepEqual(toVisitorLocation(null, "fallback"), {
    country: null,
    market: "international",
    defaultLocale: "en",
    currency: "USD",
    source: "fallback",
  });
});

test("fallbackVisitorLocation: international / en / USD, source=fallback", () => {
  assert.deepEqual(fallbackVisitorLocation(), {
    country: null,
    market: "international",
    defaultLocale: "en",
    currency: "USD",
    source: "fallback",
  });
});

test("наскрізь: сире сміття → нормалізація → міжнародний ринок", () => {
  for (const raw of ["XX", "ZZ", "???", "", "  ", "usa"]) {
    const country = normalizeCountry(raw);
    const location = toVisitorLocation(
      country,
      country !== null ? "geo-header" : "fallback",
    );
    assert.equal(location.market, "international");
    assert.equal(location.defaultLocale, "en");
    assert.equal(location.currency, "USD");
  }
});

test("наскрізь: 'ua' від проксі → ukraine ринок", () => {
  const country = normalizeCountry("ua");
  const location = toVisitorLocation(
    country,
    country !== null ? "geo-header" : "fallback",
  );
  assert.deepEqual(location, {
    country: "UA",
    market: "ukraine",
    defaultLocale: "uk",
    currency: "UAH",
    source: "geo-header",
  });
});
