import * as React from 'react';
import { cx } from '../util';

export interface LogoLockupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sub-brand suffix set tight in the pink accent, e.g. "connect" -> nellieconnect. */
  suffix?: string;
  /** White wordmark for dark backgrounds. */
  inverse?: boolean;
  /** Font size in pixels. */
  size?: number;
}

/**
 * The Nellie wordmark lockup: lowercase "nellie" in Nunito, with an optional
 * sub-brand suffix ("connect") set tight in the pink accent.
 */
export function LogoLockup({ suffix, inverse = false, size = 24, className, style, ...rest }: LogoLockupProps) {
  return (
    <span
      className={cx('nc-lockup', inverse && 'nc-lockup--inverse', className)}
      style={{ fontSize: `${size}px`, ...style }}
      {...rest}
    >
      nellie{suffix ? <span className="nc-lockup__suffix">{suffix}</span> : null}
    </span>
  );
}
