"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";
import { cafeRecs, foodRecs, type Rec } from "@/data/recs";

const tabs = ["Cafes", "Food"] as const;
type Tab = (typeof tabs)[number];

const sizeStyles: Record<string, { width: string; padding: string; titleSize: string; noteSize: string }> = {
  small: { width: "w-28 sm:w-36", padding: "p-2.5 sm:p-3", titleSize: "text-[11px] sm:text-xs", noteSize: "text-[10px] sm:text-[10px]" },
  medium: { width: "w-32 sm:w-44", padding: "p-3 sm:p-4", titleSize: "text-xs sm:text-sm", noteSize: "text-[10px] sm:text-[11px]" },
  large: { width: "w-36 sm:w-52", padding: "p-3.5 sm:p-5", titleSize: "text-sm sm:text-base", noteSize: "text-[10px] sm:text-xs" },
};

const recMap: Record<Tab, Rec[]> = {
  Cafes: cafeRecs,
  Food: foodRecs,
};

const colorStyles: Record<string, string> = {
  yellow: "bg-yellow-200",
  pink: "bg-pink-200",
  blue: "bg-sky-200",
  green: "bg-emerald-200",
  orange: "bg-orange-200",
  purple: "bg-violet-200",
};

// Generate random positions for notes
function generatePositions(count: number, seed: number) {
  const positions: { x: number; y: number; rotate: number }[] = [];
  const cols = 5;
  const cellWidth = 100 / cols;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Add randomness within grid cell
    const randomX = (seed * (i + 1) * 13) % 40 - 20;
    const randomY = (seed * (i + 1) * 17) % 30 - 15;
    const randomRotate = ((seed * (i + 1) * 7) % 16) - 8;

    positions.push({
      x: col * cellWidth + cellWidth / 2 + randomX / 5,
      y: row * 220 + 20 + randomY,
      rotate: randomRotate,
    });
  }
  return positions;
}

