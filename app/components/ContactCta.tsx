import Link from "next/link";
import { TELEGRAM_LINK, WHATSAPP_LINK } from "../config";
import type { Dictionary } from "../content/dictionary";
import ChatLink from "./ChatLink";
import { Icon } from "./Icons";
import { DEFAULT_LANG, langPath, type Lang } from "../content/lang";

/** Блок замість форми: замовлення оформлюється у месенджері. */
export default function ContactCta({ dict, lang = DEFAULT_LANG }: { dict: Dictionary["form"]; lang?: Lang }) {
  return (
    <div className="contact">
      <h2 className="contact__title">{dict.contactHeading}</h2>
      <p className="contact__lead">{dict.contactLead}</p>

      <p className="contact__proof">{dict.contactProof}</p>

      <div className="contact__actions">
        <ChatLink href={TELEGRAM_LINK} channel="Telegram" className="btn btn--tg">
          <span className="icon-chip">
            <Icon name="i-tg" />
          </span>
          {dict.telegramCta}
        </ChatLink>
        <ChatLink href={WHATSAPP_LINK} channel="WhatsApp" className="btn btn--wa">
          <span className="icon-chip">
            <Icon name="i-wa" />
          </span>
          {dict.whatsappCta}
        </ChatLink>
      </div>

      <p className="form__note">
        {dict.privacyNoteBefore}
        <Link href={langPath("/privacy", lang)}>{dict.privacyNoteLink}</Link>
      </p>
    </div>
  );
}
