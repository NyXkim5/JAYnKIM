// Builds the mailto link the email popup hands to the visitor's mail client.
// There is no server behind it: the message never leaves their machine until
// they press send in their own app.

export type Draft = { from: string; subject: string; message: string };

export function mailtoHref(to: string, draft: Draft): string {
  const subject = draft.subject.trim() || "Hello from jaykim.studio";
  const signature = draft.from.trim() ? `\n\n${draft.from.trim()}` : "";
  const body = `${draft.message.trim()}${signature}`;
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail clients read literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}
