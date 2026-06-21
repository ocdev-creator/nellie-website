import * as React from 'react';
import { cx } from '../util';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, 1 (largest) to 3. Sets both the tag and the size. */
  level?: 1 | 2 | 3;
  /** Centre the heading. */
  align?: 'left' | 'center';
  children: React.ReactNode;
}

/**
 * A display heading in Nunito, brand-ink purple. Wrap a word or phrase in
 * {@link Highlight} to pick it out in the bright pink accent, the way the site
 * heads read ("the connections that shaped someone's life begin to fade").
 */
export function Heading({ level = 2, align = 'left', className, children, ...rest }: HeadingProps) {
  const Tag = (`h${level}`) as 'h1' | 'h2' | 'h3';
  return (
    <Tag
      className={cx(`nc-h${level}`, className)}
      style={align === 'center' ? { textAlign: 'center' } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface HighlightProps {
  children: React.ReactNode;
}

/** Picks out a word or phrase inside a {@link Heading} in the pink accent. */
export function Highlight({ children }: HighlightProps) {
  return <span className="nc-hl">{children}</span>;
}
