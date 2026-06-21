import * as React from 'react';

/** The Nellie icon set: friendly rounded line icons, drawn in currentColor
 *  so they take the colour of whatever holds them (an {@link IconCircle},
 *  a button, a tick). Size is controlled by the parent's CSS. */
export type IconName =
  | 'check'
  | 'arrow'
  | 'message'
  | 'photo'
  | 'music'
  | 'calendar'
  | 'heart'
  | 'play'
  | 'bell'
  | 'phone'
  | 'link'
  | 'star'
  | 'video'
  | 'family'
  | 'gift';

const PATHS: Record<IconName, React.ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  arrow: <><path d="M5 12h13" /><path d="M12 6l6 6-6 6" /></>,
  message: <path d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H10l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
  photo: <><rect x="4" y="6" width="16" height="12" rx="2" /><circle cx="9" cy="10.5" r="1.6" /><path d="M5 17l4-4 3 3 3.5-4.5L20 17" /></>,
  music: <><path d="M9 17V6l10-2v9" /><circle cx="7" cy="17" r="2.1" /><circle cx="17" cy="15" r="2.1" /></>,
  calendar: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M8 4v4M16 4v4" /></>,
  heart: <path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.6 12 20 12 20z" />,
  play: <path d="M8 5l11 7-11 7z" />,
  bell: <><path d="M6.5 16l1-2.2V11a4.5 4.5 0 0 1 9 0v2.8l1 2.2z" /><path d="M10.3 19a1.8 1.8 0 0 0 3.4 0" /></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2.4" /><path d="M10.5 18.3h3" /></>,
  link: <><path d="M9 15l6-6" /><path d="M8 13l-1.8 1.8a3 3 0 0 0 4.2 4.2L12.2 17" /><path d="M16 11l1.8-1.8a3 3 0 0 0-4.2-4.2L11.8 7" /></>,
  star: <path d="M12 4l2.3 4.8 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.6 5.2-.7z" />,
  video: <><rect x="4" y="7" width="11" height="10" rx="2" /><path d="M15 10l5-3v10l-5-3z" /></>,
  family: <><circle cx="8" cy="8" r="3" /><path d="M3 19a5 5 0 0 1 10 0" /><circle cx="17" cy="9.5" r="2.4" /><path d="M14.5 19a4 4 0 0 1 6.5-3.1" /></>,
  gift: <><rect x="4.5" y="11" width="15" height="9" rx="1.5" /><path d="M3.5 7.5h17V11h-17z" /><path d="M12 7.5V20" /><path d="M12 7.5C10.5 4 6.5 4.5 7.5 7c.6 1.4 4.5.5 4.5.5z" /><path d="M12 7.5C13.5 4 17.5 4.5 16.5 7c-.6 1.4-4.5.5-4.5.5z" /></>,
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Which icon to draw. */
  name: IconName;
}

/**
 * A single Nellie line icon. Inherits colour and size from its container, so
 * it sits naturally inside an {@link IconCircle}, a {@link Button}, or a tick.
 */
export function Icon({ name, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === 'check' ? 3 : 2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
