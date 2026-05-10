import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, MapPin } from 'lucide-react';
import { cn } from '~/lib/cn';

export type Role = {
  slug: string;
  role: string;
  company: string;
  location: string;
  startYear: number;
  endYear: number | null;
  summary: string;
  achievements: string[];
};

export default function ExperienceTimeline({ roles }: { roles: Role[] }) {
  const [open, setOpen] = useState<string | null>(roles[0]?.slug ?? null);

  return (
    <div className="relative">
      {/* Vertical track */}
      <div
        aria-hidden
        className="absolute bottom-0 left-[7.5rem] top-0 hidden w-px bg-gradient-to-b from-[var(--accent-cyan)] via-[var(--border-hair)] to-transparent md:block"
      />

      <ul className="flex flex-col gap-4">
        {roles.map((r, i) => {
          const isOpen = open === r.slug;
          const period = r.endYear ? `${r.startYear} — ${r.endYear}` : `${r.startYear} — Today`;
          return (
            <li key={r.slug} className="grid gap-6 md:grid-cols-[8rem_1fr]">
              {/* Year marker */}
              <div className="relative flex items-start gap-4 md:sticky md:top-24 md:h-fit">
                <span
                  className={cn(
                    'font-mono text-sm transition-colors',
                    isOpen ? 'text-[var(--accent-gold)]' : 'text-[var(--text-faint)]',
                  )}
                >
                  {period.split(' — ')[0]}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'mt-1.5 hidden h-3 w-3 rounded-full transition-all md:block',
                    isOpen
                      ? 'bg-[var(--accent-cyan)] shadow-[0_0_30px_var(--accent-cyan)]'
                      : 'bg-[var(--bg-elevated)] ring-1 ring-[var(--border-hair)]',
                  )}
                />
              </div>

              {/* Card */}
              <motion.article
                layout
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass border-gradient rounded-3xl p-6 md:p-8"
              >
                <header className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-widest text-[var(--accent-cyan)]">
                      {r.role}
                    </span>
                    <h3 className="font-serif text-3xl italic leading-tight text-[var(--text-primary)] md:text-4xl">
                      {r.company}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                      <span className="font-mono">{period}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {r.location}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : r.slug)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Collapse ${r.company}` : `Expand ${r.company}`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-hair)] bg-[var(--bg-glass)] backdrop-blur transition hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </header>

                <p className="mt-4 text-pretty leading-relaxed text-[var(--text-muted)]">
                  {r.summary}
                </p>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-6 flex flex-col gap-3 border-t border-[var(--border-hair)] pt-6">
                        {r.achievements.map((a, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * idx, duration: 0.4 }}
                            className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-muted)]"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                            <span>{a}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
