import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '~/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit';
};

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[var(--accent-cyan)] text-[var(--bg-base)] shadow-[0_10px_40px_-10px_var(--accent-cyan)] hover:shadow-[0_20px_50px_-10px_var(--accent-cyan)]',
  secondary:
    'border border-[var(--border-hair)] bg-[var(--bg-glass)] text-[var(--text-primary)] backdrop-blur hover:border-[var(--border-bright)] hover:bg-[var(--bg-elevated)]',
  ghost: 'text-[var(--text-primary)] hover:text-[var(--accent-cyan)]',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-7 text-base md:text-lg',
};

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  ariaLabel,
  type = 'button',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const buttonClass = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium',
    'transition-shadow duration-300 will-change-transform',
    variantClass[variant],
    sizeClass[size],
    className,
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      data-magnetic
      className="inline-block"
    >
      {href ? (
        <a href={href} aria-label={ariaLabel} className={buttonClass}>
          {children}
        </a>
      ) : (
        <button type={type} onClick={onClick} aria-label={ariaLabel} className={buttonClass}>
          {children}
        </button>
      )}
    </motion.div>
  );
}
