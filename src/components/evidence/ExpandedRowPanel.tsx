import type { EvidenceCompany } from "@/lib/types";
import { formatAdjustedSSI, formatSSI } from "@/lib/ssi";
import { CatalystCountdown } from "@/components/evidence/CatalystCountdown";
import { FounderHighlightChip } from "@/components/evidence/FounderHighlightChip";
import { TrendArrow } from "@/components/evidence/TrendArrow";
import {
  formatDate,
  formatFollowers,
  formatFundingCompact,
  parseLines,
} from "@/components/evidence/utils";

function MetaRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b-[0.5px] border-[var(--color-rule)] py-1 last:border-b-0">
      <span
        className="text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      <span
        className={`text-[11px] tabular-nums ${accent ? "text-[var(--color-signal)]" : "text-[var(--color-ink)]"}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[var(--color-signal)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </div>
  );
}

// The inline-expand panel. Renders below a row inside one full-width <td
// colSpan={N}>. Three columns at md+; stacked at sm. Each column is its own
// semantic section so the row reads like a mini-pitch (team / capital /
// catalyst-and-traction) instead of a flat field grid.
export function ExpandedRowPanel({ company }: { company: EvidenceCompany }) {
  const founderLines = parseLines(company.founders);
  const notionDeepLink = `https://www.notion.so/${company.id.replace(/-/g, "")}`;
  return (
    <div className="bg-[var(--color-paper)] px-5 py-5">
      <div className="grid gap-6 md:grid-cols-3">
        {/* ── Team ── */}
        <section>
          <SectionHead>Team</SectionHead>
          {founderLines.length > 0 ? (
            <div className="mb-3 flex flex-col gap-1.5">
              {founderLines.map((line, i) => (
                <p
                  key={i}
                  className="text-[12px] leading-snug text-[var(--color-ink)]"
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p
              className="mb-3 text-[11px] italic text-[var(--color-ink-mute)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              No founder data yet
            </p>
          )}
          {company.founderHighlights.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-1">
              {company.founderHighlights.map((h) => (
                <FounderHighlightChip key={h} label={h} />
              ))}
            </div>
          ) : null}
          {company.founderLinkedin ? (
            <a
              href={company.founderLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-editorial inline-block text-[11px]"
            >
              Founder LinkedIn ↗
            </a>
          ) : null}
          {company.stackREVector ? (
            <div className="mt-3 text-[10px] text-[var(--color-ink-soft)]">
              Stack RE vector:{" "}
              <span className="text-[var(--color-ink)]">
                {company.stackREVector}
              </span>
            </div>
          ) : null}
        </section>

        {/* ── Capital ── */}
        <section>
          <SectionHead>Capital</SectionHead>
          <div className="flex flex-col">
            <MetaRow
              label="Total funding"
              value={formatFundingCompact(company.totalFundingUsd)}
              accent
            />
            <MetaRow
              label="Last round"
              value={`${formatFundingCompact(company.lastRoundAmountUsd)} · ${formatDate(company.lastRoundDate)}`}
            />
            <MetaRow label="Stage" value={company.stage ?? "—"} />
            <MetaRow
              label="Customer"
              value={company.customerType ?? "—"}
            />
            <MetaRow
              label="Ownership"
              value={company.ownership ?? "Private"}
            />
            <MetaRow
              label="Last raise note"
              value={company.lastRaise ?? "—"}
            />
          </div>
          {company.notableInvestors.length > 0 ? (
            <div className="mt-3">
              <div
                className="mb-1 text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-mute)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Notable investors
              </div>
              <div className="flex flex-wrap gap-1">
                {company.notableInvestors.map((inv) => (
                  <span
                    key={inv}
                    className="inline-block rounded border-[0.5px] border-[var(--color-rule)] bg-white px-1.5 py-0.5 text-[10px] text-[var(--color-ink-soft)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {inv}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* ── Catalyst & Traction ── */}
        <section>
          <SectionHead>Catalyst &amp; traction</SectionHead>
          <div className="flex flex-col">
            <MetaRow
              label="Catalyst window"
              value={
                <CatalystCountdown days={company.catalystWindowDays} />
              }
            />
            <MetaRow
              label="Raw SSI"
              value={`${formatSSI(company.ssiScore)} / 100`}
              accent
            />
            <MetaRow
              label="Adj. SSI"
              value={formatAdjustedSSI(company.adjustedSsi)}
            />
            <MetaRow
              label="Falsifier"
              value={company.falsifierCheck ?? "Not Run"}
            />
            <MetaRow
              label="Anti-thesis"
              value={company.antiThesisFilter ?? "Not Run"}
            />
            <MetaRow
              label="IC Memo"
              value={company.icMemoStatus ?? "Not Started"}
            />
            <MetaRow
              label="Headcount"
              value={
                <>
                  {company.headcount?.toLocaleString("en-US") ?? "—"}{" "}
                  <span className="ml-2 inline-block">
                    <TrendArrow value={company.headcount90dDeltaPct} />
                  </span>
                </>
              }
            />
            <MetaRow
              label="LinkedIn followers"
              value={
                <>
                  {formatFollowers(company.linkedinFollowers)}{" "}
                  <span className="ml-2 inline-block">
                    <TrendArrow
                      value={company.linkedinFollowers90dDeltaPct}
                    />
                  </span>
                </>
              }
            />
            <MetaRow
              label="GitHub"
              value={
                company.githubStars !== null
                  ? `${company.githubStars.toLocaleString("en-US")} ★`
                  : "—"
              }
            />
            <MetaRow
              label="Web traffic 90d"
              value={company.webTrafficTrend ?? "—"}
            />
          </div>
        </section>
      </div>

      {/* Key signal banner */}
      {company.keySignal30d ? (
        <div className="mt-5 border-l-2 border-[var(--color-signal)] bg-white px-3 py-2">
          <div
            className="mb-1 text-[9px] uppercase tracking-[0.18em] text-[var(--color-signal)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Key signal · 30d
          </div>
          <p
            className="text-[12px] leading-snug text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {company.keySignal30d}
          </p>
        </div>
      ) : null}

      {/* Recent signals */}
      {company.recentSignals.length > 0 ? (
        <div className="mt-4">
          <div
            className="mb-2 text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Recent signals · {company.signalCount} total
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {company.recentSignals.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="rounded border-[0.5px] border-[var(--color-rule)] bg-white px-2.5 py-2"
              >
                <div className="text-[11px] leading-snug text-[var(--color-ink)]">
                  {s.title}
                </div>
                <div
                  className="mt-1 text-[9px] uppercase tracking-[0.08em] text-[var(--color-ink-mute)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {[s.week, s.signalType, s.strength, s.novelty]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Footer: external links */}
      <div className="mt-5 flex flex-wrap items-center gap-4 border-t-[0.5px] border-[var(--color-rule)] pt-3">
        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial text-[11px]"
          >
            Website ↗
          </a>
        ) : null}
        {company.linkedinUrl ? (
          <a
            href={company.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial text-[11px]"
          >
            Company LinkedIn ↗
          </a>
        ) : null}
        <a
          href={notionDeepLink}
          target="_blank"
          rel="noopener noreferrer"
          className="link-editorial text-[11px]"
        >
          Open in Notion ↗
        </a>
        <span
          className="ml-auto text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Last verified · {formatDate(company.lastVerified)}
        </span>
      </div>
    </div>
  );
}
