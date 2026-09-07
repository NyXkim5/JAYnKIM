"use client";

import { useEffect, useId, useState } from "react";
import { EMAIL } from "@/data/contact";
import { mailtoHref, type Draft } from "./mailto";

const MONO = "font-mono text-[11px] uppercase tracking-[0.18em]";
const FIELD = "w-full border border-white/20 bg-transparent px-3 py-2 text-[15px] leading-relaxed text-white outline-none focus:border-[#ff69b4]";
const TIMES = { fontFamily: '"Times New Roman", Times, serif' } as const;
const EMPTY: Draft = { from: "", subject: "", message: "" };

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        close();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [open, close]);
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className={`${MONO} text-white/55`}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

// The composer. Nothing is sent from here: Send hands the draft to the
// visitor's own mail client through a mailto link, addressed to Jay.
function Composer({ draft, onChange, onClose }: { draft: Draft; onChange: (d: Draft) => void; onClose: () => void }) {
  const id = useId();
  const set = (key: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...draft, [key]: e.target.value });
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 px-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="w-full max-w-md border border-white/15 bg-[#0a0a0a] p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p id={`${id}-title`} className={`${MONO} text-white/55`}>
          Email <span className="text-white">{EMAIL}</span>
        </p>
        <div className="mt-5 space-y-4">
          <Field id={`${id}-from`} label="Your name">
            <input id={`${id}-from`} value={draft.from} onChange={set("from")} className={FIELD} style={TIMES} autoComplete="name" />
          </Field>
          <Field id={`${id}-subject`} label="Subject">
            <input id={`${id}-subject`} value={draft.subject} onChange={set("subject")} className={FIELD} style={TIMES} />
          </Field>
          <Field id={`${id}-message`} label="Message">
            <textarea id={`${id}-message`} value={draft.message} onChange={set("message")} rows={5} className={`${FIELD} resize-y`} style={TIMES} />
          </Field>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={onClose} className={`${MONO} text-white/55 hover:text-white`}>
            Close
          </button>
          <a href={mailtoHref(EMAIL, draft)} onClick={onClose} className={`${MONO} border border-[#ff69b4] px-4 py-2 text-[#ff69b4] hover:bg-[#ff69b4] hover:text-[#0a0a0a]`}>
            Send from your mail app
          </a>
        </div>
      </div>
    </div>
  );
}

// A mono "email" button that opens the composer over the page.
export function EmailPopup({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const close = () => setOpen(false);
  useEscape(open, close);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} className={className}>
        email
      </button>
      {open && <Composer draft={draft} onChange={setDraft} onClose={close} />}
    </>
  );
}
