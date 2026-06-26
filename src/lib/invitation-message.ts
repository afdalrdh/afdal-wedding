import type { InvitationRecord } from "./wedding-types";

export const DEFAULT_WHATSAPP_MESSAGE = `Assalamu'alaikum Wr. Wb.

Kepada Yth.
{{nama}}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Buka undangan:
{{link}}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih.`;

const NAME_PLACEHOLDERS = /\{\{\s*(nama|nama_undangan|guest_name)\s*\}\}/gi;
const LINK_PLACEHOLDERS =
  /\{\{\s*(link|link_undangan|invitation_link)\s*\}\}/gi;

function hasPlaceholder(template: string, matcher: RegExp) {
  matcher.lastIndex = 0;
  const found = matcher.test(template);
  matcher.lastIndex = 0;
  return found;
}

function renderMessageTemplate(template: string, guestName: string, link: string) {
  const hasName = hasPlaceholder(template, NAME_PLACEHOLDERS);
  const hasLink = hasPlaceholder(template, LINK_PLACEHOLDERS);

  if (!hasName && !hasLink) {
    return `Kepada Yth.
${guestName}

${template.trim()}

Buka undangan:
${link}

Terima kasih.`;
  }

  let message = template
    .replace(NAME_PLACEHOLDERS, guestName)
    .replace(LINK_PLACEHOLDERS, link)
    .trim();

  if (!hasName) {
    message = `Kepada Yth.\n${guestName}\n\n${message}`.trim();
  }

  if (!hasLink) {
    message = `${message}\n\nBuka undangan:\n${link}`;
  }

  return message;
}

export function buildInvitationShareText(
  invitation: Pick<InvitationRecord, "guestName" | "customMessage">,
  link: string,
  defaultMessage = DEFAULT_WHATSAPP_MESSAGE,
) {
  const message = invitation.customMessage?.trim() || defaultMessage;

  return renderMessageTemplate(message, invitation.guestName, link);
}
