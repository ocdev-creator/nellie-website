import * as React from 'react';
import { cx } from '../util';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface. `white` (default) or the pale-pink `soft`. */
  tone?: 'white' | 'soft';
  /** Remove the inner padding (for cards whose first child is a full-bleed image). */
  flush?: boolean;
  children: React.ReactNode;
}

/**
 * A rounded surface with the soft purple-tinted brand shadow. The base for
 * step cards, plan cards and any boxed content.
 */
export function Card({ tone = 'white', flush = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cx('nc-card', tone === 'soft' && 'nc-card--soft', flush && 'nc-card--flush', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
