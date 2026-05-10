import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CursorLayer() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.4 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target?.closest('a, button, [data-magnetic]'));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          width: hovering ? 56 : 12,
          height: hovering ? 56 : 12,
          background: hovering
            ? 'transparent'
            : 'oklch(0.96 0.005 250)',
          border: hovering ? '1px solid oklch(0.96 0.005 250)' : 'none',
          transition: 'width 0.25s var(--ease-out-expo), height 0.25s var(--ease-out-expo), background 0.25s, border 0.25s',
        }}
      />
    </>
  );
}
