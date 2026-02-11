"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils";

const categories = ["All", "Photography", "Art", "Digital"] as const;
type Category = (typeof categories)[number];

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: Exclude<Category, "All">;
  caption: string;
  aspect: "portrait" | "landscape" | "square";
  gridClass: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "001",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    alt: "Mountain landscape",
    category: "Photography",
    caption: "Altitude — Swiss Alps",
    aspect: "portrait",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "002",
    src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    alt: "Abstract art",
    category: "Art",
    caption: "Chromatic Study No. 7",
    aspect: "landscape",
    gridClass: "md:col-span-1",
  },
  {
    id: "003",
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80",
    alt: "Ocean waves",
    category: "Photography",
    caption: "Pacific — Big Sur",
    aspect: "square",
    gridClass: "md:col-span-1",
  },
  {
    id: "004",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    alt: "Digital art",
    category: "Digital",
    caption: "Neural Drift v2",
    aspect: "portrait",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "005",
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    alt: "Concert lights",
    category: "Photography",
    caption: "Frequency — Live",
    aspect: "landscape",
    gridClass: "md:col-span-1",
  },
  {
    id: "006",
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80",
    alt: "Abstract painting",
    category: "Art",
    caption: "Form & Void No. 3",
    aspect: "square",
    gridClass: "md:col-span-1",
  },
  {
    id: "007",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    alt: "Forest fog",
    category: "Photography",
    caption: "Mist — Pacific Northwest",
    aspect: "landscape",
    gridClass: "md:col-span-2",
  },
  {
    id: "008",
    src: "https://images.unsplash.com/photo-1634017839464-5c339eba3df4?w=600&q=80",
    alt: "Digital render",
    category: "Digital",
    caption: "Topology Study",
    aspect: "portrait",
    gridClass: "md:col-span-1",
  },
];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <Section id="gallery" title="Visual Work" subtitle="Photography & Art">
      {/* Filter tabs */}
      <div className="section-reveal flex items-center gap-1 mb-12 pb-4 border-b border-border-default">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={cn(
              "px-4 py-2 font-mono text-[10px] tracking-[0.15em] uppercase rounded-sm transition-all duration-300",
              activeFilter === cat
                ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30"
                : "text-text-tertiary hover:text-text-secondary border border-transparent hover:border-border-hover"
            )}
          >
            {cat}
            <span className="ml-2 text-text-tertiary">
              {cat === "All"
                ? galleryItems.length.toString().padStart(2, "0")
                : galleryItems
                    .filter((i) => i.category === cat)
                    .length.toString()
                    .padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {/* Editorial grid */}
      <div ref={containerRef} className="relative">
        {/* Grid numbers along left edge */}
        <div className="hidden md:flex absolute -left-10 top-0 bottom-0 flex-col justify-between py-4">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="font-mono text-[9px] text-text-tertiary/30"
            >
              {(i * 12 + 1).toString().padStart(3, "0")}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
          >
            {filteredItems.map((item) => (
              <div key={item.id} className={item.gridClass}>
                <ImageFrame
                  src={item.src}
                  alt={item.alt}
                  index={item.id}
                  caption={item.caption}
                  aspect={item.aspect}
                  size="full"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom editorial link */}
      <div className="section-reveal flex items-center justify-between mt-16 pt-6 border-t border-border-default">
        <div>
          <span className="font-mono text-[10px] text-text-tertiary tracking-wider block mb-1">
            ARCHIVE
          </span>
          <p className="text-text-secondary text-sm max-w-md">
            A curated selection of photography, digital art, and visual experiments.
            Exploring light, form, and the spaces between.
          </p>
        </div>
        <ArrowLink href="#" variant="default">
          View Full Archive
        </ArrowLink>
      </div>
    </Section>
  );
}
