import { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
};

const parseNumeric = (raw: string) => {
  const m = raw.match(/[\d.,]+/);
  if (!m) return null;
  const num = parseFloat(m[0].replace(/,/g, ''));
  if (Number.isNaN(num)) return null;
  return { num, prefix: raw.slice(0, m.index), suffix: raw.slice((m.index ?? 0) + m[0].length) };
};

export default function StatCounter({ value, label, sub, duration = 1.6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const parsed = parseNumeric(value);
  const [n, setN] = useState<number>(parsed?.num ?? 0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!parsed || animated) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAnimated(true);
          let start: number | null = null;
          const step = (t: number) => {
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / (duration * 1000));
            const eased = 1 - Math.pow(1 - p, 3);
            setN(parsed.num * eased);
            if (p < 1) requestAnimationFrame(step);
            else setN(parsed.num);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [parsed, duration, animated]);

  const formatted = parsed
    ? `${parsed.prefix}${parsed.num >= 100 ? Math.round(n).toLocaleString() : n.toFixed(1).replace(/\.0$/, '')}${parsed.suffix}`
    : value;

  // Reserve container width based on the FINAL value's character count so the
  // count-up animation never reflows surrounding content. `ch` units approximate
  // the width of a tabular-numeric digit at the current font-size.
  const reservedCh = Math.max(value.length, formatted.length);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div
        className="font-mono text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl"
        style={{
          fontFeatureSettings: '"tnum" 1',
          fontVariantNumeric: 'tabular-nums',
          // Reserve at least the width the final value will occupy.
          minWidth: `${reservedCh}ch`,
          // Use a placeholder of the same final string for layout, but render
          // the live value visibly. The browser uses this for intrinsic sizing.
          minHeight: '1em',
        }}
        aria-label={value}
      >
        {formatted}
      </div>
      <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
      {sub && <div className="text-xs leading-relaxed text-[var(--text-muted)]">{sub}</div>}
    </div>
  );
}