function StickyNote({
  rec,
  position,
  onDragEnd,
}: {
  rec: Rec;
  position: { x: number; y: number; rotate: number };
  onDragEnd: () => void;
}) {
  const size = sizeStyles[rec.size];

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, scale: 0.8, rotate: position.rotate }}
      animate={{ opacity: 1, scale: 1, rotate: position.rotate }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 50 }}
      whileDrag={{ scale: 1.15, rotate: 0, zIndex: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing select-none",
        size.width,
        colorStyles[rec.color]
      )}
      style={{
        left: `${position.x}%`,
        top: position.y,
        boxShadow: "4px 4px 15px rgba(0,0,0,0.2), 2px 2px 6px rgba(0,0,0,0.1)",
        transformOrigin: "center center",
      }}
    >
      {/* Sticky note top fold effect */}
      <div
        className="absolute -top-1 left-0 right-0 h-3 opacity-20"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
        }}
      />

      {/* Content */}
      <div className={cn(size.padding, "pt-5")}>
        {/* Star */}
        {rec.starred && (
          <span className="absolute top-2 right-2 text-sm">★</span>
        )}

        <h3 className={cn(size.titleSize, "font-bold text-neutral-800 leading-tight mb-2 pr-4")}>
          {rec.name}
        </h3>

        <p className={cn(size.noteSize, "text-neutral-700 leading-relaxed mb-3")} style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          {rec.note}
        </p>

        <div className="flex items-center justify-between text-[10px] text-neutral-600">
          <span className="uppercase tracking-wide font-medium">{rec.tag}</span>
          <span>{rec.location}</span>
        </div>

        <div className="mt-2 pt-2 border-t border-black/10 flex justify-between text-[10px] text-neutral-500">
          <span>{rec.price}</span>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(rec.name + " " + rec.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-800 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            maps ↗
          </a>
        </div>
      </div>

      {/* Bottom curl effect */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6"
        style={{
          background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.05) 50%)`,
        }}
      />
    </motion.div>
  );
}

// Decorative emojis - bigger sizes
const decorativeEmojis = [
  { id: "e1", emoji: "🍵", size: 56, x: 5, y: 50 },
  { id: "e2", emoji: "☕", size: 48, x: 88, y: 120 },
  { id: "e3", emoji: "🍜", size: 64, x: 75, y: 380 },
  { id: "e4", emoji: "🍣", size: 52, x: 15, y: 320 },
  { id: "e5", emoji: "🧋", size: 44, x: 92, y: 250 },
  { id: "e6", emoji: "🥐", size: 48, x: 3, y: 180 },
  { id: "e7", emoji: "🍡", size: 40, x: 82, y: 30 },
  { id: "e8", emoji: "🥟", size: 54, x: 60, y: 450 },
  { id: "e9", emoji: "🍰", size: 42, x: 25, y: 420 },
  { id: "e10", emoji: "🍙", size: 46, x: 95, y: 380 },
  { id: "e11", emoji: "🥗", size: 50, x: 8, y: 480 },
  { id: "e12", emoji: "🧁", size: 44, x: 70, y: 80 },
  { id: "e13", emoji: "🍵", size: 38, x: 45, y: 520 },
  { id: "e14", emoji: "🍕", size: 58, x: 90, y: 500 },
];

function DraggableEmoji({ emoji, size, initialX, initialY, index }: { emoji: string; size: number; initialX: number; initialY: number; index: number }) {
  const rotation = (initialX * initialY) % 30 - 15;
  const bobDuration = 2 + (index % 3) * 0.5; // Vary duration between emojis
  const bobDelay = index * 0.2;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: rotation,
        y: [0, -12, 0],
      }}
      whileHover={{ scale: 1.3 }}
      whileDrag={{ scale: 1.4, zIndex: 100 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        y: {
          duration: bobDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: bobDelay,
        }
      }}
      className="absolute cursor-grab active:cursor-grabbing select-none z-10"
      style={{
        left: `${initialX}%`,
        top: initialY,
        fontSize: size,
        filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.2))",
      }}
    >
      {emoji}
    </motion.div>
  );
}

type View = "board" | "list";

export default function MatchaContent() {
  const [tab, setTab] = useState<Tab>("Cafes");
  const [view, setView] = useState<View>("board");
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; rotate: number }>>({});
  const items = recMap[tab];

  // Default to list view on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setView("list");
  }, []);

  // Generate initial positions when tab changes
  useEffect(() => {
    const seed = tab === "Cafes" ? 42 : 73;
    const generated = generatePositions(items.length, seed);
    const posMap: Record<string, { x: number; y: number; rotate: number }> = {};
    items.forEach((item, i) => {
      posMap[item.id] = generated[i];
    });
    setPositions(posMap);
  }, [tab, items]);

  const handleDragEnd = () => {
    // Could save position to localStorage here for persistence
  };

  const rows = Math.ceil(items.length / 5);
  const boardHeight = rows * 220 + 100;

  return (
    <>
      <Navbar />
      <PageTransition>
      <main className="pt-16 min-h-screen bg-neutral-100 overflow-hidden">
          {/* Whiteboard */}
          <div
            className="mx-4 md:mx-8 my-6 rounded-xl overflow-hidden"
            style={{
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
              backgroundImage: "url('/paper-texture.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Header */}
            <div className="px-6 md:px-10 pt-8 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-800 mb-1">
                    my spots
                  </h1>
                  <p className="text-neutral-400 text-xs">
                    {view === "board" ? "drag anything around" : `${items.length} spots`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <button
                    onClick={() => setView(view === "board" ? "list" : "board")}
                    className="p-2 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                    aria-label={`Switch to ${view === "board" ? "list" : "board"} view`}
                    title={`Switch to ${view === "board" ? "list" : "board"} view`}
                  >
                    {view === "board" ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="2" y1="4" x2="14" y2="4" />
                        <line x1="2" y1="8" x2="14" y2="8" />
                        <line x1="2" y1="12" x2="14" y2="12" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="5" height="5" rx="1" />
                        <rect x="9" y="2" width="5" height="5" rx="1" />
                        <rect x="2" y="9" width="5" height="5" rx="1" />
                        <rect x="9" y="9" width="5" height="5" rx="1" />
                      </svg>
                    )}
                  </button>

                  {/* Tabs */}
                  <div className="flex gap-2">
                    {tabs.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium transition-all rounded-full",
                          tab === t
                            ? "bg-neutral-800 text-white"
                            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {view === "board" ? (
              <>
                {/* Board area with sticky notes and emojis */}
                <div
                  className="relative"
                  style={{ minHeight: boardHeight }}
                >
                  {/* Decorative emojis */}
                  {decorativeEmojis.map((e, i) => (
                    <DraggableEmoji
                      key={e.id}
                      emoji={e.emoji}
                      size={e.size}
                      initialX={e.x}
                      initialY={e.y}
                      index={i}
                    />
                  ))}

                  {/* Sticky notes */}
                  {items.map((rec) => (
                    positions[rec.id] && (
                      <StickyNote
                        key={rec.id}
                        rec={rec}
                        position={positions[rec.id]}
                        onDragEnd={handleDragEnd}
                      />
                    )
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 md:px-10 py-4">
                  <p className="text-[10px] text-neutral-400">
                    ★ favorites
                  </p>
                </div>
              </>
            ) : (
              /* List view */
              <div className="px-6 md:px-10 pb-8">
                <div className="divide-y divide-neutral-200">
                  {items.map((rec, i) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-4 py-4 group"
                    >
                      {/* Color dot */}
                      <span className={cn(
                        "mt-1.5 w-3 h-3 rounded-full shrink-0",
                        colorStyles[rec.color]
                      )} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-neutral-800">
                            {rec.name}
                          </h3>
                          {rec.starred && <span className="text-xs">★</span>}
                          {rec.tag && (
                            <span className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium">
                              {rec.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                          {rec.note}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 shrink-0 text-[11px] text-neutral-400">
                        <span>{rec.location}</span>
                        <span>{rec.price}</span>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(rec.name + " " + rec.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-neutral-800 transition-colors"
                        >
                          maps ↗
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[10px] text-neutral-400 mt-4">
                  ★ favorites
                </p>
              </div>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
