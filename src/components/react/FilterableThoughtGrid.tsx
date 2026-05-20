import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Newspaper, Tv, Radio } from 'lucide-react';
import { cn } from '~/lib/cn';
import OutletWordmark from './OutletWordmark';
import Image from './Image';

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
    }
  | {
      kind: 'news';
      slug: string;
      title: string;
      outlet: string;
      publishedAt: string; // ISO
      teaser: string;
      externalUrl: string;
      image?: string;
      featured?: boolean;
    };

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'op-ed', label: 'Op-Eds' },
  { id: 'news', label: 'News' },
  { id: 'tv', label: 'Television' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const getDate = (item: ThoughtItem) =>
  item.kind === 'tv' ? item.airedAt : item.publishedAt;

const getSource = (item: ThoughtItem) =>
  item.kind === 'tv' ? item.network : item.outlet;

const KindBadge = ({ kind }: { kind: ThoughtItem['kind'] }) => {
  const config = {
    'op-ed': {
      Icon: Newspaper,
      label: 'Op-Ed',
      cls: 'border-[var(--brand)]/30 bg-[var(--brand-soft)] text-[var(--brand)]',
    },
    news: {
      Icon: Radio,
      label: 'News',
      cls: 'border-[var(--accent-gold)]/30 bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]',
    },
    tv: {
      Icon: Tv,
      label: 'Television',
      cls: 'border-[var(--accent-magenta)]/30 bg-[oklch(0.7_0.22_340/0.18)] text-[var(--accent-magenta)]',
    },
  }[kind];
  const { Icon, label, cls } = config;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-widest',
        cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

export default function FilterableThoughtGrid({ items }: { items: ThoughtItem[] }) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [hover, setHover] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? items : items.filter((i) => i.kind === filter);
    return [...list].sort((a, b) => new Date(getDate(b)).valueOf() - new Date(getDate(a)).valueOf());
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
                  ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--text-primary)] shadow-[0_0_30px_-10px_var(--brand)]'
                  : 'border-[var(--border-hair)] bg-[var(--bg-glass)] text-[var(--text-muted)] hover:border-[var(--border-bright)] hover:text-[var(--text-primary)]',
              )}
              aria-pressed={active}
            >
              {f.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 font-mono text-[0.65rem]',
                  active ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-elevated)]',
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
            const date = getDate(item);
            const source = getSource(item);
            const isHover = hover === item.slug;
            const hasImage = item.kind === 'news' && item.image;
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
                  'glass border-gradient group relative flex min-h-[18rem] flex-col gap-4 overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1',
                  hasImage ? 'p-0' : 'p-6',
                  // Asymmetric sizing — first card is hero
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

                {hasImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={item.image!}
                      alt=""
                      width={800}
                      height={450}
                      sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-[var(--bg-elevated)]/20 to-transparent"
                    />
                  </div>
                )}

                <div className={cn('flex flex-col gap-4', hasImage && 'p-6 pt-2')}>
                  <div className="flex items-center justify-between">
                    <KindBadge kind={item.kind} />
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
                      'font-serif italic leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)]',
                      idx === 0 ? 'text-3xl md:text-5xl' : 'text-2xl',
                    )}
                  >
                    {item.title}
                  </h3>

                  <p className="text-pretty leading-relaxed text-[var(--text-muted)]">
                    {item.teaser}
                  </p>

                  {item.kind === 'op-ed' && item.pullQuote && idx === 0 && (
                    <AnimatePresence>
                      {isHover && (
                        <motion.blockquote
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="mt-2 border-l-2 border-[var(--brand)] pl-4 font-serif text-lg italic text-[var(--brand)]"
                        >
                          “{item.pullQuote}”
                        </motion.blockquote>
                      )}
                    </AnimatePresence>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-4">
                    {item.kind === 'tv' && item.duration && (
                      <span className="font-mono text-xs text-[var(--text-faint)]">
                        {item.duration}
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]">
                      {item.kind === 'tv'
                        ? `Watch on ${source}`
                        : item.kind === 'news'
                          ? `Read at ${source}`
                          : `Read at ${source}`}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
