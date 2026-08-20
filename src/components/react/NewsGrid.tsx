import { useMemo, useState } from 'react';
import { Search, ArrowUpRight, Newspaper } from 'lucide-react';
import { NewsLightbox, type NewsItem } from './NewsShowcase';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function NewsCard({ item, onOpen }: { item: NewsItem; onOpen: (n: NewsItem) => void }) {
  return (
    <article
      onClick={() => onOpen(item)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-elevated)] transition-all hover:-translate-y-1 hover:border-[var(--brand)]/50 hover:shadow-xl"
    >
      {/* Screenshot — top of the article page, generous height so the
          masthead + headline area is actually readable */}
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden border-b border-[var(--border-hair)] bg-white">
        {item.image ? (
          <img
            src={item.image}
            alt={`${item.outlet} — ${item.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[var(--text-faint)]">
            <Newspaper className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-medium uppercase tracking-widest text-[var(--brand)]">
            {item.outlet}
          </span>
          <time
            className="shrink-0 font-mono text-[11px] text-[var(--text-faint)]"
            dateTime={item.publishedAt}
          >
            {fmtDate(item.publishedAt)}
          </time>
        </div>

        <h3 className="line-clamp-3 text-base font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)]">
          {item.title}
        </h3>

        <div className="mt-auto flex items-center justify-end pt-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand)]">
            View coverage
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function NewsGrid({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<NewsItem | null>(null);
  const [query, setQuery] = useState('');

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf(),
      ),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (i) => i.title.toLowerCase().includes(q) || i.outlet.toLowerCase().includes(q),
    );
  }, [sorted, query]);

  return (
    <div>
      {/* Search + count */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by headline or outlet…"
            className="h-11 w-full rounded-full border border-[var(--border-hair)] bg-[var(--bg-glass)] pl-11 pr-4 text-sm text-[var(--text-primary)] backdrop-blur transition-colors placeholder:text-[var(--text-faint)] focus:border-[var(--brand)] focus:outline-none"
          />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
          {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-[var(--text-muted)]">No stories match “{query}”.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <li key={item.slug}>
              <NewsCard item={item} onOpen={setActive} />
            </li>
          ))}
        </ul>
      )}

      {active && <NewsLightbox item={active} onClose={() => setActive(null)} />}
    </div>
  );
}
