import { motion } from 'motion/react';
import {
  Scale,
  Wifi,
  GraduationCap,
  Cpu,
  Shield,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  scale: Scale,
  wifi: Wifi,
  'graduation-cap': GraduationCap,
  cpu: Cpu,
  shield: Shield,
};

const ACCENT_MAP = {
  cyan: 'var(--accent-cyan)',
  gold: 'var(--accent-gold)',
  magenta: 'var(--accent-magenta)',
  emerald: 'var(--accent-emerald)',
  indigo: 'oklch(0.65 0.18 280)',
} as const;

const ACCENT_SOFT_MAP: Record<keyof typeof ACCENT_MAP, string> = {
  cyan: 'oklch(0.78 0.18 220 / 0.18)',
  gold: 'oklch(0.82 0.13 85 / 0.18)',
  magenta: 'oklch(0.7 0.22 340 / 0.18)',
  emerald: 'oklch(0.7 0.18 165 / 0.18)',
  indigo: 'oklch(0.65 0.18 280 / 0.18)',
};

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

function PolicySection({ policy, index, total }: { policy: Policy; index: number; total: number }) {
  const Icon = ICON_MAP[policy.icon] ?? Scale;
  const accent = ACCENT_MAP[policy.accent];
  const accentSoft = ACCENT_SOFT_MAP[policy.accent];
  const isReversed = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Soft accent halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: isReversed
            ? `radial-gradient(ellipse 60% 50% at 90% 50%, ${accentSoft}, transparent 60%)`
            : `radial-gradient(ellipse 60% 50% at 10% 50%, ${accentSoft}, transparent 60%)`,
        }}
      />

      <div
        className={`grid items-center gap-10 md:gap-16 lg:grid-cols-12 ${
          isReversed ? '[&>div:first-child]:lg:order-2' : ''
        }`}
      >
        {/* LEFT (or RIGHT) — Visual / number / icon */}
        <div className="lg:col-span-5">
          <div className="relative">
            {/* Giant number behind everything */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-2 -top-12 select-none font-mono text-[12rem] font-semibold leading-none opacity-[0.06] md:text-[18rem]"
              style={{ color: accent }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="relative flex flex-col gap-6">
              {/* Icon chip */}
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl shadow-[0_15px_40px_-15px_currentColor]"
                style={{ background: accentSoft, color: accent }}
              >
                <Icon className="h-7 w-7" />
              </div>

              {/* Index pill */}
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: accent }}
                >
                  Priority {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-[var(--border-hair)]" style={{ maxWidth: '5rem' }} />
              </div>

              {/* Title */}
              <h3 className="text-balance font-sans text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
                {policy.title}
              </h3>

              {/* Short tagline */}
              <p className="font-serif text-xl italic leading-snug md:text-2xl" style={{ color: accent }}>
                {policy.short}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT (or LEFT) — Body + bullets */}
        <div className="lg:col-span-7">
          <div className="glass border-gradient relative rounded-3xl p-7 md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${accent}, transparent 65%)`,
                filter: 'blur(40px)',
              }}
            />

            <p className="text-pretty text-[var(--text-lead)] leading-relaxed text-[var(--text-muted)]">
              {policy.summary}
            </p>

            <ul className="mt-8 grid gap-3 border-t border-[var(--border-hair)] pt-7">
              {policy.points.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--text-primary)]"
                >
                  <span
                    className="mt-2 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                    style={{ background: accentSoft, color: accent }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <span>{p}</span>
                </motion.li>
              ))}
            </ul>

            <a
              href="/contact"
              className="group/cta mt-8 inline-flex items-center gap-1.5 self-start text-sm font-medium transition-all hover:gap-2"
              style={{ color: accent }}
            >
              Discuss this priority with Reyad
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Subtle horizontal divider between sections (not after the last) */}
      {index < total - 1 && (
        <div
          aria-hidden
          className="mx-auto mt-24 h-px max-w-2xl bg-gradient-to-r from-transparent via-[var(--border-hair)] to-transparent md:mt-32"
        />
      )}
    </motion.article>
  );
}

export default function PolicyStack({ policies }: { policies: Policy[] }) {
  return (
    <div className="flex flex-col gap-24 md:gap-32">
      {policies.map((p, i) => (
        <PolicySection key={p.slug} policy={p} index={i} total={policies.length} />
      ))}
    </div>
  );
}
