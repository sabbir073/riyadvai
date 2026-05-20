import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import Image from './Image';

export type Chapter = {
  year: string;
  title: string;
  body: string;
  accent: 'cyan' | 'gold' | 'magenta' | 'emerald' | 'indigo';
};

const ACCENT: Record<Chapter['accent'], string> = {
  cyan: 'var(--brand)',
  gold: 'var(--accent-gold)',
  magenta: 'var(--accent-magenta)',
  emerald: 'var(--accent-emerald)',
  indigo: 'oklch(0.65 0.18 280)',
};

// Each chapter: reveals (fade + slide) on scroll INTO view, then stays at full
// opacity. No fade-out as you scroll past — past chapters remain readable.
// Active-chapter highlighting is done via the left accent rail, not by dimming
// the body text.
function ChapterBlock({ chapter }: { chapter: Chapter }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative py-12 pl-7 md:py-16 md:pl-10"
    >
      {/* Left accent rail — chapter colour, full opacity always */}
      <span
        aria-hidden
        className="absolute bottom-2 left-0 top-2 w-px rounded-full"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${ACCENT[chapter.accent]} 20%, ${ACCENT[chapter.accent]} 80%, transparent 100%)`,
        }}
      />
      {/* Dot at the rail's midpoint */}
      <span
        aria-hidden
        className="absolute left-[-3px] top-[3.5rem] h-1.5 w-1.5 rounded-full ring-4 ring-[var(--bg-base)]"
        style={{ background: ACCENT[chapter.accent] }}
      />

      <div
        className="font-mono text-sm font-semibold uppercase tracking-[0.2em]"
        style={{ color: ACCENT[chapter.accent] }}
      >
        {chapter.year}
      </div>
      <h3 className="mt-3 font-serif text-3xl italic leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
        {chapter.title}
      </h3>
      <p className="mt-4 max-w-xl text-pretty text-[var(--text-lead)] leading-relaxed text-[var(--text-muted)]">
        {chapter.body}
      </p>
    </motion.article>
  );
}

export default function StickyChapters({
  chapters,
  imageUrl,
  imageAlt,
}: {
  chapters: Chapter[];
  imageUrl: string;
  imageAlt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Background hue rotates as scroll progresses — subtle tint shift on the
  // sticky portrait so the section feels alive.
  const tint = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [
    'rgb(255 102 0 / 0.12)',
    'oklch(0.82 0.13 85 / 0.12)',
    'oklch(0.7 0.22 340 / 0.12)',
    'oklch(0.7 0.18 165 / 0.12)',
    'oklch(0.65 0.18 280 / 0.12)',
  ]);

  // Vignette intensity follows scroll too
  const vignetteOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.3, 0.5, 0.7],
  );

  return (
    <div ref={ref} className="relative grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
      {/* Sticky photo column */}
      <div className="relative md:col-span-5">
        <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--border-hair)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={800}
            height={1000}
            priority
            className="h-full w-full object-cover"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: tint }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 100% 70% at 50% 100%, var(--bg-base), transparent 70%)',
              opacity: vignetteOpacity,
            }}
          />
        </div>
      </div>

      {/* Scrolling chapters */}
      <div className="md:col-span-7">{chapters.map((c) => <ChapterBlock key={c.year} chapter={c} />)}</div>
    </div>
  );
}
