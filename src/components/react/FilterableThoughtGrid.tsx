import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Newspaper, Tv } from 'lucide-react';
import { cn } from '~/lib/cn';
import OutletWordmark from './OutletWordmark';

export type ThoughtItem =
  | {
      kind: 'op-ed';
      slug: string;
      title: string;
      outlet: string;
      publishedAt: string; // ISO
      teaser: string;
      pullQuote?: string;
      externalUrl: string;
      tags: string[];
      featured?: boolean;
    }
  | {
      kind: 'tv';
      slug: string;
      title: string;
      network: string;
      program: string;
      host?: string;
      airedAt: string; // ISO
      duration?: string;
      teaser: string;
      externalUrl: string;
    };

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'op-ed', label: 'Op-Eds' },
  { id: 'tv', label: 'Television' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function FilterableThoughtGrid({ items }: { items: ThoughtItem[] }) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [hover, setHover] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? items : items.filter((i) => i.kind === filter);
    return [...list].sort((a, b) => {
      const ad = new Date(a.kind === 'op-ed' ? a.publishedAt : a.airedAt).valueOf();
      const bd = new Date(b.kind === 'op-ed' ? b.publishedAt : b.airedAt).valueOf();
      return bd - ad;
    });
  }, [items, filter]);

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const count = f.id === 'all' ? items.length : items.filter((i) => i.kind === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                active
                  ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan-soft)] text-[var(--text-primary)] shadow-[0_0_30px_-10px_var(--accent-cyan)]'
                  : 'border-[var(--border-hair)] bg-[var(--bg-glass)] text-[var(--text-muted)] hover:border-[var(--border-bright)] hover:text-[var(--text-primary)]',
              )}
              aria-pressed={active}
            >
              {f.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 font-mono text-[0.65rem]',
                  active ? 'bg-[var(--accent-cyan)] text-[var(--bg-base)]' : 'bg-[var(--bg-elevated)]',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.ul
        layout
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence>
          {filtered.map((item, idx) => {
            const date = item.kind === 'op-ed' ? item.publishedAt : item.airedAt;
            const source = item.kind === 'op-ed' ? item.outlet : item.network;
            const isHover = hover === item.slug;
            return (
              <motion.li
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
                onPointerEnter={() => setHover(item.slug)}
                onPointerLeave={() => setHover(null)}
                className={cn(
                  'glass border-gradient group relative flex min-h-[18rem] flex-col gap-4 overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1',
                  // Asymmetric sizing
                  idx === 0 && 'lg:col-span-2 lg:row-span-2 lg:min-h-[28rem]',
                )}
              >
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Open “${item.title}” at ${source}`}
                />

                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-widest',
                      item.kind === 'op-ed'
                        ? 'border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan-soft)] text-[var(--accent-cyan)]'
                        : 'border-[var(--accent-magenta)]/30 bg-[oklch(0.7_0.22_340/0.18)] text-[var(--accent-magenta)]',
                    )}
                  >
                    {item.kind === 'op-ed' ? <Newspaper className="h-3 w-3" /> : <Tv className="h-3 w-3" />}
                    {item.kind === 'op-ed' ? 'Op-Ed' : 'Television'}
                  </span>
                  <time className="font-mono text-xs text-[var(--text-faint)]" dateTime={date}>
                    {formatDate(date)}
                  </time>
                </div>

                <div className="flex items-center gap-2 border-b border-[var(--border-hair)] pb-3">
                  <OutletWordmark name={source} className="h-6 w-auto text-[var(--text-primary)]" />
                  {item.kind === 'tv' && item.program && (
                    <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
                      · {item.program}
                    </span>
                  )}
                </div>

                <h3
                  className={cn(
                    'font-serif italic leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-cyan)]',
                    idx === 0 ? 'text-3xl md:text-5xl' : 'text-2xl',
                  )}
                >
                  {item.title}
                </h3>

                <p className="text-pretty leading-relaxed text-[var(--text-muted)]">{item.teaser}</p>

                {item.kind === 'op-ed' && item.pullQuote && idx === 0 && (
                  <AnimatePresence>
                    {isHover && (
                      <motion.blockquote
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="mt-2 border-l-2 border-[var(--accent-cyan)] pl-4 font-serif text-lg italic text-[var(--accent-cyan)]"
                      >
                        “{item.pullQuote}”
                      </motion.blockquote>
                    )}
                  </AnimatePresence>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                  {item.kind === 'tv' && item.duration && (
                    <span className="font-mono text-xs text-[var(--text-faint)]">{item.duration}</span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent-cyan)]">
                    {item.kind === 'op-ed' ? `Read at ${source}` : `Watch on ${source}`}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
