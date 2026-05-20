import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Scale,
  Network,
  Mic,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import Image from './Image';

type Pillar = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  href: string;
  cta: string;
  accent: string;
  accentSoft: string;
  image: string;
};

const PILLARS: Pillar[] = [
  {
    icon: Scale,
    eyebrow: 'Policy',
    title: 'Reform that scales ICT exports.',
    body:
      'Modernising telecom and digital regulation to unlock investment, attract global technology capital, and let Bangladesh compete in the global IT-enabled services market.',
    bullets: [
      'Twelve years of op-eds in The Daily Star, Financial Express, Daily Sun.',
      'Five concrete policy priorities — regulation, inclusion, skills, AI, sovereignty.',
      "The argument: ICT can be Bangladesh's next RMG.",
    ],
    href: '/policy',
    cta: 'See the five priorities',
    accent: 'var(--brand)',
    accentSoft: 'var(--brand-soft)',
    image: '/images/hero/network.webp',
  },
  {
    icon: Network,
    eyebrow: 'Industry',
    title: 'Operator who has shipped at scale.',
    body:
      'Twenty years of building telecoms in real emerging markets — across Asia, Africa, Europe, and North America. Smart Lab, Mahindra Comviva, Nokia Siemens Networks, Siemens.',
    bullets: [
      '€11.2M+ in negotiated telecom infrastructure deals at NSN.',
      'Led nationwide mobile financial service expansion at Comviva.',
      '100% YoY revenue growth across emerging-market portfolios.',
    ],
    href: '/experience',
    cta: 'Read the career timeline',
    accent: 'var(--accent-gold)',
    accentSoft: 'var(--accent-gold-soft)',
    image: '/images/hero/fiber.webp',
  },
  {
    icon: Mic,
    eyebrow: 'Public voice',
    title: 'The commentator the press calls.',
    body:
      "Op-eds in Bangladesh's leading dailies and regular policy commentary on national television. The voice editors and producers reach for when the question is telecom, MFS, AI, or the digital economy.",
    bullets: [
      'Op-Eds: The Daily Star, The Financial Express, Daily Sun, Dhaka Tribune.',
      'Television: Channel 24, ETV, Independent TV, 71 TV.',
      'Six published op-eds; two on-record TV interviews.',
    ],
    href: '/thought-leadership',
    cta: 'See the writing & TV',
    accent: 'var(--accent-magenta)',
    accentSoft: 'oklch(0.7 0.22 340 / 0.18)',
    image: '/images/hero/abstract-mesh.webp',
  },
];

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const Icon = pillar.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.12,
      }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      style={{ transformPerspective: 1200, transformOrigin: '50% 100%' }}
      className="glass border-gradient relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl p-7 will-change-transform md:p-9"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-50"
        style={{
          background: `radial-gradient(circle, ${pillar.accent}, transparent 65%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Decorative image, top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-32 w-32 overflow-hidden rounded-bl-[3rem] opacity-30"
      >
        <Image src={pillar.image} alt="" width={256} height={256} className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, transparent, ${pillar.accent})`,
            mixBlendMode: 'soft-light',
          }}
        />
      </div>

      {/* Top row: icon + index */}
      <div className="flex items-center justify-between">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl shadow-lg"
          style={{ background: pillar.accentSoft, color: pillar.accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span
          className="font-mono text-xs font-medium uppercase tracking-widest"
          style={{ color: pillar.accent }}
        >
          {String(index + 1).padStart(2, '0')} / {String(PILLARS.length).padStart(2, '0')}
        </span>
      </div>

      <span
        className="text-xs font-medium uppercase tracking-[0.2em]"
        style={{ color: pillar.accent }}
      >
        {pillar.eyebrow}
      </span>

      <h3 className="font-serif text-3xl italic leading-tight text-[var(--text-primary)] md:text-4xl">
        {pillar.title}
      </h3>

      <p className="text-pretty leading-relaxed text-[var(--text-muted)]">{pillar.body}</p>

      <ul className="mt-2 flex flex-col gap-2.5 border-t border-[var(--border-hair)] pt-5">
        {pillar.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-muted)]">
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full"
              style={{ background: pillar.accent }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <a
        href={pillar.href}
        className="group/cta mt-auto inline-flex items-center gap-1.5 self-start text-sm font-medium transition-all hover:gap-2"
        style={{ color: pillar.accent }}
      >
        {pillar.cta}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
      </a>
    </motion.article>
  );
}

export default function PillarsScrollLock() {
  // Subtle parallax on the section as it passes through the viewport
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className="page-x relative pb-24 pt-8 md:pt-12">
      <motion.div
        style={{ y }}
        className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-3"
      >
        {PILLARS.map((p, i) => (
          <PillarCard key={p.eyebrow} pillar={p} index={i} />
        ))}
      </motion.div>
    </div>
  );
}
