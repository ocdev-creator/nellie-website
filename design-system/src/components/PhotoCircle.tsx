import * as React from 'react';
import { cx } from '../util';
import { media } from '../media';

export interface PhotoCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image URL. Defaults to a Nellie master photo. */
  src?: string;
  /** Alt text for the photo. */
  alt: string;
  /** Diameter in pixels. */
  size?: number;
  /** Show the offset accent ring (default true). */
  ring?: boolean;
  /** CSS object-position for the crop, e.g. "72% 50%". */
  objectPosition?: string;
}

/**
 * A circular portrait with a fine offset accent ring, the treatment used for
 * the "who is nellie for" portrait and the family connection bubbles. Defaults
 * to a real Nellie photograph.
 */
export function PhotoCircle({
  src = media.circleOne,
  alt,
  size = 300,
  ring = true,
  objectPosition,
  className,
  style,
  ...rest
}: PhotoCircleProps) {
  return (
    <div
      className={cx('nc-photocircle', !ring && 'nc-photocircle--plain', className)}
      style={{ ['--nc-pc-size' as string]: `${size}px`, ...style }}
      {...rest}
    >
      <img className="nc-photocircle__img" src={src} alt={alt} style={objectPosition ? { objectPosition } : undefined} />
    </div>
  );
}
