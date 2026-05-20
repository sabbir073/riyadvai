import type { CSSProperties, ImgHTMLAttributes } from 'react';

/**
 * Reusable, performance-conscious image primitive for React islands.
 *
 * Why this exists:
 *  - Forces every consumer to specify width + height — kills CLS by giving the
 *    browser an intrinsic aspect ratio to reserve before the image loads.
 *  - Defaults loading="lazy" + decoding="async" so off-screen images never
 *    block the main thread on first paint.
 *  - `priority` opts a single above-the-fold image into eager + fetchpriority="high".
 *  - Passes through className/style/sizes for flexibility.
 *
 * Source images are pre-optimised WebP via `npm run images:optimize`
 * (scripts/optimize-images.mjs), so this component does NOT generate srcset
 * itself — it just wires the right loading attributes.
 */

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'decoding'> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold? Sets eager + fetchpriority="high". */
  priority?: boolean;
  /** Override loading mode if you really need to. */
  loading?: 'eager' | 'lazy';
  /** Responsive sizes hint (e.g. "(min-width:768px) 50vw, 100vw"). */
  sizes?: string;
};

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  loading,
  sizes,
  ...rest
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      // @ts-expect-error — fetchpriority is a valid HTML attribute, React typings lag.
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      sizes={sizes}
      className={className}
      style={style}
      {...rest}
    />
  );
}
