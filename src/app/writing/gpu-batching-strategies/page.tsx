"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { WritingGate } from "@/components/ui/WritingGate";

export default function GPUBatchingArticle() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <WritingGate>
        <main className="pt-16">
          <section className="px-5 md:px-8 pt-16 pb-10">
            <article className="max-w-3xl">
              {/* Article header */}
              <header className="mb-12">
                <TransitionLink
                  href="/writing"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider text-text-light hover:text-text-black transition-colors uppercase mb-8"
                >
                  <span>&larr;</span> Writing
                </TransitionLink>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold tracking-tight text-text-black mb-4"
                >
                  GPU Batching Strategies for Document Classification
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 font-mono text-[10px] tracking-wider text-text-light"
                >
                  <span>2024</span>
                  <span>8 min read</span>
                  <div className="flex gap-2">
                    {["GPU", "ML Infrastructure", "PyTorch"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-border-light uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </header>

              {/* Article body */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-10"
              >
                {/* Section 1 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    The Problem: Idle GPUs
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Single-document inference wastes GPU capacity. A request arrives. The
                      model runs. The result returns. Simple. And 85% of your GPU sits idle.
                    </p>
                    <p>
                      On a T4, one-at-a-time inference hits roughly 15% utilization. The GPU
                      spends more time waiting for the next kernel launch than running
                      computation. CUDA kernel overhead dominates when payloads are small.
                      The model loads weights, runs a forward pass on one document, then
                      idles while the CPU prepares the next input.
                    </p>
                    <p>
                      At $0.526/hr for a T4 on AWS, 85% idle time burns money. At scale
                      (thousands of documents per hour), it creates a throughput ceiling.
                      You need more GPUs to process more documents, even though the ones you
                      have are doing almost nothing.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Type-Based Grouping for Cache Locality
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Batching helps. Naive batching (stuff N documents into one forward
                      pass) leaves performance on the table. Different document types hit
                      different classification heads. A contract, an NDA, and a compliance
                      filing each activate different branches in the model. Mixing types in a
                      batch causes branch divergence on the GPU, which serializes work
                      meant to run in parallel.
                    </p>
                    <p>
                      We group documents by type before batching. All contracts go into one
                      batch. All NDAs go into another. This keeps the GPU cache warm: the
                      same model weights and attention patterns stay in L2 cache across the
                      entire batch. Cache hit rates jumped from 40% to 78% after we
                      introduced type-based grouping.
                    </p>
                    <p>
                      The grouping happens in the SQS consumer. When a message arrives, the
                      worker reads document metadata (type field set during upload), routes
                      it to the correct type-specific queue, and a separate batcher pulls
                      from each queue on a 500ms tick or when the batch fills up.
                    </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Dynamic Batch Sizing by Page Count
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Document count is a poor proxy for GPU memory usage. A 2-page NDA and
                      a 200-page contract produce vastly different tensor sizes after
                      tokenization. Batching 32 contracts works fine when they are 5 pages
                      each. It OOMs when one of them is 180 pages.
                    </p>
                    <p>
                      We size batches by total page count, not document count. The sizing
                      table:
                    </p>
                  </div>

                  <pre className="font-mono text-[11px] leading-relaxed text-text-dark bg-bg-light border border-border-light p-6 my-6 overflow-x-auto">
{`def get_batch_size(page_count: int) -> int:
    if page_count <= 10:
        return 32
    elif page_count <= 50:
        return 8
    elif page_count <= 200:
        return 2
    else:
        return 1  # process solo`}
                  </pre>

                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      These thresholds come from profiling memory usage on a T4 (16GB VRAM).
                      We measured peak GPU memory across 10,000 documents and set each
                      threshold at 80% of the OOM boundary. The 20% margin absorbs variance
                      from tokenization length and attention mask sizes.
                    </p>
                    <p>
                      The batcher tracks cumulative page count as it pulls from the type
                      queue. Once the next document would push the batch over the threshold,
                      it seals the batch and sends it to the GPU worker.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Dual-Path: Interactive vs Batch
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Batching optimizes throughput at the cost of latency. A document
                      arriving right after a batch seals waits up to 500ms for the next
                      batch window. For bulk ingestion jobs, nobody notices. For a user
                      staring at a loading spinner, 500ms feels slow.
                    </p>
                    <p>
                      We split inference into two paths:
                    </p>
                  </div>

                  <div className="space-y-4 my-6">
                    <div className="border-l-2 border-border-light pl-6">
                      <h3 className="text-sm font-bold text-text-black mb-2">
                        Interactive path
                      </h3>
                      <p className="text-sm text-text-dark leading-relaxed">
                        A user uploads a single document and waits. The document skips the
                        queue and goes straight to a reserved GPU slot. We run INT8
                        quantized models here. Quantization trades a small accuracy
                        reduction (0.3% on our eval set) for 2x inference speed. Target:
                        sub-2 second end-to-end.
                      </p>
                    </div>

                    <div className="border-l-2 border-border-light pl-6">
                      <h3 className="text-sm font-bold text-text-black mb-2">
                        Batch path
                      </h3>
                      <p className="text-sm text-text-dark leading-relaxed">
                        Bulk uploads, nightly ingestion, API integrations. Documents enter
                        the SQS queue, get grouped by type, and fill batches to capacity. We run FP16 models
                        for maximum accuracy. No latency pressure. We optimize purely for
                        throughput and GPU utilization.
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-text-dark leading-relaxed">
                    <p>
                      The router decides which path to use based on a single header:
                      {" "}<code className="font-mono text-[11px] bg-bg-light px-1.5 py-0.5 border border-border-light">X-Priority: interactive</code>.
                      API clients set it when they need low-latency results. Everything else
                      goes through the batch path by default.
                    </p>
                  </div>
                </section>

                {/* Section 5: Results */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-6">
                    Results
                  </h2>
                  <div className="grid grid-cols-2 gap-0 border-t border-l border-border-light mb-6">
                    {[
                      {
                        metric: "Single Doc",
                        value: "<2s",
                        description: "End-to-end latency on interactive path",
                      },
                      {
                        metric: "Throughput",
                        value: "3x",
                        description: "Over CPU-only baseline on batch workloads",
                      },
                      {
                        metric: "GPU Util",
                        value: "70%+",
                        description: "Up from 15% with single-document inference",
                      },
                      {
                        metric: "OOM",
                        value: "Zero",
                        description: "No out-of-memory incidents in production",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="border-r border-b border-border-light p-6"
                      >
                        <p className="font-mono text-[10px] tracking-[0.2em] text-text-light uppercase mb-2">
                          {item.metric}
                        </p>
                        <p className="text-3xl font-bold text-text-black tracking-tight mb-2">
                          {item.value}
                        </p>
                        <p className="text-xs text-text-mid leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      GPU utilization went from 15% to 70%+. We serve 4x the traffic on the
                      same hardware. For a startup paying per GPU-hour, this directly reduces
                      infrastructure cost.
                    </p>
                    <p>
                      The zero-OOM result matters for reliability. Before dynamic sizing, we
                      hit OOM roughly once per week during peak ingestion. Each OOM killed
                      the worker process, dropped the in-flight batch, and required manual
                      requeue of affected documents. After switching to page-count-based
                      sizing, we ran 6 months without a single memory-related failure.
                    </p>
                  </div>
                </section>
              </motion.div>
            </article>
          </section>
        </main>
        </WritingGate>
      </PageTransition>
      <Footer />
    </>
  );
}
