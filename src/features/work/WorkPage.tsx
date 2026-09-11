import { PersonaBar } from "@/features/persona/PersonaBar";
import { getPersona } from "@/features/persona/personas";
import { ContributionGraph } from "./ContributionGraph";
import { Credentials } from "./Credentials";
import { currentMonth, type Contributions } from "./contributions";
import contributions from "./data/contributions.json";
import { EDUCATION, ROLES } from "./roles";
import { MONO, TIMES } from "./style";
import { Timeline } from "./Timeline";

// The JSON is read at build time. The workflow that refreshes it commits a new
// file, and the next build picks the new numbers up. Nothing fetches in the browser.
const data: Contributions = contributions;

// The Work tab. White ground, a timeline of roles newest first, then the
// GitHub contribution graph at the foot. The rail's "present" edge is the
// month the JSON was fetched, so it moves with the daily refresh.
export function WorkPage() {
  const persona = getPersona("work");
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-12 text-white">
      <PersonaBar persona="work" />
      <header className="max-w-4xl px-5 pb-14 pt-16 md:px-8">
        <p className={`${MONO} text-white/55`}>
          {String(persona.index).padStart(2, "0")} / {persona.label}
        </p>
        <h1 style={TIMES} className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Experience
        </h1>
      </header>
      <section className="px-5 md:px-8">
        <Timeline roles={ROLES} education={EDUCATION} now={currentMonth(data.fetchedAt)} />
      </section>
      <Credentials />
      <ContributionGraph data={data} />
    </main>
  );
}
