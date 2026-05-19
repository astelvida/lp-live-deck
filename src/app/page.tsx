import {
  getEvidenceData,
  getHeroData,
  getLatestPosts,
  getPipeline,
  getSignalVelocity,
  getTheses,
} from "@/lib/notion";
import { LiveStatusBar } from "@/components/LiveStatusBar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/sections/Hero";
import { ThesisSection } from "@/sections/Thesis";
import { PipelineSection } from "@/sections/Pipeline";
import { SignalVelocitySection } from "@/sections/SignalVelocity";
import { EvidenceSection } from "@/sections/Evidence";
import { WritingSection } from "@/sections/Writing";

export const revalidate = 60;

export default async function Page() {
  const [hero, pipeline, theses, velocity, evidence, posts] = await Promise.all(
    [
      getHeroData(),
      getPipeline(),
      getTheses(),
      getSignalVelocity(),
      getEvidenceData(),
      getLatestPosts(),
    ],
  );

  return (
    <>
      <LiveStatusBar generatedAt={hero.generatedAt} />
      <ScrollProgress />
      <main className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
        <Hero data={hero} />
        <PipelineSection data={pipeline} />
        <ThesisSection theses={theses} />
        <SignalVelocitySection data={velocity} />
        <EvidenceSection data={evidence} />
        <WritingSection featured={posts.featured} recent={posts.recent} />
      </main>
      <footer className="border-t border-[var(--color-ink)] pt-12 pb-16">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10">
          <div className="grid-deck">
            <div className="col-span-12 md:col-span-2">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-signal)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                §
              </p>
              <p
                className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Colophon
              </p>
            </div>
            <div className="col-span-12 md:col-span-10">
              <p className="text-display text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--color-ink)]">
                Set in Fraunces &amp; Instrument Sans.{" "}
                <span className="text-display-italic text-[var(--color-ink-soft)]">
                  Typeset live from Notion.
                </span>
              </p>
            </div>
          </div>

          <dl
            className="mt-10 grid gap-8 border-t border-[var(--color-rule)] pt-8 sm:grid-cols-2 md:grid-cols-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <div>
              <dt className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]">
                Typography
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                Fraunces · Instrument Sans · JetBrains Mono. All SIL OFL.
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]">
                Source of truth
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                Four Notion sources · Companies · Signals · Thesis Pack · Writing.
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]">
                Stack
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                Next.js 15 · React 19 · Tailwind v4 · Motion · Recharts.
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]">
                Rendering
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-[var(--color-ink-soft)] tabular-nums">
                {new Date(hero.generatedAt)
                  .toISOString()
                  .replace("T", " ")
                  .slice(0, 19)}{" "}
                UTC · ISR 60s.
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col items-baseline justify-between gap-4 border-t border-[var(--color-rule)] pt-6 md:flex-row">
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Signals Over Stories · Sevda Anefi · © {new Date().getUTCFullYear()}
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-[var(--color-signal)]">END</span> ·{" "}
              <span className="tabular-nums">06 / 06</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
