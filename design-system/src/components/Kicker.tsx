import * as React from 'react';
import { cx } from '../util';

export interface KickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * A small uppercase label with a short accent underline, sitting above a
 * heading to introduce a section (e.g. "how it works", "the solution").
 */
export function Kicker({ className, children, ...rest }: KickerProps) {
  return (
    <span className={cx('nc-kicker', className)} {...rest}>
      {children}
    </span>
  );
}
