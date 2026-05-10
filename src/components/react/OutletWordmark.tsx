import type { CSSProperties } from 'react';

type Props = {
  name: string;
  className?: string;
  style?: CSSProperties;
};

// Inline SVG wordmarks — typographic recreations, brand-appropriate, no copyrighted file usage.
export default function OutletWordmark({ name, className, style }: Props) {
  const common = { className, style: { color: 'currentColor', ...style } };

  switch (name) {
    case 'The Daily Star':
      return (
        <svg viewBox="0 0 220 38" xmlns="http://www.w3.org/2000/svg" aria-label="The Daily Star" {...common}>
          <text
            x="0"
            y="28"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight={700}
            fontSize={26}
            letterSpacing={-1}
            fill="currentColor"
          >
            The Daily Star
          </text>
        </svg>
      );
    case 'The Financial Express':
      return (
        <svg viewBox="0 0 280 38" xmlns="http://www.w3.org/2000/svg" aria-label="The Financial Express" {...common}>
          <text
            x="0"
            y="28"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight={700}
            fontSize={22}
            letterSpacing={-0.5}
            fill="currentColor"
          >
            THE FINANCIAL EXPRESS
          </text>
        </svg>
      );
    case 'Daily Sun':
      return (
        <svg viewBox="0 0 160 42" xmlns="http://www.w3.org/2000/svg" aria-label="Daily Sun" {...common}>
          <circle cx={20} cy={21} r={14} fill="none" stroke="currentColor" strokeWidth={2} />
          <circle cx={20} cy={21} r={6} fill="currentColor" />
          <text
            x={46}
            y={29}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={800}
            fontSize={22}
            letterSpacing={-0.5}
            fill="currentColor"
          >
            daily sun
          </text>
        </svg>
      );
    case 'Dhaka Tribune':
      return (
        <svg viewBox="0 0 220 38" xmlns="http://www.w3.org/2000/svg" aria-label="Dhaka Tribune" {...common}>
          <text x={0} y={28} fontFamily="Inter, system-ui, sans-serif" fontWeight={800} fontSize={24} letterSpacing={-0.5} fill="currentColor">
            DHAKA
          </text>
          <text x={92} y={28} fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize={24} fill="currentColor">
            Tribune
          </text>
        </svg>
      );
    case 'Channel 24':
      return (
        <svg viewBox="0 0 180 42" xmlns="http://www.w3.org/2000/svg" aria-label="Channel 24" {...common}>
          <rect x={0} y={6} width={38} height={32} rx={4} fill="currentColor" />
          <text x={6} y={30} fontFamily="Inter, system-ui, sans-serif" fontWeight={900} fontSize={20} fill="var(--bg-base, white)">
            24
          </text>
          <text x={48} y={29} fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize={22} letterSpacing={-0.5} fill="currentColor">
            Channel
          </text>
        </svg>
      );
    case 'ETV':
      return (
        <svg viewBox="0 0 100 42" xmlns="http://www.w3.org/2000/svg" aria-label="ETV" {...common}>
          <rect x={0} y={6} width={92} height={32} rx={4} fill="none" stroke="currentColor" strokeWidth={2} />
          <text
            x={46}
            y={29}
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={900}
            fontSize={22}
            letterSpacing={2}
            fill="currentColor"
          >
            ETV
          </text>
        </svg>
      );
    case 'Independent TV':
      return (
        <svg viewBox="0 0 220 38" xmlns="http://www.w3.org/2000/svg" aria-label="Independent TV" {...common}>
          <text x={0} y={28} fontFamily="Inter, system-ui, sans-serif" fontWeight={700} fontSize={22} letterSpacing={-0.5} fill="currentColor">
            Independent
          </text>
          <text x={148} y={28} fontFamily="Inter, system-ui, sans-serif" fontWeight={900} fontSize={22} letterSpacing={1} fill="currentColor">
            TV
          </text>
        </svg>
      );
    case '71 TV':
      return (
        <svg viewBox="0 0 110 42" xmlns="http://www.w3.org/2000/svg" aria-label="71 TV" {...common}>
          <text x={0} y={32} fontFamily="Inter, system-ui, sans-serif" fontWeight={900} fontSize={32} letterSpacing={-1} fill="currentColor">
            71
          </text>
          <text x={50} y={32} fontFamily="Inter, system-ui, sans-serif" fontWeight={900} fontSize={22} letterSpacing={1} fill="currentColor">
            TV
          </text>
          <line x1={0} y1={38} x2={100} y2={38} stroke="currentColor" strokeWidth={2} />
        </svg>
      );
    default:
      return (
        <span
          className={className}
          style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '0.95rem', ...style }}
        >
          {name}
        </span>
      );
  }
}
