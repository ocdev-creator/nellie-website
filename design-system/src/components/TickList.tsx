import * as React from 'react';
import { cx } from '../util';
import { Icon } from './Icon';

export interface TickListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** The list items. Each gets a pink tick badge. */
  items: React.ReactNode[];
}

/**
 * A list with the brand tick badge (a pink circle with a white check) against
 * each line. Used for "what you get" and benefit lists.
 */
export function TickList({ items, className, ...rest }: TickListProps) {
  return (
    <ul className={cx('nc-ticks', className)} {...rest}>
      {items.map((item, i) => (
        <li key={i}>
          <span className="nc-tick">
            <Icon name="check" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
