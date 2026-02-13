"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "writing-access";
const PASSWORD = "I love food";

export function WritingGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setAuthorized(true);
    }
    setChecked(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (!checked) return null;

  if (authorized) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
          This article is in progress
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-text-black mb-2">
          Password Required
        </h2>
        <p className="text-sm text-text-mid mb-8">
          Enter the password to view this draft.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            autoFocus
            className="w-full px-4 py-3 border border-border-light bg-white text-sm text-text-black font-mono tracking-wide focus:border-text-black focus-visible:ring-2 focus-visible:ring-accent-green/50 transition-colors"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 font-mono"
            >
              Wrong password.
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 border border-text-black bg-text-black text-white text-sm font-mono tracking-wider uppercase hover:bg-white hover:text-text-black transition-colors"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
}
