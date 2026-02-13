"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const quotes = [
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "It is not that we have a short time to live, but that we waste a great deal of it.", author: "Seneca" },
  { text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "He who fears death will never do anything worthy of a living man.", author: "Seneca" },
  { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
  { text: "Difficulties strengthen the mind as labor does the body.", author: "Seneca" },
  { text: "If it is not right, do not do it. If it is not true, do not say it.", author: "Marcus Aurelius" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "First say to yourself what you would be; then do what you have to do.", author: "Epictetus" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "It does not matter what you bear, but how you bear it.", author: "Seneca" },
  { text: "Think of the life you have lived until now as over and done. Now see what's left and live it properly.", author: "Marcus Aurelius" },
  { text: "Every night before going to sleep, we must ask ourselves: what weakness did I overcome today?", author: "Seneca" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "A gem cannot be polished without friction, nor a man perfected without trials.", author: "Seneca" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche" },
  { text: "The world breaks everyone, and afterward, some are strong at the broken places.", author: "Hemingway" },
  { text: "Winning isn't everything. It's the only thing.", author: "Vince Lombardi" },
  { text: "Hard times create strong men. Strong men create good times.", author: "G. Michael Hopf" },
  { text: "The only easy day was yesterday.", author: "Navy SEALs" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Jim Rohn" },
  { text: "No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.", author: "Buddha" },
  { text: "The more you sweat in training, the less you bleed in combat.", author: "Richard Marcinko" },
  { text: "Be tolerant with others and strict with yourself.", author: "Marcus Aurelius" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "It is a rough road that leads to the heights of greatness.", author: "Seneca" },
  { text: "Only the dead have seen the end of war.", author: "Plato" },
  { text: "Courage is not the absence of fear but the triumph over it.", author: "Nelson Mandela" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee" },
  // Extras for full year coverage — 365 days
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
  { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "He who is brave is free.", author: "Seneca" },
  { text: "What we do now echoes in eternity.", author: "Marcus Aurelius" },
];

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDaysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}

function getQuoteForDay(dayOfYear: number): (typeof quotes)[0] {
  return quotes[dayOfYear % quotes.length];
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function BallisticCalendar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    queueMicrotask(() => setNow(new Date()));
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const dayOfYear = getDayOfYear(now);
  const totalDays = getDaysInYear(now.getFullYear());
  const daysLeft = totalDays - dayOfYear;
  const percentElapsed = (dayOfYear / totalDays) * 100;
  const quote = getQuoteForDay(dayOfYear);

  const weekNum = Math.ceil(dayOfYear / 7);
  const month = MONTHS[now.getMonth()];
  const dayName = DAYS[now.getDay()];
  const dayNum = now.getDate().toString().padStart(2, "0");

  // Generate grid: 12 months, each with blocks for ~30 days
  const monthBlocks = [];
  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(now.getFullYear(), m + 1, 0).getDate();
    const isPast = m < now.getMonth() || (m === now.getMonth() && now.getDate() >= daysInMonth);
    const isCurrent = m === now.getMonth();
    monthBlocks.push({ month: MONTHS[m], days: daysInMonth, isPast, isCurrent });
  }

  return (
    <div className="font-mono text-text-dark">
      {/* Date display */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <motion.div
            className="text-[10px] tracking-[0.3em] uppercase text-text-light mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {dayName} &middot; WEEK {weekNum.toString().padStart(2, "0")}
          </motion.div>
          <motion.div
            className="flex items-baseline gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-4xl md:text-5xl font-bold tracking-tight text-text-black leading-none">
              {dayNum}
            </span>
            <span className="text-lg md:text-xl font-bold tracking-wider text-text-mid">
              {month}
            </span>
            <span className="text-sm text-text-light">
              {now.getFullYear()}
            </span>
          </motion.div>
        </div>
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-[10px] tracking-wider text-text-light uppercase mb-1">
            Days Remaining
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-text-black leading-none">
            {daysLeft}
          </div>
        </motion.div>
      </div>

      {/* Year progress bar */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] tracking-wider text-text-light uppercase">
            Year Progress
          </span>
          <span className="text-[10px] tracking-wider text-text-light">
            {percentElapsed.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-border-light rounded-sm overflow-hidden">
          <motion.div
            className="h-full bg-text-black rounded-sm"
            initial={{ width: 0 }}
            animate={{ width: `${percentElapsed}%` }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </motion.div>

      {/* Month grid - ballistic dots */}
      <motion.div
        className="grid grid-cols-6 gap-x-3 gap-y-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {monthBlocks.map((mb) => {
          const currentDay = mb.isCurrent ? now.getDate() : 0;
          const filledDays = mb.isPast ? mb.days : currentDay;
          return (
            <div key={mb.month}>
              <div className={`text-[8px] tracking-wider mb-1 ${mb.isCurrent ? "text-text-black font-bold" : "text-text-light"}`}>
                {mb.month}
              </div>
              <div className="flex flex-wrap gap-[2px]">
                {Array.from({ length: mb.days }).map((_, d) => (
                  <div
                    key={d}
                    className={`w-[3px] h-[3px] rounded-[1px] ${
                      d < filledDays
                        ? "bg-text-black"
                        : mb.isCurrent && d === filledDays
                          ? "bg-accent-green animate-pulse"
                          : "bg-border-light"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Divider */}
      <div className="border-t border-border-light my-5" />

      {/* Daily quote */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="text-[10px] tracking-[0.2em] uppercase text-text-light mb-3">
          Daily Transmission &middot; Day {dayOfYear}/{totalDays}
        </div>
        <p className="text-sm md:text-base leading-relaxed text-text-dark italic">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-[10px] tracking-wider text-text-light mt-2 uppercase">
          {quote.author}
        </p>
      </motion.div>
    </div>
  );
}
