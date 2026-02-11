"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const tabs = ["Cafes", "Food"] as const;
type Tab = (typeof tabs)[number];

interface Rec {
  id: string;
  name: string;
  note: string;
  location: string;
  price: string;
  tag?: string;
  starred?: boolean;
  color: "yellow" | "pink" | "blue" | "green" | "orange" | "purple";
  size: "small" | "medium" | "large";
}

const sizeStyles: Record<string, { width: string; padding: string; titleSize: string; noteSize: string }> = {
  small: { width: "w-36", padding: "p-3", titleSize: "text-xs", noteSize: "text-[10px]" },
  medium: { width: "w-44", padding: "p-4", titleSize: "text-sm", noteSize: "text-[11px]" },
  large: { width: "w-52", padding: "p-5", titleSize: "text-base", noteSize: "text-xs" },
};

const cafeRecs: Rec[] = [
  { id: "c1", name: "Ippodo Tea", note: "ceremonial grade matcha from kyoto. the real deal.", location: "Costa Mesa", price: "$$", tag: "matcha", starred: true, color: "green", size: "large" },
  { id: "c2", name: "Daydream", note: "aesthetic matcha bar, hojicha is underrated", location: "Irvine", price: "$$", tag: "matcha", color: "green", size: "medium" },
  { id: "c3", name: "Portola Coffee Lab", note: "third wave everything. pour-overs are insane", location: "Costa Mesa", price: "$$", tag: "coffee", starred: true, color: "orange", size: "large" },
  { id: "c4", name: "Archive", note: "minimalist gallery vibes. matcha is clean", location: "Los Angeles", price: "$$", tag: "matcha", starred: true, color: "green", size: "medium" },
  { id: "c5", name: "Hidden House Coffee", note: "hidden gem in san juan. worth the drive", location: "San Juan Cap.", price: "$", tag: "coffee", starred: true, color: "yellow", size: "large" },
  { id: "c6", name: "Cafe Kindred", note: "cozy spot, oat matcha latte is the move", location: "Laguna Beach", price: "$", tag: "matcha", color: "blue", size: "small" },
  { id: "c7", name: "Vitality & Mischief", note: "experimental single-origins. nerdy", location: "Newport Beach", price: "$$", tag: "coffee", color: "orange", size: "medium" },
  { id: "c8", name: "Sidecar Doughnuts", note: "matcha latte + huckleberry donut", location: "Costa Mesa", price: "$", tag: "bakery", color: "pink", size: "small" },
  { id: "c9", name: "Kit Coffee", note: "surf vibes, solid espresso", location: "Costa Mesa", price: "$", tag: "coffee", color: "yellow", size: "small" },
  { id: "c10", name: "Neat Coffee", note: "minimalist. espresso is dialed.", location: "Corona del Mar", price: "$", tag: "coffee", color: "orange", size: "medium" },
  { id: "c11", name: "Kei Concepts", note: "vietnamese-inspired drinks", location: "Santa Ana", price: "$", tag: "fusion", color: "purple", size: "small" },
  { id: "c12", name: "Daydrift", note: "chill vibes, matcha is solid", location: "Los Angeles", price: "$$", tag: "matcha", color: "blue", size: "medium" },
];

const foodRecs: Rec[] = [
  { id: "f1", name: "Taco Maria", note: "elevated mexican. michelin recognized", location: "Costa Mesa", price: "$$$", tag: "fine dining", starred: true, color: "orange", size: "large" },
  { id: "f2", name: "MOSU", note: "korean kaiseki. art on a plate", location: "Irvine", price: "$$$", tag: "korean", starred: true, color: "purple", size: "large" },
  { id: "f3", name: "Marufuku Ramen", note: "hakata-style tonkotsu. perfect", location: "Irvine", price: "$$", tag: "ramen", starred: true, color: "yellow", size: "medium" },
  { id: "f4", name: "Brodard", note: "nem nuong cuon. legendary", location: "Garden Grove", price: "$", tag: "vietnamese", starred: true, color: "green", size: "large" },
  { id: "f5", name: "Nep Cafe", note: "modern viet. plating is gorgeous", location: "Fountain Valley", price: "$$", tag: "vietnamese", color: "green", size: "medium" },
  { id: "f6", name: "Ospi", note: "italian coastal. handmade pasta", location: "Newport Beach", price: "$$$", tag: "italian", color: "pink", size: "medium" },
  { id: "f7", name: "Chubby Cattle", note: "hot pot + wagyu. always a move", location: "Irvine", price: "$$$", tag: "hot pot", color: "orange", size: "small" },
  { id: "f8", name: "Bear Flag Fish Co", note: "fresh poke, fish tacos", location: "Newport Beach", price: "$", tag: "seafood", color: "blue", size: "small" },
  { id: "f9", name: "85C Bakery", note: "taiwanese bakery. sea salt coffee", location: "Irvine", price: "$", tag: "bakery", color: "pink", size: "small" },
  { id: "f10", name: "Din Tai Fung", note: "soup dumplings. consistently perfect", location: "Costa Mesa", price: "$$", tag: "taiwanese", color: "yellow", size: "medium" },
];

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

        <div className="flex items-center justify-between text-[9px] text-neutral-600">
          <span className="uppercase tracking-wide font-medium">{rec.tag}</span>
          <span>{rec.location}</span>
        </div>

        <div className="mt-2 pt-2 border-t border-black/10 flex justify-between text-[9px] text-neutral-500">
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

export default function RecsPage() {
  const [tab, setTab] = useState<Tab>("Cafes");
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; rotate: number }>>({});
  const items = recMap[tab];

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
      <main className="pt-14 min-h-screen bg-neutral-100 overflow-hidden">
          {/* Whiteboard */}
          <div
            className="mx-4 md:mx-8 my-6 bg-white rounded-xl overflow-hidden"
            style={{
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
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
                    drag anything around
                  </p>
                </div>

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
          </div>
        </main>
      <Footer />
    </>
  );
}
