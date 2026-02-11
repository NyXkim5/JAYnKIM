"use client";

import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.3, duration: 1.5, ease: "easeInOut" as const },
      opacity: { delay: i * 0.3, duration: 0.3 },
    },
  }),
};

/** Animated bowl with chopsticks — line art, b&w */
export function BowlAnimation() {
  return (
    <motion.svg
      width="120"
      height="100"
      viewBox="0 0 120 100"
      fill="none"
      initial="hidden"
      animate="visible"
      className="text-text-light"
    >
      {/* Bowl */}
      <motion.path
        d="M20 50 Q20 80 60 80 Q100 80 100 50"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={0}
      />
      {/* Bowl rim */}
      <motion.path
        d="M15 50 H105"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={0.5}
      />
      {/* Chopstick 1 */}
      <motion.line
        x1="45" y1="15" x2="55" y2="48"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={1}
      />
      {/* Chopstick 2 */}
      <motion.line
        x1="55" y1="12" x2="65" y2="48"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={1.2}
      />
      {/* Steam lines */}
      <motion.path
        d="M40 42 Q42 35 40 28"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: [0, 0.4, 0], y: [0, -4, -8] }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      />
      <motion.path
        d="M70 42 Q72 34 70 26"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: [0, 0.4, 0], y: [0, -4, -8] }}
        transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
      />
      <motion.path
        d="M55 40 Q57 32 55 24"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: [0, 0.4, 0], y: [0, -4, -8] }}
        transition={{ duration: 3, repeat: Infinity, delay: 3 }}
      />
    </motion.svg>
  );
}

/** Animated coffee/matcha cup — line art, b&w */
export function CupAnimation() {
  return (
    <motion.svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      initial="hidden"
      animate="visible"
      className="text-text-light"
    >
      {/* Cup body */}
      <motion.path
        d="M25 40 L30 80 H70 L75 40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0}
      />
      {/* Cup rim */}
      <motion.path
        d="M22 40 H78"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={0.5}
      />
      {/* Handle */}
      <motion.path
        d="M75 48 Q88 48 88 58 Q88 68 75 68"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={1}
      />
      {/* Saucer */}
      <motion.path
        d="M18 82 Q50 90 82 82"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={1.5}
      />
      {/* Steam */}
      <motion.path
        d="M40 35 Q42 25 38 18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: [0, 0.35, 0], y: [0, -3, -6] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
      />
      <motion.path
        d="M50 33 Q52 22 48 14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: [0, 0.35, 0], y: [0, -3, -6] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 2.8 }}
      />
      <motion.path
        d="M60 35 Q62 25 58 18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: [0, 0.35, 0], y: [0, -3, -6] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 3.3 }}
      />
    </motion.svg>
  );
}

/** Animated whisk/chasen for matcha — line art, b&w */
export function WhiskAnimation() {
  return (
    <motion.svg
      width="80"
      height="100"
      viewBox="0 0 80 100"
      fill="none"
      initial="hidden"
      animate="visible"
      className="text-text-light"
    >
      {/* Handle */}
      <motion.rect
        x="35" y="5" width="10" height="35" rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        variants={draw}
        custom={0}
      />
      {/* Whisk tines */}
      {[-15, -10, -5, 0, 5, 10, 15].map((offset, i) => (
        <motion.path
          key={i}
          d={`M40 40 Q${40 + offset} 60 ${40 + offset * 1.8} 85`}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          variants={draw}
          custom={0.5 + i * 0.1}
        />
      ))}
      {/* Whisk motion — gentle rocking */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "40px 40px" }}
      />
    </motion.svg>
  );
}

/** Animated knife cutting — line art, b&w */
export function KnifeAnimation() {
  return (
    <motion.svg
      width="100"
      height="80"
      viewBox="0 0 100 80"
      fill="none"
      initial="hidden"
      animate="visible"
      className="text-text-light"
    >
      {/* Cutting board */}
      <motion.rect
        x="10" y="50" width="80" height="8" rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        variants={draw}
        custom={0}
      />
      {/* Knife blade */}
      <motion.g
        animate={{ rotate: [0, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
        style={{ transformOrigin: "60px 48px" }}
      >
        <motion.path
          d="M60 48 L60 15 Q60 10 55 12 L30 48 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          variants={draw}
          custom={0.5}
        />
        {/* Knife handle */}
        <motion.path
          d="M60 48 L80 48 Q85 48 85 44 L85 40 Q85 36 80 36 L60 36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          variants={draw}
          custom={1}
        />
      </motion.g>
      {/* Food bits */}
      <motion.circle cx="25" cy="52" r="2" stroke="currentColor" strokeWidth="1" variants={draw} custom={1.5} />
      <motion.circle cx="35" cy="53" r="1.5" stroke="currentColor" strokeWidth="1" variants={draw} custom={1.7} />
      <motion.circle cx="45" cy="52" r="2" stroke="currentColor" strokeWidth="1" variants={draw} custom={1.9} />
    </motion.svg>
  );
}

/** Small plate illustration */
export function PlateAnimation() {
  return (
    <motion.svg
      width="100"
      height="60"
      viewBox="0 0 100 60"
      fill="none"
      initial="hidden"
      animate="visible"
      className="text-text-light"
    >
      {/* Plate ellipse */}
      <motion.ellipse
        cx="50" cy="40" rx="40" ry="12"
        stroke="currentColor"
        strokeWidth="1.5"
        variants={draw}
        custom={0}
      />
      {/* Inner ring */}
      <motion.ellipse
        cx="50" cy="38" rx="28" ry="8"
        stroke="currentColor"
        strokeWidth="1"
        variants={draw}
        custom={0.5}
      />
      {/* Food on plate */}
      <motion.path
        d="M35 32 Q40 20 50 22 Q60 20 65 32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={draw}
        custom={1}
      />
      {/* Garnish */}
      <motion.path
        d="M48 24 Q50 18 52 24"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        variants={draw}
        custom={1.3}
      />
    </motion.svg>
  );
}
