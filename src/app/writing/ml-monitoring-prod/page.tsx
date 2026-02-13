"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { WritingGate } from "@/components/ui/WritingGate";

export default function MLMonitoringArticle() {
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
                  ML Monitoring That Catches Failures
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 font-mono text-[10px] tracking-wider text-text-light"
                >
                  <span>2025</span>
                  <span>5 min read</span>
                  <div className="flex gap-2">
                    {["MLOps", "Monitoring", "Production"].map((tag) => (
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
                    The Dashboard Nobody Checks
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Every ML team has a Grafana dashboard with model accuracy metrics.
                      Almost none of them catch real failures. The dashboard shows aggregate
                      accuracy: 94.2% today, 94.1% yesterday. Everything looks fine.
                      Meanwhile, a specific cohort of inputs started returning garbage
                      predictions three days ago.
                    </p>
                    <p>
                      Aggregate metrics hide localized failures. A model 95% accurate
                      overall drops to 40% on a specific input distribution after it shifts.
                      If the shifted distribution represents 5% of traffic, the aggregate
                      barely moves. But 5% of traffic at healthcare scale is
                      thousands of patients getting wrong predictions.
                    </p>
                    <p>
                      We needed monitoring to catch failures before users report them. Not
                      dashboards. Alerts firing on specific, actionable conditions.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Prediction Confidence as a Canary
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Ground truth labels arrive days or weeks after prediction time. You
                      have no way to compute real accuracy in real time. You do track
                      prediction confidence. A model producing uncertain outputs is a model
                      producing wrong outputs.
                    </p>
                    <p>
                      We log the softmax probability of every prediction. Healthy models
                      produce a bimodal distribution: high confidence on easy inputs, lower
                      confidence on edge cases. When the distribution shifts toward the
                      middle (more uncertain predictions), something changed in the input
                      data.
                    </p>
                    <p>
                      We track two signals: the mean confidence score (stays above 0.85
                      for our models) and the percentage of predictions below 0.6 confidence
                      (stays below 8%). When either signal crosses its threshold for 15
                      consecutive minutes, we fire an alert.
                    </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Data Drift Detection
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Models break when input data changes. A new upstream system reformats
                      dates. A partner starts sending records with missing fields. A schema
                      migration adds a column shifting feature indices. None of these throw
                      errors. The model still runs. It produces wrong outputs.
                    </p>
                    <p>
                      We compute feature distributions on a rolling 24-hour window and
                      compare against a reference window from the last stable period. For
                      numerical features, we use the Kolmogorov-Smirnov test. For categorical
                      features, we use chi-squared. If any feature drifts past our threshold
                      (p &lt; 0.01), we log which feature drifted and by how much.
                    </p>
                  </div>

                  <pre className="font-mono text-[11px] leading-relaxed text-text-dark bg-bg-light border border-border-light p-6 my-6 overflow-x-auto">
{`# Simplified drift check (runs every 30 min)
def check_drift(current: pd.DataFrame, reference: pd.DataFrame):
    alerts = []
    for col in MONITORED_FEATURES:
        if is_numeric(col):
            stat, p = ks_2samp(current[col], reference[col])
        else:
            stat, p = chi2_contingency(
                crosstab(current[col], reference[col])
            )
        if p < 0.01:
            alerts.append({
                "feature": col,
                "p_value": p,
                "stat": stat,
                "severity": "high" if p < 0.001 else "medium"
            })
    return alerts`}
                  </pre>

                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      The 30-minute check interval balances detection speed against false
                      positives. Shorter windows trigger on normal variance. Longer windows
                      miss fast-onset issues. We tuned this by replaying 6 months of
                      production data and measuring time-to-detection against known
                      incidents.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Silent Degradation
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      The hardest failures to catch are gradual ones. The model does not
                      break. It slowly gets worse. A feature losing predictive value as the
                      underlying process changes. Accuracy drops 0.1% per week. After two
                      months, the model is 3% worse and nobody noticed.
                    </p>
                    <p>
                      We run weekly offline evaluation against held-out labeled data. The
                      difference: we segment the evaluation by input cohort. By data source.
                      By record type. By time of creation. A model stable overall but
                      degrading on records from a specific source gets flagged.
                    </p>
                    <p>
                      Segmented evaluation caught a 12% accuracy drop on records from one
                      partner who changed their data format. The aggregate accuracy moved by
                      0.4%. Without segmentation, we would have missed it for weeks.
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
                        metric: "Detection",
                        value: "<30 min",
                        description: "Time to detect data drift or confidence degradation",
                      },
                      {
                        metric: "False Positives",
                        value: "<2/mo",
                        description: "Fewer than 2 false alerts per month after tuning",
                      },
                      {
                        metric: "Silent Failures",
                        value: "3 caught",
                        description: "Degradations found by segmented eval, missed by aggregate metrics",
                      },
                      {
                        metric: "MTTR",
                        value: "4x faster",
                        description: "Mean time to resolution with feature-level drift attribution",
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
                      Engineers stopped asking &quot;is the model accurate?&quot; and started
                      asking &quot;which cohorts degraded this week?&quot; Feature-level drift
                      attribution means we fix the root cause (bad upstream data, schema
                      changes) instead of retraining and hoping.
                    </p>
                    <p>
                      The false positive rate matters more than detection speed. An alerting
                      system crying wolf gets ignored. We spent more time tuning thresholds
                      than building the detection logic. The current rate of fewer than 2
                      false positives per month keeps the team responsive when alerts fire.
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
