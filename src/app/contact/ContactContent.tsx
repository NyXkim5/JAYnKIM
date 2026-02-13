"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

const SERIF = `"Times New Roman", Georgia, "Noto Serif", serif`;
const MONO = `var(--font-mono), ui-monospace, monospace`;

/* ── Breathing background grid ── */
function BreathingGrid() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: [0.4, 0.65, 0.4] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );
}

/* ── SVG barcode ── */
function Barcode({ width = 180, height = 28 }: { width?: number; height?: number }) {
  const pattern = [2,1,1,3,1,2,1,1,2,1,3,1,1,2,1,1,3,2,1,1,1,2,1,3,1,1,2,1,1,2,3,1,1,2,1,1,1,3,1,2,1,1,2,1];
  let x = 0;
  const bars: { x: number; w: number }[] = [];
  pattern.forEach((w, i) => {
    if (i % 2 === 0) bars.push({ x, w });
    x += w;
  });
  const totalW = x;
  const scale = width / totalW;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x * scale}
          y={0}
          width={Math.max(b.w * scale, 1)}
          height={height}
          fill="#222"
        />
      ))}
    </svg>
  );
}

export default function ContactContent() {
  const tagRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [cordSway, setCordSway] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const norm = (e.clientX - centerX) / (rect.width / 2);
        setCordSway(Math.max(-1, Math.min(1, norm)));
      }
      if (isTouch || !tagRef.current) return;
      const rect = tagRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (rect.width / 2));
      mouseY.set((e.clientY - cy) / (rect.height / 2));
    },
    [isTouch, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setCordSway(0);
  }, [mouseX, mouseY]);

  // Cord sway for the SVG path (wind effect)
  const sway = cordSway * 30;

  return (
    <>
      <Navbar />
      <PageTransition>
        <main
          ref={mainRef}
          className="min-h-screen relative overflow-hidden flex items-center justify-center py-28 bg-white"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <BreathingGrid />

          {/* Perspective wrapper */}
          <div
            className="relative z-10 px-4 w-full flex justify-center"
            style={{ perspective: "1200px" }}
          >
            {/* Entrance pendulum */}
            <motion.div
              initial={{ rotateZ: 12, y: -40, opacity: 0 }}
              animate={{ rotateZ: 0, y: 0, opacity: 1 }}
              transition={{
                rotateZ: { type: "spring", stiffness: 50, damping: 10 },
                y: { type: "spring", stiffness: 50, damping: 12 },
                opacity: { duration: 0.4 },
              }}
              style={{ transformOrigin: "top center" }}
            >
              {/* Idle sway */}
              <motion.div
                animate={{ rotateZ: [-0.6, 0.6, -0.6] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "top center" }}
              >
                {/* 3D tilt */}
                <motion.div
                  ref={tagRef}
                  style={{
                    rotateX: isTouch ? 0 : rotateX,
                    rotateY: isTouch ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  className="w-[300px] sm:w-[340px] relative"
                >
                  {/* ── Cord attached to clip, extending upward ── */}
                  <svg
                    className="absolute pointer-events-none z-[1]"
                    style={{
                      bottom: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      overflow: "visible",
                    }}
                    width="120"
                    height="600"
                    viewBox="0 0 120 600"
                    fill="none"
                  >
                    {/* Shadow */}
                    <path
                      d={`M62,600 Q${62 + sway},300 62,0`}
                      stroke="rgba(0,0,0,0.06)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                      style={{ transition: "d 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
                    />
                    {/* Cord */}
                    <path
                      d={`M60,600 Q${60 + sway},300 60,0`}
                      stroke="#1a1a1a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      style={{ transition: "d 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
                    />
                  </svg>

                  {/* ── Metal clip ── */}
                  <div className="flex justify-center relative z-20 mb-[-12px]">
                    <div style={{ width: 48, height: 34 }}>
                      <div
                        style={{
                          width: 48,
                          height: 26,
                          borderRadius: "5px 5px 0 0",
                          background: "linear-gradient(180deg, #d0d0d0 0%, #a0a0a0 30%, #b8b8b8 60%, #909090 100%)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 5,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "white",
                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.3)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          width: 42,
                          height: 10,
                          margin: "0 auto",
                          background: "linear-gradient(180deg, #aaa 0%, #888 100%)",
                          borderRadius: "0 0 3px 3px",
                          boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
                        }}
                      />
                    </div>
                  </div>

                  {/* ── THICK 3D CARD ── */}
                  {/* Top edge */}
                  <div
                    className="mx-[2px] h-[6px] rounded-t-xl"
                    style={{ background: "linear-gradient(180deg, #222 0%, #111 100%)" }}
                  />

                  {/* Card face */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      backgroundColor: "#f7f6f3",
                      borderLeft: "6px solid #111",
                      borderRight: "6px solid #111",
                      boxShadow: [
                        "0 30px 60px rgba(0,0,0,0.18)",
                        "0 10px 20px rgba(0,0,0,0.12)",
                        "inset 0 1px 0 rgba(255,255,255,0.8)",
                      ].join(", "),
                    }}
                  >
                    {/* Paper texture */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-[0.025]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Edge lighting */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.03) 100%)",
                      }}
                    />

                    {/* ── Military header ── */}
                    <div
                      className="relative px-6 py-2.5 flex items-center justify-between"
                      style={{ backgroundColor: "#111", borderBottom: "2px solid #333" }}
                    >
                      <span
                        className="text-[9px] tracking-[0.3em] font-bold uppercase"
                        style={{ color: "#666", fontFamily: MONO }}
                      >
                        RESTRICTED
                      </span>
                      <span
                        className="text-[9px] tracking-[0.2em]"
                        style={{ color: "#555", fontFamily: MONO }}
                      >
                        LVL-4 // SEC-OPS
                      </span>
                    </div>

                    {/* Red accent line */}
                    <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #c41a1a, #ff4444, #c41a1a)" }} />

                    {/* ── Content ── */}
                    <div className="relative px-7 pt-5 pb-5">
                      {/* Scan lines */}
                      <div className="flex gap-[3px] mb-4 opacity-15">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="h-[1px] flex-1" style={{ backgroundColor: "#111" }} />
                        ))}
                      </div>

                      {/* Serial */}
                      <p
                        className="text-[10px] tracking-[0.3em] mb-3 uppercase"
                        style={{ color: "#aaa", fontFamily: MONO }}
                      >
                        ID: JK-2026-SEC-0091
                      </p>

                      {/* Name */}
                      <h2
                        className="text-[32px] font-bold tracking-[0.02em] leading-none mb-1"
                        style={{ color: "#111", fontFamily: SERIF }}
                      >
                        Jay Kim
                      </h2>

                      {/* Title */}
                      <p
                        className="text-[10px] tracking-[0.2em] mb-5 uppercase"
                        style={{ color: "#888", fontFamily: MONO }}
                      >
                        Software Engineer // AI-ML
                      </p>

                      {/* Divider */}
                      <div className="flex items-center gap-2 mb-5">
                        <div className="h-[1px] flex-1" style={{ backgroundColor: "#ddd" }} />
                        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "#ccc" }} />
                        <div className="h-[1px] flex-1" style={{ backgroundColor: "#ddd" }} />
                      </div>

                      {/* Contact rows */}
                      <div className="space-y-1.5 mb-5">
                        <a
                          href="mailto:joonhyuknkim@gmail.com"
                          className="group flex items-center gap-3 py-2 px-3 -mx-3 rounded transition-colors hover:bg-black/[0.03]"
                        >
                          <span className="text-[10px] w-14 shrink-0 tracking-[0.2em] font-bold uppercase" style={{ color: "#bbb", fontFamily: MONO }}>
                            Email
                          </span>
                          <span className="text-[13px] group-hover:text-black transition-colors" style={{ color: "#333", fontFamily: SERIF }}>
                            joonhyuknkim@gmail.com
                          </span>
                          <span className="ml-auto text-[10px] opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "#333" }}>↗</span>
                        </a>

                        <a
                          href="https://github.com/NyXkim5"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 py-2 px-3 -mx-3 rounded transition-colors hover:bg-black/[0.03]"
                        >
                          <span className="text-[10px] w-14 shrink-0 tracking-[0.2em] font-bold uppercase" style={{ color: "#bbb", fontFamily: MONO }}>
                            GitHub
                          </span>
                          <span className="text-[13px] group-hover:text-black transition-colors" style={{ color: "#333", fontFamily: SERIF }}>
                            github.com/NyXkim5
                          </span>
                          <span className="ml-auto text-[10px] opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "#333" }}>↗</span>
                        </a>

                        <a
                          href="https://www.linkedin.com/in/joonhyuknkim/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 py-2 px-3 -mx-3 rounded transition-colors hover:bg-black/[0.03]"
                        >
                          <span className="text-[10px] w-14 shrink-0 tracking-[0.2em] font-bold uppercase" style={{ color: "#bbb", fontFamily: MONO }}>
                            LinkedIn
                          </span>
                          <span className="text-[13px] group-hover:text-black transition-colors" style={{ color: "#333", fontFamily: SERIF }}>
                            linkedin.com/in/joonhyuknkim
                          </span>
                          <span className="ml-auto text-[10px] opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "#333" }}>↗</span>
                        </a>

                        <div className="flex items-center gap-3 py-2 px-3 -mx-3">
                          <span className="text-[10px] w-14 shrink-0 tracking-[0.2em] font-bold uppercase" style={{ color: "#bbb", fontFamily: MONO }}>
                            Sector
                          </span>
                          <span className="text-[13px]" style={{ color: "#555", fontFamily: SERIF }}>
                            Orange County, CA
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-[1px] flex-1" style={{ backgroundColor: "#ddd" }} />
                        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: "#ccc" }} />
                        <div className="h-[1px] flex-1" style={{ backgroundColor: "#ddd" }} />
                      </div>

                      {/* Resume */}
                      <a
                        href="/resume.pdf"
                        download="Jay_Kim_Resume.pdf"
                        className="group flex items-center justify-center gap-2.5 py-3 px-4 rounded transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: "#111", color: "#eee", border: "1px solid #333" }}
                      >
                        <span className="text-[10px] tracking-[0.2em] font-bold" style={{ fontFamily: MONO }}>
                          DOWNLOAD RESUME
                        </span>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="opacity-50 group-hover:opacity-100 transition-opacity">
                          <path d="M6 2v6m0 0L3.5 5.5M6 8l2.5-2.5M2 10h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>

                    {/* ── Barcode strip ── */}
                    <div
                      className="px-6 py-3 flex items-end justify-between gap-4"
                      style={{ borderTop: "1px solid #e5e3df", backgroundColor: "rgba(0,0,0,0.01)" }}
                    >
                      <div>
                        <Barcode width={140} height={22} />
                        <p className="text-[9px] tracking-[0.15em] mt-1" style={{ color: "#bbb", fontFamily: MONO }}>
                          JK-0091-AUTH-2026
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] tracking-[0.15em]" style={{ color: "#ccc", fontFamily: MONO }}>
                          33.68°N 117.82°W
                        </p>
                        <p className="text-[9px] tracking-[0.15em]" style={{ color: "#ccc", fontFamily: MONO }}>
                          CLEARANCE VALID
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom 3D edges */}
                  <div
                    className="mx-[2px] h-[6px]"
                    style={{
                      background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
                      borderRadius: "0 0 8px 8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    }}
                  />
                  <div
                    className="mx-[6px] h-[3px]"
                    style={{
                      background: "#050505",
                      borderRadius: "0 0 6px 6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
