"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type WindowTab = "overview" | "case";

type Props = {
  url?: string;
  title: string;
  tabs: readonly WindowTab[];
  active: WindowTab;
  onTab: (t: WindowTab) => void;
  onBack: () => void;
  isPrivate?: boolean;
};

const TAB_LABEL: Record<WindowTab, string> = { overview: "overview", case: "case study" };
const PINK = "text-[#ff69b4]";

// The address shows host and path only. Without a url the window shows the
// project's path inside this site, which is where the reader already is.
export function addressText(url: string | undefined, title: string): string {
  if (!url) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `jaykim.studio/projects/${slug}`;
  }
  return url.replace(/^[a-z]+:\/\//i, "").replace(/\/$/, "");
}

// The close dot from the Safari bar, lit pink and a size up, with an arrow
// and a label that always show, so a reader never has to guess how to get
// back. It takes focus on mount.
function BackControl({ onBack }: { onBack: () => void }) {
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus();
  }, []);
  const dot = "size-3.5 rounded-full border border-[#ff69b4] bg-[#ff69b4]/60 transition-colors group-hover:bg-[#ff69b4] group-focus-visible:bg-[#ff69b4]";
  const label = "font-mono text-[13px] uppercase tracking-[0.2em] text-white/85 transition-colors group-hover:text-white group-focus-visible:text-white";
  return (
    <button ref={backRef} type="button" onClick={onBack} aria-label="Back to projects" className="group flex items-center gap-2.5 self-stretch outline-none">
      <span className={dot} />
      <ArrowLeft aria-hidden size={14} strokeWidth={1.75} className="text-white/70 transition-colors group-hover:text-[#ff69b4] group-focus-visible:text-[#ff69b4]" />
      <span className={label}>Back</span>
    </button>
  );
}

const ADDRESS = "absolute left-1/2 top-1/2 flex w-[min(48%,400px)] -translate-x-1/2 -translate-y-1/2 items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1";
export const PRIVATE_NOTE = "Private repository. The link opens GitHub, which asks for access.";

// With a url the address is a real link. A private repository is still
// linked, and says so, rather than pretending the code is open.
function AddressBar({ url, title, isPrivate }: { url?: string; title: string; isPrivate: boolean }) {
  const text = addressText(url, title);
  if (!url) {
    return (
      <div className={ADDRESS}>
        <Lock aria-hidden size={10} strokeWidth={1.5} className="shrink-0 text-white/40" />
        <span className="truncate font-mono text-[11px] tracking-wide text-white/70">{text}</span>
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={isPrivate ? PRIVATE_NOTE : undefined}
      className={cn(ADDRESS, "group transition-colors hover:border-[#ff69b4]/60 focus-visible:border-[#ff69b4]/60 outline-none")}
    >
      <Lock aria-hidden size={10} strokeWidth={1.5} className="shrink-0 text-white/40" />
      <span className="truncate font-mono text-[11px] tracking-wide text-white/70 transition-colors group-hover:text-white group-focus-visible:text-white">{text}</span>
      {isPrivate && <span className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff69b4]">private</span>}
    </a>
  );
}

function Tab({ tab, active, onTab }: { tab: WindowTab; active: boolean; onTab: (t: WindowTab) => void }) {
  const cls = "self-stretch font-mono text-[11px] uppercase tracking-[0.18em] px-1.5 transition-colors outline-none";
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onTab(tab)}
      className={cn(cls, active ? "text-white" : "text-white/60 hover:text-white focus-visible:text-white")}
    >
      {active && <span className={PINK}>[</span>}
      {TAB_LABEL[tab]}
      {active && <span className={PINK}>]</span>}
    </button>
  );
}

// A dark Safari style title bar: Back at the left, a centred address field
// that links out, and a tab strip under it. Below md the page scrolls the
// window, so the chrome sticks under the persona bar and Back stays in
// reach. Controls stretch to their bar height.
export function WindowChrome({ url, title, tabs, active, onTab, onBack, isPrivate = false }: Props) {
  return (
    <div className="shrink-0 border-b border-white/15 bg-[#0a0a0a] max-md:sticky max-md:top-12 max-md:z-20">
      <div className="relative flex h-10 items-center border-b border-white/15 px-4">
        <BackControl onBack={onBack} />
        <AddressBar url={url} title={title} isPrivate={isPrivate} />
      </div>
      <div role="tablist" aria-label={`${title} tabs`} className="flex h-8 items-center gap-2 px-4">
        {tabs.map((t) => <Tab key={t} tab={t} active={t === active} onTab={onTab} />)}
      </div>
    </div>
  );
}
