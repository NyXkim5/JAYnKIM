"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { IndexTable } from "@/components/ui/IndexTable";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils";

const tabs = ["Matcha", "Coffee", "Food"] as const;
type Tab = (typeof tabs)[number];

const matchaRecs = [
  { id: "001", title: "Ippodo Tea", detail: "Ceremonial grade umami-rich matcha", meta: "Kyoto, Japan", year: "★★★" },
  { id: "002", title: "Kettl", detail: "Single-origin Japanese tea specialists", meta: "Brooklyn, NY", year: "★★★" },
  { id: "003", title: "Marukyu Koyamaen", detail: "400-year lineage, Uji matcha", meta: "Uji, Japan", year: "★★★" },
  { id: "004", title: "Chalait", detail: "Matcha latte with oat milk perfection", meta: "New York, NY", year: "★★☆" },
  { id: "005", title: "Stonemill Matcha", detail: "Premium ceremonial with sweet finish", meta: "San Francisco, CA", year: "★★★" },
  { id: "006", title: "Cafe Kitsune", detail: "French-Japanese matcha experience", meta: "Tokyo / Paris", year: "★★☆" },
];

const coffeeRecs = [
  { id: "001", title: "Blue Bottle Coffee", detail: "Single origin pour-over specialists", meta: "Oakland, CA", year: "★★★" },
  { id: "002", title: "Onyx Coffee Lab", detail: "Competition-level roasting, fruit-forward", meta: "Rogers, AR", year: "★★★" },
  { id: "003", title: "Verve Coffee", detail: "West coast light roast perfection", meta: "Santa Cruz, CA", year: "★★☆" },
  { id: "004", title: "Tim Wendelboe", detail: "Nordic roasting pioneer", meta: "Oslo, Norway", year: "★★★" },
  { id: "005", title: "Fuglen", detail: "Japanese-Norwegian coffee fusion", meta: "Tokyo / Oslo", year: "★★☆" },
];

const foodRecs = [
  { id: "001", title: "Tsuta", detail: "Michelin-starred shoyu ramen", meta: "Tokyo, Japan", year: "★★★" },
  { id: "002", title: "Tartine Bakery", detail: "Country bread & morning buns", meta: "San Francisco, CA", year: "★★★" },
  { id: "003", title: "Jongro BBQ", detail: "Late night galbi & soju", meta: "New York, NY", year: "★★☆" },
  { id: "004", title: "Narisawa", detail: "Innovative forest-to-table kaiseki", meta: "Tokyo, Japan", year: "★★★" },
  { id: "005", title: "Gjusta", detail: "Everything smoked, cured, or baked", meta: "Venice, CA", year: "★★★" },
  { id: "006", title: "Kang Ho Dong", detail: "Korean BBQ institution", meta: "Los Angeles, CA", year: "★★☆" },
  { id: "007", title: "Cafe Gratitude", detail: "Plant-based bowls done right", meta: "Los Angeles, CA", year: "★★☆" },
];

const recMap: Record<Tab, typeof matchaRecs> = {
  Matcha: matchaRecs,
  Coffee: coffeeRecs,
  Food: foodRecs,
};

const columnMap: Record<Tab, { title: string; detail?: string; meta?: string; year?: string }> = {
  Matcha: { title: "Name", meta: "Location", year: "Rating" },
  Coffee: { title: "Name", meta: "Location", year: "Rating" },
  Food: { title: "Name", meta: "Location", year: "Rating" },
};

export function MatchaSection() {
  const [activeTab, setActiveTab] = useState<Tab>("Matcha");

  return (
    <Section id="matcha" title="Recommendations" subtitle="Curated finds" grid>
      <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
        {/* Left column — editorial intro */}
        <div className="section-reveal">
          <div className="sticky top-32">
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              A personal index of the best matcha, coffee, and food spots
              I&apos;ve found across cities. Updated as I explore.
            </p>

            {/* Tab switcher */}
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2.5 rounded-sm font-mono text-xs tracking-wider uppercase transition-all duration-300 text-left",
                    activeTab === tab
                      ? "bg-accent-cyan/8 text-accent-cyan border-l-2 border-accent-cyan"
                      : "text-text-tertiary hover:text-text-secondary border-l-2 border-transparent hover:border-border-hover"
                  )}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] text-text-tertiary">
                    {recMap[tab].length.toString().padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border-default">
              <ArrowLink href="#" variant="minimal">
                Submit a recommendation
              </ArrowLink>
            </div>
          </div>
        </div>

        {/* Right column — index table */}
        <div className="section-reveal">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tab title */}
              <div className="flex items-baseline gap-4 mb-8">
                <h3 className="text-3xl md:text-4xl font-bold font-mono text-text-primary">
                  {activeTab}
                </h3>
                <span className="font-mono text-[10px] text-accent-cyan tracking-wider align-super">
                  {recMap[activeTab].length.toString().padStart(3, "0")}
                </span>
              </div>

              <IndexTable
                entries={recMap[activeTab]}
                columns={columnMap[activeTab]}
              />

              <div className="mt-8 pt-4 border-t border-border-default">
                <ArrowLink href="#" variant="default">
                  Show more {activeTab.toLowerCase()}
                </ArrowLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
