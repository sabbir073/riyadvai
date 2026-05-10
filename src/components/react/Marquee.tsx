import { cn } from '~/lib/cn';

type Props = {
  items: string[];
  speed?: number;
  className?: string;
};

export default function Marquee({ items, speed = 35, className }: Props) {
  const list = (
    <ul
      className="marquee__track"
      style={{ animationDuration: `${speed}s` }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="font-serif text-2xl italic text-[var(--text-muted)] md:text-3xl"
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn('marquee py-8', className)} aria-label="Featured publications">
      {list}
      {/* duplicate for seamless loop */}
      <ul
        className="marquee__track"
        aria-hidden
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((item, i) => (
          <li
            key={`d-${i}`}
            className="font-serif text-2xl italic text-[var(--text-muted)] md:text-3xl"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
