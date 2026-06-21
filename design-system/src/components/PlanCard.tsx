import * as React from 'react';
import { cx } from '../util';
import { TickList } from './TickList';
import { Pill } from './Pill';

export interface PlanCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Photo across the top of the card. */
  image: string;
  /** Alt text for the photo. */
  imageAlt: string;
  /** Optional uppercase tag (e.g. "step one"). */
  tag?: React.ReactNode;
  /** The plan title. */
  title: React.ReactNode;
  /** The price block (pass JSX for struck-through / per-month detail). */
  price: React.ReactNode;
  /** What's included, shown as a tick list. */
  features: React.ReactNode[];
  /** The call to action (usually a {@link Button}). */
  cta?: React.ReactNode;
  /** Optional perk chips beneath the CTA. */
  perks?: React.ReactNode[];
}

/**
 * A pricing plan card in the site's lozenge language: photo, optional step tag,
 * title, price, a tick list of what's included, a call to action and perks.
 */
export function PlanCard({
  image,
  imageAlt,
  tag,
  title,
  price,
  features,
  cta,
  perks,
  className,
  ...rest
}: PlanCardProps) {
  return (
    <div className={cx('nc-plancard', className)} {...rest}>
      <div className="nc-plancard__photo">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="nc-plancard__body">
        {tag ? <Pill tone="tag" style={{ alignSelf: 'flex-start', marginBottom: 14 }}>{tag}</Pill> : null}
        <h3>{title}</h3>
        <div className="nc-price">{price}</div>
        <TickList items={features} style={{ marginBottom: 16 }} />
        {cta ? <div style={{ marginTop: 'auto' }}>{cta}</div> : null}
        {perks && perks.length ? (
          <div className="nc-perks">
            {perks.map((p, i) => (
              <Pill tone="perk" key={i}>{p}</Pill>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
