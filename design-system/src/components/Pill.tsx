import * as React from 'react';
import { cx } from '../util';

export type PillTone = 'lilac' | 'pink' | 'solid' | 'accent' | 'tag' | 'perk';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colour treatment. `lilac` (default) and `pink` are soft; `solid`/`accent`
   *  are filled; `tag` is the uppercase step label; `perk` is the outlined chip. */
  tone?: PillTone;
  /** Optional small icon before the label. */
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * A rounded pill / chip. Used for the floating value props, the "step one"
 * tags, perks beneath a price, and small labels throughout the site.
 */
export function Pill({ tone = 'lilac', icon, className, children, ...rest }: PillProps) {
  return (
    <span className={cx('nc-pill', `nc-pill--${tone}`, className)} {...rest}>
      {icon}
      <span>{children}</span>
    </span>
  );
}
