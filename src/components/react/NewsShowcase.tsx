import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Newspaper } from 'lucide-react';

export type NewsItem = {
  slug: string;
  title: string;
  outlet: string;
  publishedAt: string; // ISO
  teaser: string;
  externalUrl: string;
  image?: string;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/* ── Screenshot lightbox with "Read news" button ───────────────────── */
export function NewsLightbox({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose]);

  // Portal to <body>: escapes every stacking context / transformed ancestor on
  // the page, so nothing can render on top of or bleed through the popup.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/85"
      />

      <div className="relative isolate flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border-hair)] bg-[var(--bg-base)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-hair)] px-5 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--brand)]">
              {item.outlet} · {fmtDate(item.publishedAt)}
            </p>
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border-hair)] text-[var(--text-muted)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Screenshot (scrolls if tall). data-lenis-prevent stops the site's
            Lenis smooth-scroll from hijacking wheel events inside the popup. */}
        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--bg-base)]">
          {item.image ? (
            <img src={item.image} alt={`${item.outlet} — ${item.title}`} className="w-full" />
          ) : (
            <div className="grid h-64 place-items-center text-sm text-[var(--text-muted)]">
              No screenshot available
            </div>
          )}
        </div>

        {/* Footer: Read news */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border-hair)] px-5 py-3">
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium text-white transition-all hover:-translate-y-px"
            style={{ background: 'var(--brand-gradient)' }}
          >
            Read news
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ── Side card — same design language as the original op-ed side cards ── */
function SideCard({ item, onOpen }: { item: NewsItem; onOpen: (n: NewsItem) => void }) {
  return (
    <article
      onClick={() => onOpen(item)}
      className="glass border-gradient group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl transition-transform hover:-translate-y-1"
    >
      <div className="flex flex-1 flex-col gap-2.5 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--brand)]">
            {item.outlet}
          </span>
          <time className="font-mono text-xs text-[var(--text-faint)]">
            {fmtDate(item.publishedAt)}
          </time>
        </div>

        <h3 className="line-clamp-2 font-serif text-balance text-xl italic leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)] md:text-2xl">
          {item.title}
        </h3>

        {/* Screenshot — just below the title */}
        {item.image && (
          <div className="relative mt-1 h-24 w-full overflow-hidden rounded-xl border border-[var(--border-hair)] md:h-28">
            <img
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)]/70 to-transparent"
            />
          </div>
        )}

        <div className="mt-auto flex items-center justify-end pt-1">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand)]">
            View coverage
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ── Section: hero (latest) + two side cards rotating every 3 seconds ── */
export default function NewsShowcase({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<NewsItem | null>(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const hero = items[0];
  const rest = items.slice(1);
  const pages = Math.max(1, Math.ceil(rest.length / 2));

  // Rotate the two side cards every 3 seconds (paused while hovering or
  // while the lightbox is open).
  useEffect(() => {
    if (paused || active || pages <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % pages), 3000);
    return () => clearInterval(id);
  }, [paused, active, pages]);

  if (!items.length) return null;

  const pair = rest.slice(page * 2, page * 2 + 2);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-12">
        {/* ── Hero: latest news ── */}
        <div className="md:col-span-7">
          <article
            onClick={() => setActive(hero)}
            className="glass border-gradient group relative flex h-full min-h-[28rem] cursor-pointer flex-col gap-5 overflow-hidden rounded-3xl p-8 transition-transform hover:-translate-y-1 md:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[var(--brand-soft)] blur-3xl transition-opacity group-hover:opacity-100"
              style={{ opacity: 0.5 }}
            />

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium uppercase tracking-widest text-[var(--brand)]">
                <Newspaper className="h-3 w-3" />
                Latest
              </span>
              <time className="font-mono text-xs text-[var(--text-faint)]">
                {fmtDate(hero.publishedAt)}
              </time>
            </div>

            <h3 className="font-serif text-balance text-3xl italic leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)] md:text-5xl">
              {hero.title}
            </h3>

            <p className="text-pretty leading-relaxed text-[var(--text-muted)]">{hero.teaser}</p>

            {hero.image && (
              <div className="relative mt-2 max-h-56 overflow-hidden rounded-2xl border border-[var(--border-hair)]">
                <img
                  src={hero.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover object-top"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent"
                />
              </div>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-[var(--border-hair)] pt-6">
              <span className="font-mono text-xs text-[var(--text-faint)]">{hero.outlet}</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--brand)]">
                View coverage
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </article>
        </div>

        {/* ── Two side cards, rotating through all news every 3s ── */}
        <div
          className="md:col-span-5"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid h-full grid-rows-2 gap-6"
            >
              {pair.map((item) => (
                <SideCard key={item.slug} item={item} onOpen={setActive} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {active && <NewsLightbox item={active} onClose={() => setActive(null)} />}
    </>
  );
}
