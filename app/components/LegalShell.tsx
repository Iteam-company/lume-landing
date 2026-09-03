import { Fragment } from "react";
import Link from "next/link";
import SiteFooter from "./SiteFooter";
import { localeHref } from "../i18n/locale-path";
import type { Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/dictionaries";
import type { LegalBlock, LegalDoc } from "../i18n/dictionaries/types";

/** Абзац з посиланням на «/privacy»: текст містить "{link}". */
function LinkedParagraph({
  text,
  label,
  href,
}: {
  text: string;
  label: string;
  href: string;
}) {
  const [before, after = ""] = text.split("{link}");
  return (
    <p>
      {before}
      <Link href={href}>{label}</Link>
      {after}
    </p>
  );
}

function Block({ block, privacyHref }: { block: LegalBlock; privacyHref: string }) {
  if (block.kind === "ul") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.link) {
    return (
      <LinkedParagraph
        text={block.text}
        label={block.link.label}
        href={privacyHref}
      />
    );
  }
  return <p>{block.text}</p>;
}

/** Каркас юридичних сторінок: шапка з логотипом, тіло документа, футер. */
export default function LegalShell({
  lang,
  dict,
  doc,
}: {
  lang: Locale;
  dict: Dictionary;
  doc: LegalDoc;
}) {
  const l = dict.legal;
  const homeHref = localeHref(lang, "/");
  const privacyHref = localeHref(lang, "/privacy");

  return (
    <>
      <main className="legal">
        <div className="container container--narrow">
          <div className="legal__top">
            <Link href={homeHref} className="logo">
              <span className="logo__text">LUME</span>
            </Link>
            <Link href={homeHref} className="legal__back">
              {l.back}
            </Link>
          </div>

          <h1>{doc.title}</h1>
          <p className="legal__date">{doc.updated}</p>

          {doc.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {doc.sections.map((section) => (
            <Fragment key={section.heading}>
              <h2>{section.heading}</h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} privacyHref={privacyHref} />
              ))}
            </Fragment>
          ))}

          <hr />
          {/* ЗАПОВНІТЬ: назва юрособи / ФОП, реєстраційні дані та контактний e-mail */}
          <h2>{l.contactHeading}</h2>
          <p>
            {l.contactName}{" "}
            <span className="fill">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <br />
            {l.contactReg}{" "}
            <span className="fill">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <br />
            {l.contactEmail}{" "}
            <span className="fill">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </p>
        </div>
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </>
  );
}
