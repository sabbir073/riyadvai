import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

type Quote = { quote: string; source: string; context?: string };

export default function QuoteRotator({ quotes, intervalMs = 7000 }: { quotes: Quote[]; intervalMs?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % quotes.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [quotes.length, intervalMs]);

  const q = quotes[i];

  return (
    <div className="relative min-h-[14rem] md:min-h-[10rem]">
      <AnimatePresence mode="wait">
        <motion.figure
          key={i}
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <blockquote className="font-serif text-balance text-3xl italic leading-tight text-[var(--text-primary)] md:text-5xl">
            <span aria-hidden className="mr-1 text-[var(--accent-cyan)]">“</span>
            {q.quote}
            <span aria-hidden className="ml-1 text-[var(--accent-cyan)]">”</span>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <span className="h-px w-8 bg-[var(--accent-cyan)]" />
            <span className="font-medium text-[var(--text-primary)]">{q.source}</span>
            {q.context && <span className="text-[var(--text-faint)]">— {q.context}</span>}
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <div className="absolute -bottom-4 left-0 flex gap-1">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Show quote ${idx + 1}`}
            className="h-1 w-8 overflow-hidden rounded-full bg-[var(--border-hair)]"
          >
            <span
              className="block h-full bg-[var(--accent-cyan)] transition-all duration-300"
              style={{ width: idx === i ? '100%' : '0%' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
