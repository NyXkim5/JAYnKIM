"use client";

import { useEffect, useState } from "react";

const greetings = [
  { text: "Hello world.", lang: "EN" },
  { text: "안녕하세요.", lang: "KR" },
  { text: "こんにちは.", lang: "JP" },
  { text: "Hola mundo.", lang: "ES" },
  { text: "Bonjour le monde.", lang: "FR" },
  { text: "Hallo Welt.", lang: "DE" },
  { text: "你好世界.", lang: "ZH" },
  { text: "Ciao mondo.", lang: "IT" },
  { text: "Olá mundo.", lang: "PT" },
  { text: "Merhaba dünya.", lang: "TR" },
];

/**
 * Cycles "Hello world." through different languages with typewriter effect.
 * Types out → pauses → deletes → types next language.
 */
export function HelloWorldTyper({ className = "" }: { className?: string }) {
  const [display, setDisplay] = useState("");
  const [langIndex, setLangIndex] = useState(0);
  const [langLabel, setLangLabel] = useState("EN");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const [charIndex, setCharIndex] = useState(0);

  const current = greetings[langIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (charIndex <= current.text.length) {
        timer = setTimeout(() => {
          setDisplay(current.text.slice(0, charIndex));
          setLangLabel(current.lang);
          setCharIndex(charIndex + 1);
        }, 60 + Math.random() * 40);
      } else {
        queueMicrotask(() => setPhase("pause"));
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => {
        setPhase("deleting");
      }, 2200);
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex(charIndex - 1);
          setDisplay(current.text.slice(0, charIndex - 1));
        }, 30);
      } else {
        const next = (langIndex + 1) % greetings.length;
        queueMicrotask(() => {
          setLangIndex(next);
          setPhase("typing");
          setCharIndex(0);
          setDisplay("");
        });
      }
    }

    return () => clearTimeout(timer);
  }, [phase, charIndex, langIndex, current]);

  return (
    <span className={className}>
      <span className="relative">
        {display}
        <span className="animate-blink ml-0.5 text-text-light">|</span>
      </span>
      <span className="ml-3 font-mono text-[10px] tracking-wider text-text-light align-middle">
        [{langLabel}]
      </span>
    </span>
  );
}
