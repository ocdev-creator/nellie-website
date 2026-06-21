import * as React from 'react';
import { cx } from '../util';

export type ButtonVariant = 'primary' | 'deep' | 'bright' | 'grape' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is the soft gradient pill; `bright`/`grape` are the
   *  solid accent pills used on pricing; `ghost` is the white pill on dark bands. */
  variant?: ButtonVariant;
  /** Pill size. */
  size?: ButtonSize;
  /** Optional icon, rendered before the label by default. */
  icon?: React.ReactNode;
  /** Put the icon after the label instead of before it. */
  iconAfter?: boolean;
  children: React.ReactNode;
}

/**
 * The Nellie button: a fully-rounded pill in the brand purples. Use `primary`
 * for the main call to action, `ghost` on dark or photographic backgrounds.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx('nc-btn', `nc-btn--${variant}`, size !== 'md' && `nc-btn--${size}`, className)}
      {...rest}
    >
      {icon && !iconAfter ? icon : null}
      <span>{children}</span>
      {icon && iconAfter ? icon : null}
    </button>
  );
}
