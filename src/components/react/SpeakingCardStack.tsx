import { motion } from 'motion/react';
import { Mic, Calendar, MapPin } from 'lucide-react';

export type Engagement = {
  slug: string;
  title: string;
  event: string;
  location: string;
  date: string; // ISO
  type: 'keynote' | 'panel' | 'workshop' | 'fireside' | 'tv' | 'roundtable';
  summary: string;
  upcoming: boolean;
};

const ACCENT_BY_TYPE: Record<Engagement['type'], string> = {
  keynote: 'var(--accent-cyan)',
  panel: 'var(--accent-gold)',
  workshop: 'var(--accent-emerald)',
  fireside: 'var(--accent-magenta)',
  tv: 'oklch(0.65 0.18 280)',
  roundtable: 'var(--accent-cyan)',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function SpeakingCardStack({ engagements }: { engagements: Engagement[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {engagements.map((e, i) => (
        <motion.li
          key={e.slug}
          initial={{ opacity: 0, y: 30, rotate: -1 + i * 0.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          whileHover={{ y: -6, rotate: i % 2 === 0 ? -0.7 : 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
          className="glass border-gradient relative flex flex-col gap-4 rounded-3xl p-8"
          style={{
            boxShadow: '0 25px 60px -25px rgb(0 0 0 / 0.6)',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-widest"
              style={{
                background: `color-mix(in oklch, ${ACCENT_BY_TYPE[e.type]} 18%, transparent)`,
                color: ACCENT_BY_TYPE[e.type],
              }}
            >
              <Mic className="h-3 w-3" />
              {e.type}
            </span>
            {e.upcoming && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan-soft)] px-2.5 py-1 text-xs font-medium uppercase tracking-widest text-[var(--accent-cyan)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
                Upcoming
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <time>{formatDate(e.date)}</time>
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {e.location}
            </span>
          </div>

          <h3 className="font-serif text-3xl italic leading-tight">{e.title}</h3>
          <span className="text-sm font-medium text-[var(--accent-cyan)]">{e.event}</span>
          <p className="text-pretty leading-relaxed text-[var(--text-muted)]">{e.summary}</p>
        </motion.li>
      ))}
    </ul>
  );
}
