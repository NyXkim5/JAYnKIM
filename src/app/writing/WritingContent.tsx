"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

import { articles } from "@/data/articles";

const sideImages = ["/writing-1.svg", "/writing-2.svg", "/writing-3.svg"];

export default function WritingContent() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-14 relative overflow-hidden">
          {/* Side SVGs — decorative, clipped at page edges */}
          <div className="hidden md:block pointer-events-none absolute inset-0" aria-hidden="true">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ right: "-598px" }}
              className="absolute top-[200px] w-[1320px] select-none"
            >
              <Image src={sideImages[0]} alt="" width={1320} height={800} unoptimized />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ left: "-542px" }}
              className="absolute top-[500px] w-[1200px] select-none"
            >
              <Image src={sideImages[1]} alt="" width={1200} height={800} unoptimized />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ right: "-510px" }}
              className="absolute bottom-[-100px] w-[1140px] select-none"
            >
              <Image src={sideImages[2]} alt="" width={1140} height={800} unoptimized />
            </motion.div>
          </div>

          <section className="px-5 md:px-8 pt-16 pb-10 border-b border-border-light relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-text-black mb-3"
            >
              Writing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-base text-text-mid max-w-xl"
            >
              Technical writing on systems I have built. Infrastructure, ML
              pipelines, and the engineering decisions behind them.
            </motion.p>
          </section>

          <section className="px-5 md:px-8 py-10 max-w-3xl relative z-10">
            <div className="space-y-0">
              {articles.map((article, i) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <TransitionLink
                    href={`/writing/${article.slug}`}
                    className="group block border-b border-border-light py-8 first:pt-0"
                  >
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3">
                      <span className="font-mono text-[10px] tracking-wider text-text-light">
                        {article.date}
                      </span>
                      <span className="font-mono text-[10px] tracking-wider text-text-light">
                        {article.readTime}
                      </span>
                      {article.status === "in-progress" && (
                        <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border border-yellow-400 text-yellow-600 bg-yellow-50">
                          In Progress
                        </span>
                      )}
                      <div className="flex gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider text-text-light uppercase px-2 py-0.5 border border-border-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-text-black group-hover:text-text-mid transition-colors mb-2">
                      {article.title}
                    </h2>

                    <p className="text-sm text-text-mid leading-relaxed">
                      {article.description}
                    </p>

                    <span className="inline-block mt-4 font-mono text-[10px] tracking-wider text-text-light group-hover:text-text-black transition-colors uppercase">
                      Read &rarr;
                    </span>
                  </TransitionLink>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
