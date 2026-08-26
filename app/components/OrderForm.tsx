"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FORM_ENDPOINT, ORDER_EMAIL } from "../config";
import { Icon } from "./Icons";

type Errors = Partial<Record<"name" | "phone" | "telegram" | "email", boolean>>;

/** Маска українського номера: +380 (XX) XXX-XX-XX */
function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("380")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 9);
  let out = "+380";
  if (d.length) out += " (" + d.slice(0, 2);
  if (d.length >= 2) out += ") " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}

const isValid = {
  name: (v: string) => v.trim().length >= 2,
  phone: (v: string) => v.replace(/\D/g, "").length >= 12,
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),
  telegram: (v: string) =>
    v.trim() === "" ||
    /^@?[A-Za-z0-9_]{4,32}$/.test(v.trim().replace(/^https?:\/\/t\.me\//i, "")),
};

export default function OrderForm() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    telegram: "",
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: false }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const next: Errors = {};
    (Object.keys(values) as (keyof typeof values)[]).forEach((k) => {
      if (!isValid[k](values[k])) next[k] = true;
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = { ...values, page: window.location.href };

    if (FORM_ENDPOINT) {
      try {
        await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        /* заявку показуємо як надіслану, щоб не втратити користувача */
      }
    } else if (ORDER_EMAIL) {
      const body =
        `Імʼя: ${payload.name}\n` +
        `Телефон (WhatsApp): ${payload.phone}\n` +
        `Telegram: ${payload.telegram || "—"}\n` +
        `E-mail: ${payload.email}\n` +
        `Сторінка: ${payload.page}`;
      window.location.href =
        `mailto:${ORDER_EMAIL}` +
        `?subject=${encodeURIComponent("Заявка на мультфільм — LUME")}` +
        `&body=${encodeURIComponent(body)}`;
    }

    setSent(true);
  };

  return (
    <form className={`form${sent ? " is-sent" : ""}`} onSubmit={onSubmit} noValidate>
      <svg className="butterfly" viewBox="0 0 64 52" aria-hidden="true">
        <path
          d="M32 26c-2-9-9-20-18-23-7-2-12 3-12 11 0 9 8 17 17 20-8 2-14 7-14 13 0 4 3 6 7 5 9-2 17-13 20-22-.2-1.3-.2-2.7 0-4z"
          fill="currentColor"
        />
        <path
          d="M32 26c2-9 9-20 18-23 7-2 12 3 12 11 0 9-8 17-17 20 8 2 14 7 14 13 0 4-3 6-7 5-9-2-17-13-20-22 .2-1.3 .2-2.7 0-4z"
          fill="currentColor"
        />
        <path
          d="M32 22c1.2 0 2 1 2 2.4v13c0 2-1 3.6-2 3.6s-2-1.6-2-3.6v-13c0-1.4.8-2.4 2-2.4z"
          fill="currentColor"
        />
      </svg>

      <label className={`field${errors.name ? " is-error" : ""}`}>
        <span className="field__label">Імʼя:</span>
        <input
          type="text"
          name="name"
          placeholder="Ваше імʼя"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <span className="field__err">Вкажіть, будь ласка, ваше імʼя</span>
      </label>

      <div className={`field${errors.phone ? " is-error" : ""}`}>
        <span className="field__label">
          Ваш телефон, на якому є Whatsapp
          <Icon name="i-wa" className="badge badge--wa" />
        </span>
        <div className="phone">
          <span className="phone__flag">
            <span className="flag">🇺🇦</span>
            <span className="caret" />
          </span>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            placeholder="+380 (00) 000-00-00"
            autoComplete="tel"
            value={values.phone}
            onFocus={() => !values.phone && set("phone", "+380 (")}
            onChange={(e) => set("phone", maskPhone(e.target.value))}
          />
        </div>
        <span className="field__err">Введіть коректний номер телефону</span>
      </div>

      <label className={`field${errors.telegram ? " is-error" : ""}`}>
        <span className="field__label">
          Ваш нік у Telegram
          <Icon name="i-tg" className="badge badge--tg" />
        </span>
        <span className="field__hint">Якщо його немає, залиште це поле порожнім</span>
        <input
          type="text"
          name="telegram"
          placeholder="@nickname"
          autoComplete="off"
          value={values.telegram}
          onChange={(e) => set("telegram", e.target.value)}
        />
        <span className="field__err">Нік має складатися з латиниці, цифр і «_»</span>
      </label>

      <label className={`field${errors.email ? " is-error" : ""}`}>
        <span className="field__label">
          Ваш e-mail
          <Icon name="i-mail" className="badge badge--mail" />
        </span>
        <span className="field__hint">
          На цю адресу надішлемо деталі замовлення та готовий мультфільм
        </span>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <span className="field__err">Введіть коректний e-mail</span>
      </label>

      <button className="btn btn--green" type="submit">
        Замовити мультфільм
      </button>

      <p className="form__note">
        Натискаючи кнопку, ви погоджуєтесь з{" "}
        <Link href="/privacy">політикою конфіденційності</Link>
      </p>

      {sent && (
        <div className="form__ok">
          <strong>Дякуємо! Заявку надіслано.</strong>
          <span>Куратор звʼяжеться з вами протягом 15 хвилин.</span>
        </div>
      )}
    </form>
  );
}
