import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

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

function ChapterBlock({
  chapter,
  index,
  total,
  progress,
}: {
  chapter: Chapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.05), start + 0.05, end - 0.05, Math.min(1, end + 0.05)],
    [0.15, 1, 1, 0.15],
  );
  const x = useTransform(progress, [start, end], [0, -8]);

  return (
    <motion.article
      style={{ opacity, x }}
      className="flex min-h-[80vh] flex-col justify-center gap-4 border-l border-[var(--border-hair)] py-16 pl-8"
    >
      <div
        className="font-mono text-sm font-medium"
        style={{ color: ACCENT[chapter.accent] }}
      >
        {chapter.year}
      </div>
      <h3 className="font-serif text-4xl italic leading-tight text-[var(--text-primary)] md:text-5xl">
        {chapter.title}
      </h3>
      <p className="max-w-xl text-pretty text-[var(--text-lead)] text-[var(--text-muted)] leading-relaxed">
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

  // background hue rotates as scroll progresses
  const tint = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [
    'oklch(0.78 0.18 220 / 0.12)',
    'oklch(0.82 0.13 85 / 0.12)',
    'oklch(0.7 0.22 340 / 0.12)',
    'oklch(0.7 0.18 165 / 0.12)',
    'oklch(0.65 0.18 280 / 0.12)',
  ]);

  return (
    <div ref={ref} className="relative grid gap-8 md:grid-cols-12">
      {/* Sticky photo column */}
      <div className="relative md:col-span-5">
        <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--border-hair)]">
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: tint }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/80 via-transparent to-transparent"
          />
        </div>
      </div>

      {/* Scrolling chapters */}
      <div className="md:col-span-7">
        {chapters.map((c, i) => (
          <ChapterBlock
            key={c.year}
            chapter={c}
            index={i}
            total={chapters.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
