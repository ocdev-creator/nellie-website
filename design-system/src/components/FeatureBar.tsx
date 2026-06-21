import * as React from 'react';
import { cx } from '../util';
import { IconCircle, IconCircleTone } from './IconCircle';

export interface FeatureBarItem {
  /** The glyph (usually an {@link Icon}). */
  icon: React.ReactNode;
  /** The short label, held to a couple of lines. */
  label: React.ReactNode;
  /** Badge colour for this item. */
  tone?: IconCircleTone;
}

export interface FeatureBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The little pill perched on the bar's top-left edge (e.g. "with nellie..."). */
  pill?: React.ReactNode;
  /** The feature items, each an icon badge plus a label. */
  items: FeatureBarItem[];
}

/**
 * The signature Nellie lozenge: a fully-rounded white bar holding a row of
 * icon-badge features, with a soft pill perched on its top-left. Sits straddling
 * the foot of the hero on the site.
 */
export function FeatureBar({ pill, items, className, style, ...rest }: FeatureBarProps) {
  return (
    <div
      className={cx('nc-featurebar', className)}
      style={{ ['--nc-fb-cols' as string]: String(items.length), ...style }}
      {...rest}
    >
      {pill ? <span className="nc-featurebar__pill">{pill}</span> : null}
      {items.map((item, i) => (
        <div className="nc-fb-item" key={i}>
          <IconCircle tone={item.tone ?? 'gradient'} size="md">
            {item.icon}
          </IconCircle>
          <span className="nc-fb-item__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
