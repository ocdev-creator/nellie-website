import * as React from 'react';
import { Pill, Icon } from '@nellie/design-system';

export const Tones = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
    <Pill tone="lilac">Familiarity</Pill>
    <Pill tone="pink">Simplicity</Pill>
    <Pill tone="solid">Comfort</Pill>
    <Pill tone="accent">New</Pill>
    <Pill tone="tag">step one</Pill>
    <Pill tone="perk">Free UK delivery</Pill>
  </div>
);

export const WithIcon = () => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
    <Pill tone="lilac" icon={<Icon name="heart" />}>Made with care</Pill>
    <Pill tone="perk" icon={<Icon name="check" />}>2-year warranty</Pill>
  </div>
);
