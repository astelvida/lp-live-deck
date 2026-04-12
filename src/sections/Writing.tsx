import { SectionHeader } from "@/components/SectionHeader";
import type { BlogPost } from "@/lib/types";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const span = featured
    ? "col-span-12 md:col-span-8 md:col-start-3"
    : "col-span-12 md:col-span-5";
  return (
    <article
      className={`${span} group flex h-full flex-col justify-between gap-5 border-t border-[var(--color-ink)] pt-5`}
    >
      <div>
        <div
          className="flex flex-wrap items-baseline gap-3 text-[10px] uppercase tracking-[0.26em] text-[var(--color-ink-mute)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {featured && <span className="text-[var(--color-signal)]">Featured</span>}
          {post.format && <span>{post.format}</span>}
          {post.publishedDate && <span>· {fmtDate(post.publishedDate)}</span>}
          {post.readingTime && <span>· {post.readingTime}</span>}
        </div>
        <h3
          className={`text-display mt-4 text-[var(--color-ink)] ${
            featured ? "text-[clamp(2rem,4vw,3.25rem)]" : "text-2xl md:text-3xl"
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-ink-soft)]">
            {post.excerpt}
          </p>
        )}
      </div>
      <footer className="flex flex-wrap items-center gap-3">
        {post.tags.slice(0, 4).map((t) => (
          <span
            key={t}
            className="border border-[var(--color-ink-faint)] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {t}
          </span>
        ))}
        {post.canonicalUrl && (
          <a
            href={post.canonicalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto text-[11px] uppercase tracking-[0.28em] text-[var(--color-signal)] underline-offset-4 hover:underline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Read on Substack →
          </a>
        )}
      </footer>
    </article>
  );
}

export function WritingSection({
  featured,
  recent,
}: {
  featured: BlogPost | null;
  recent: BlogPost[];
}) {
  const hasAny = featured || recent.length > 0;
  return (
    <section className="mt-32 mb-40 md:mt-48">
      <SectionHeader
        number="08"
        label="Writing"
        kicker="Signals Over Stories · Substack"
        title={
          <>
            The thesis,{" "}
            <span className="text-display-italic text-[var(--color-signal)]">in longform.</span>
          </>
        }
      >
        Memos, watchlists, contrarian takes. What the pipeline tells you, argued out loud.
      </SectionHeader>

      {!hasAny ? (
        <div className="grid-deck mt-10">
          <p className="col-span-12 text-[var(--color-ink-mute)] md:col-start-3 md:col-span-10">
            No published posts yet.
          </p>
        </div>
      ) : (
        <div className="grid-deck mt-12">
          {featured && <PostCard post={featured} featured />}
          {recent.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
