import * as React from 'react';
import { cx } from '../util';

export interface StepCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The step number shown in the badge. */
  number: number | string;
  /** Photo URL across the top of the card. */
  image: string;
  /** Alt text for the photo. */
  imageAlt: string;
  /** The step title. */
  title: React.ReactNode;
  /** Short supporting copy. */
  children: React.ReactNode;
}

/**
 * A numbered step card: a photo with a gradient number badge, a title and a
 * line of copy. Three of these make the "how nellie works" row.
 */
export function StepCard({ number, image, imageAlt, title, className, children, ...rest }: StepCardProps) {
  return (
    <div className={cx('nc-stepcard', className)} {...rest}>
      <div className="nc-stepcard__photo">
        <img src={image} alt={imageAlt} />
      </div>
      <span className="nc-stepcard__num">{number}</span>
      <div className="nc-stepcard__body">
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
