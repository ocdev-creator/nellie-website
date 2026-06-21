import * as React from 'react';
import { cx } from '../util';

export type IconCircleTone = 'gradient' | 'accent' | 'violet' | 'plum' | 'lilac';
export type IconCircleSize = 'sm' | 'md' | 'lg';

export interface IconCircleProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Fill. `gradient` (default) is the pink-to-violet brand fill; the solids
   *  echo the per-feature badge colours; `lilac` is the light badge with ink glyph. */
  tone?: IconCircleTone;
  /** Circle size. */
  size?: IconCircleSize;
  /** The glyph, usually an {@link Icon}. */
  children: React.ReactNode;
}

/**
 * A filled circle holding a single glyph, the recurring badge on feature
 * rows, why-points and insight bubbles.
 */
export function IconCircle({ tone = 'gradient', size = 'md', className, children, ...rest }: IconCircleProps) {
  return (
    <span
      className={cx('nc-iconcircle', `nc-iconcircle--${tone}`, size !== 'md' && `nc-iconcircle--${size}`, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
