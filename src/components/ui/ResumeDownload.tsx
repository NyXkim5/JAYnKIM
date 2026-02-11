"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface ResumeDownloadProps {
  variant?: "light" | "dark";
}

export function ResumeDownload({ variant = "dark" }: ResumeDownloadProps) {
  const [status, setStatus] = useState<"idle" | "decrypting" | "done">("idle");
  const [display, setDisplay] = useState("DOWNLOAD RESUME");

  const scrambleChars = "█▓▒░ABCDEFabcdef0123456789";

  const handleClick = useCallback(() => {
    if (status !== "idle") return;
    setStatus("decrypting");

    const target = "DECRYPTING...";
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const text = target
        .split("")
        .map((ch, i) =>
          i < frame * 2
            ? ch
            : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        )
        .join("");
      setDisplay(text);

      if (frame > 8) {
        clearInterval(interval);
        setDisplay("DECRYPTED ✓");
        setStatus("done");

        // Trigger download
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = "/resume.pdf";
          link.download = "Jay_Kim_Resume.pdf";
          link.click();
          // Reset
          setTimeout(() => {
            setDisplay("DOWNLOAD RESUME");
            setStatus("idle");
          }, 2000);
        }, 500);
      }
    }, 100);
  }, [status]);

  const isDark = variant === "dark";

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center gap-3 py-1 transition-colors ${
        isDark ? "text-white/70 hover:text-accent-green" : "text-text-dark hover:text-text-mid"
      }`}
    >
      <span className={`text-[9px] w-4 ${isDark ? "text-white/30" : "text-text-light"}`}>R:</span>
      <span className="text-[10px] md:text-[11px] tracking-wider">
        {display}
      </span>
      {status === "decrypting" ? (
        <motion.span
          className="text-accent-green text-[10px]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          ●
        </motion.span>
      ) : status === "done" ? (
        <span className="text-accent-green text-[10px]">✓</span>
      ) : (
        <motion.span
          className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark ? "text-accent-green/50" : "text-text-mid"
          }`}
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ↗
        </motion.span>
      )}
    </button>
  );
}
