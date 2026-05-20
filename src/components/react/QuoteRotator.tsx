import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pause, Play } from 'lucide-react';

type Quote = { quote: string; source: string; context?: string };

export default function QuoteRotator({
  quotes,
  intervalMs = 7000,
}: {
  quotes: Quote[];
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % quotes.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [quotes.length, intervalMs, paused]);

  const q = quotes[i];

  return (
    <div
      className="flex flex-col gap-8"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Selected quotes by Reyad Hasnain"
    >
      {/* Quote area — CSS grid stacks all crossfading versions in one cell so the
          parent grows to fit the tallest, and nothing absolute-positions over the dots. */}
      <div className="relative grid">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="col-start-1 row-start-1 m-0"
          >
            <blockquote className="text-balance font-serif text-2xl italic leading-[1.15] text-[var(--text-primary)] sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              <span aria-hidden className="mr-1 inline-block align-top text-[var(--brand)]">
                “
              </span>
              {q.quote}
              <span aria-hidden className="ml-1 inline-block align-top text-[var(--brand)]">
                ”
              </span>
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]">
              <span className="h-px w-8 bg-[var(--brand)]" aria-hidden />
              <span className="font-medium text-[var(--text-primary)]">{q.source}</span>
              {q.context && (
                <>
                  <span aria-hidden className="hidden text-[var(--text-faint)] sm:inline">
                    —
                  </span>
                  <span className="text-[var(--text-faint)]">{q.context}</span>
                </>
              )}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {/* Controls — always below the quote, never overlapping */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hair)] pt-5">
        <div
          role="tablist"
          aria-label="Quote selector"
          className="flex items-center gap-2"
        >
          {quotes.map((_, idx) => {
            const active = idx === i;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setI(idx)}
                aria-label={`Show quote ${idx + 1} of ${quotes.length}`}
                /* 44×44 hit area for accessibility, with a smaller visible dot inside.
                   Lighthouse / WCAG 2.5.5 want at least 44px square for touch targets. */
                className="group relative grid h-11 place-items-center overflow-visible bg-transparent transition-all"
                style={{ width: active ? '3.75rem' : '1.75rem' }}
              >
                <span
                  aria-hidden
                  className="block h-2 overflow-hidden rounded-full bg-[var(--border-hair)] transition-all"
                  style={{ width: active ? '3rem' : '0.75rem' }}
                >
                  <span
                    className="block h-full origin-left bg-[var(--brand)] transition-transform"
                    style={{
                      transform: active ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                    }}
                  />
                </span>
              </button>
            );
          })}
          <span className="ml-2 font-mono text-xs text-[var(--text-faint)]">
            {String(i + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-hair)] bg-[var(--bg-glass)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] backdrop-blur transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
    </div>
  );
}
