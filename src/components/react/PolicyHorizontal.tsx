import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Scale, Wifi, GraduationCap, Cpu, Shield, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  scale: Scale,
  wifi: Wifi,
  'graduation-cap': GraduationCap,
  cpu: Cpu,
  shield: Shield,
};

const ACCENT_MAP = {
  cyan: 'var(--brand)',
  gold: 'var(--accent-gold)',
  magenta: 'var(--accent-magenta)',
  emerald: 'var(--accent-emerald)',
  indigo: 'oklch(0.65 0.18 280)',
} as const;

export type Policy = {
  slug: string;
  title: string;
  short: string;
  accent: keyof typeof ACCENT_MAP;
  icon: string;
  summary: string;
  points: string[];
  order: number;
};

export default function PolicyHorizontal({ policies }: { policies: Policy[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(policies.length - 1) * (100 / policies.length)}%`]);

  return (
    <div ref={ref} className="relative" style={{ height: `${policies.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{ x, width: `${policies.length * 100}%` }}
          className="flex h-full"
        >
          {policies.map((p, i) => {
            const Icon = ICON_MAP[p.icon] ?? Scale;
            const accent = ACCENT_MAP[p.accent];
            return (
              <article
                key={p.slug}
                className="relative flex h-full shrink-0 items-center justify-center px-6 md:px-16"
                style={{ width: `${100 / policies.length}%` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 opacity-90"
                  style={{
                    background: `radial-gradient(circle at 30% 50%, color-mix(in oklch, ${accent} 22%, transparent), transparent 60%)`,
                  }}
                />

                <div className="grid w-full max-w-6xl gap-10 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-5">
                    <div
                      className="grid h-16 w-16 place-items-center rounded-2xl"
                      style={{
                        background: `color-mix(in oklch, ${accent} 18%, transparent)`,
                        color: accent,
                      }}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <div
                      className="mt-6 font-mono text-xs font-medium uppercase tracking-widest"
                      style={{ color: accent }}
                    >
                      Priority {String(i + 1).padStart(2, '0')} / {String(policies.length).padStart(2, '0')}
                    </div>
                    <h3 className="mt-4 text-balance font-sans text-4xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] md:text-6xl">
                      {p.title}
                    </h3>
                    <p
                      className="mt-3 font-serif text-2xl italic"
                      style={{ color: accent }}
                    >
                      {p.short}
                    </p>
                  </div>

                  <div className="md:col-span-7">
                    <p className="text-pretty text-[var(--text-lead)] leading-relaxed text-[var(--text-muted)]">
                      {p.summary}
                    </p>
                    <ul className="mt-8 grid gap-3">
                      {p.points.map((pt, idx) => (
                        <li
                          key={idx}
                          className="glass flex items-start gap-3 rounded-2xl p-4 text-sm leading-relaxed text-[var(--text-primary)]"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: accent }}
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </motion.div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-[var(--border-hair)] bg-[var(--bg-glass)] px-4 py-2 backdrop-blur">
            {policies.map((p, i) => (
              <span
                key={p.slug}
                className="h-1.5 w-6 rounded-full bg-[var(--border-hair)]"
                style={{ background: i === 0 ? ACCENT_MAP[p.accent] : undefined }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
