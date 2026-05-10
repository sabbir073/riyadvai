import { motion } from 'motion/react';
import { cn } from '~/lib/cn';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  highlight?: string[];
};

export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  highlight = [],
}: Props) {
  const words = text.split(/\s+/);

  return (
    <span className={cn('inline-block', className)} aria-label={text}>
      {words.map((word, i) => {
        const isHighlight = highlight.some((h) => word.toLowerCase().includes(h.toLowerCase()));
        return (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden align-bottom pb-[0.1em] mr-[0.25em] last:mr-0"
          >
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + i * stagger,
              }}
              className={cn(
                'inline-block will-change-transform',
                isHighlight && 'text-gradient italic',
              )}
              style={isHighlight ? { fontFamily: 'var(--font-serif)' } : undefined}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
