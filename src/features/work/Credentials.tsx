import { earnedCredentials, type Credential } from "@/data/credentials";
import { MONO, PINK, TIMES } from "./style";

/**
 * Certifications on the Work page.
 *
 * Renders only credentials Jay has actually been awarded. The list is empty
 * until the first certificate exists, and an empty list renders nothing at all
 * rather than an empty heading, so the page is unchanged until there is
 * something true to put on it.
 *
 * The gate lives in the data layer. See credentials.test.ts, which fails if an
 * entry is marked earned without an issue date.
 */
export function Credentials() {
  const earned = earnedCredentials();
  if (earned.length === 0) return null;

  return (
    <section className="px-5 pt-20 md:px-8" aria-labelledby="certifications">
      <p className={`${MONO} text-white/55`}>Certifications</p>
      <h2
        id="certifications"
        style={TIMES}
        className="mt-3 text-3xl font-bold leading-tight md:text-4xl"
      >
        Earned
      </h2>
      <ul className="mt-8 max-w-4xl border-t border-white/10">
        {earned.map((credential) => (
          <CredentialRow key={credential.id} credential={credential} />
        ))}
      </ul>
    </section>
  );
}

function CredentialRow({ credential }: { credential: Credential }) {
  return (
    <li className="border-b border-white/10 py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p style={TIMES} className="text-lg leading-snug text-white md:text-xl">
          {credential.name}
        </p>
        <p className={`${MONO} shrink-0 text-white/55`}>
          <span style={{ color: PINK }}>[</span>
          {credential.issuedOn}
          <span style={{ color: PINK }}>]</span>
        </p>
      </div>
      <p className={`${MONO} mt-2 text-white/55`}>{credential.issuer}</p>
      <p style={TIMES} className="mt-3 max-w-2xl text-white/70">
        {credential.rationale}
      </p>
      {credential.verifyUrl ? (
        <a
          href={credential.verifyUrl}
          target="_blank"
          rel="noreferrer"
          className={`${MONO} mt-3 inline-block text-white underline decoration-white/30 underline-offset-4 hover:decoration-white`}
        >
          Verify
        </a>
      ) : null}
    </li>
  );
}
