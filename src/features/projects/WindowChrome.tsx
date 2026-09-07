"use client";

import { useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type WindowTab = "overview" | "case";

type Props = {
  url?: string;
  title: string;
  tabs: readonly WindowTab[];
  active: WindowTab;
  onTab: (t: WindowTab) => void;
  onBack: () => void;
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

// Proportions follow the magicui Safari SVG: three 12 px dots on a 20 px
// pitch at the left, the address field centred at just over half the width.
function TrafficLights({ onBack }: { onBack: () => void }) {
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus();
  }, []);
  const dot = "size-3 rounded-full border border-white/25";
  const hot = "group-hover:border-[#ff69b4] group-hover:bg-[#ff69b4] group-focus-visible:border-[#ff69b4] group-focus-visible:bg-[#ff69b4]";
  const label = "ml-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-0 transition-opacity group-focus-visible:opacity-100 group-hover:opacity-100";
  // The whole cluster is the control so the target is wider than one dot.
  // Only the left dot lights up, which is the one that closes a window.
  return (
    <button ref={backRef} type="button" onClick={onBack} aria-label="Back to projects" className="group flex items-center gap-2 outline-none">
      <span className={cn(dot, "bg-white/10 transition-colors", hot)} />
      <span className={cn(dot, "bg-white/5")} />
      <span className={cn(dot, "bg-white/5")} />
      <span className={cn(label, PINK)}>back</span>
    </button>
  );
}

function AddressBar({ url, title }: { url?: string; title: string }) {
  return (
    <div className="absolute left-1/2 top-1/2 flex w-[min(56%,400px)] -translate-x-1/2 -translate-y-1/2 items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-1">
      <Lock aria-hidden size={10} strokeWidth={1.5} className="shrink-0 text-white/40" />
      <span className="truncate font-mono text-[11px] tracking-wide text-white/70">{addressText(url, title)}</span>
    </div>
  );
}

function Tab({ tab, active, onTab }: { tab: WindowTab; active: boolean; onTab: (t: WindowTab) => void }) {
  const cls = "font-mono text-[11px] uppercase tracking-[0.18em] px-1.5 py-0.5 transition-colors outline-none";
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

// A dark Safari style title bar: traffic lights, a centred address field, and
// a tab strip under it. The left dot closes the window and takes focus.
export function WindowChrome({ url, title, tabs, active, onTab, onBack }: Props) {
  return (
    <div className="shrink-0 border-b border-white/15 bg-[#0a0a0a]">
      <div className="relative flex h-10 items-center border-b border-white/15 px-4">
        <TrafficLights onBack={onBack} />
        <AddressBar url={url} title={title} />
      </div>
      <div role="tablist" aria-label={`${title} tabs`} className="flex h-8 items-center gap-2 px-4">
        {tabs.map((t) => <Tab key={t} tab={t} active={t === active} onTab={onTab} />)}
      </div>
    </div>
  );
}
