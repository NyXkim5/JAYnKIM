"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { WritingGate } from "@/components/ui/WritingGate";

export default function HIPAAInfraArticle() {
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
                  HIPAA-Compliant Infrastructure Without the Overhead
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 font-mono text-[10px] tracking-wider text-text-light"
                >
                  <span>2024</span>
                  <span>6 min read</span>
                  <div className="flex gap-2">
                    {["HIPAA", "AWS", "Security"].map((tag) => (
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
                    The Problem with Compliance Checklists
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Startups treat HIPAA like a checkbox exercise. They hire a consultant,
                      fill out a spreadsheet, and call it done. Then an engineer adds a log
                      statement printing patient names to CloudWatch, and the spreadsheet
                      becomes fiction.
                    </p>
                    <p>
                      At Archv, we processed legal documents containing PHI. Every page had
                      Social Security numbers, medical diagnoses, or insurance details
                      embedded in contracts and court filings. We needed compliance baked
                      into the infrastructure, not written on a spreadsheet. If an engineer
                      writes code exposing PHI by accident, the system is broken.
                    </p>
                    <p>
                      Our goal: make it harder to violate HIPAA than to follow it. Every
                      default should be the secure option. Every escape hatch should require
                      explicit, auditable justification.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Column-Level Encryption
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Database-level encryption at rest protects against stolen hard drives.
                      It does nothing against a SQL query returning PHI to an unauthorized
                      service. We needed encryption to survive inside the application layer.
                    </p>
                    <p>
                      Every PHI column gets its own encryption key via AWS KMS. The
                      application decrypts only the columns the requesting service is
                      authorized to access. A billing service reads invoice amounts but
                      never decrypts patient names in the same row. The database stores
                      ciphertext. The application layer controls who sees plaintext.
                    </p>
                  </div>

                  <pre className="font-mono text-[11px] leading-relaxed text-text-dark bg-bg-light border border-border-light p-6 my-6 overflow-x-auto">
{`-- PHI columns stored as encrypted bytea
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  file_ref TEXT NOT NULL,
  patient_name BYTEA,      -- KMS key: phi/names
  ssn BYTEA,               -- KMS key: phi/ssn
  diagnosis_codes BYTEA,   -- KMS key: phi/clinical
  classification TEXT,      -- non-PHI, plaintext
  created_at TIMESTAMPTZ
);

-- Row-level security: users see only their org
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON documents
  USING (org_id = current_setting('app.org_id')::UUID);`}
                  </pre>

                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Key rotation happens automatically. KMS rotates keys annually. Old data
                      stays readable because KMS retains previous key versions. We never
                      touch key material directly. No key in application config. No key in
                      environment variables.
                    </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Immutable Audit Logs
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      HIPAA requires audit trails for every access to PHI. Common
                      implementations write logs to the same database storing PHI. An admin
                      who deletes patient records also deletes the evidence.
                    </p>
                    <p>
                      We write audit events to a separate append-only table with no DELETE
                      or UPDATE permissions granted to any application role. The audit table
                      lives in a different schema with its own access controls. Logs include:
                      who accessed what, when, from which IP, and which decryption keys were
                      used.
                    </p>
                    <p>
                      Audit records replicate to S3 with Object Lock (WORM). Even if someone
                      compromises the database, the S3 copies are immutable for the retention
                      period. We set 7 years, matching HIPAA retention requirements.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light mb-4">
                    Zero-Trust Between Services
                  </h2>
                  <div className="space-y-4 text-sm text-text-dark leading-relaxed">
                    <p>
                      Internal services do not trust each other. The GPU inference worker
                      does not call the billing API. The upload service does not read
                      classification results. Each service gets a scoped IAM role with the
                      minimum permissions it needs.
                    </p>
                  </div>

                  <div className="space-y-4 my-6">
                    <div className="border-l-2 border-border-light pl-6">
                      <h3 className="text-sm font-bold text-text-black mb-2">
                        Upload service
                      </h3>
                      <p className="text-sm text-text-dark leading-relaxed">
                        Writes to S3 and SQS. Does not read from the results table. Does
                        not invoke the inference endpoint. Its IAM policy has exactly two
                        actions: s3:PutObject and sqs:SendMessage.
                      </p>
                    </div>

                    <div className="border-l-2 border-border-light pl-6">
                      <h3 className="text-sm font-bold text-text-black mb-2">
                        Inference worker
                      </h3>
                      <p className="text-sm text-text-dark leading-relaxed">
                        Reads from SQS, reads documents from S3, writes classification
                        results to PostgreSQL. Has no access to billing data, user accounts,
                        or API keys. If compromised, the blast radius is limited to document
                        classification.
                      </p>
                    </div>

                    <div className="border-l-2 border-border-light pl-6">
                      <h3 className="text-sm font-bold text-text-black mb-2">
                        API gateway
                      </h3>
                      <p className="text-sm text-text-dark leading-relaxed">
                        Authenticates requests, enforces rate limits, and routes to internal
                        services. Holds no data. If compromised, an attacker gets rate-limited
                        API access, not database credentials.
                      </p>
                    </div>
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
                        metric: "PHI Incidents",
                        value: "Zero",
                        description: "No data exposure events across 12 months of operation",
                      },
                      {
                        metric: "Audit Coverage",
                        value: "100%",
                        description: "Every PHI access logged and replicated to immutable storage",
                      },
                      {
                        metric: "Key Rotation",
                        value: "Auto",
                        description: "KMS handles rotation. No manual key management needed",
                      },
                      {
                        metric: "Compliance",
                        value: "SOC 2",
                        description: "Passed Type I audit with zero findings on data controls",
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
                      The payoff is speed. New features ship without a compliance review
                      cycle because the infrastructure enforces the rules. An engineer does
                      not accidentally log PHI because the application never sees plaintext
                      unless it explicitly decrypts with the right key. The secure path is
                      the default path.
                    </p>
                    <p>
                      For a pre-seed startup, this mattered. We did not have a compliance
                      team. We had two engineers. The infrastructure had to enforce what we
                      had no way to manually review on every commit.
                    </p>
                  </div>
                </section>
              </motion.div>
            </article>
          </section>
        </main>
        </WritingGate>
      </PageTransition>
      <Footer compact />
    </>
  );
}
