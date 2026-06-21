import * as React from 'react';
import { Button, Icon } from '@nellie/design-system';

const panel: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', background: '#f3ddfb', padding: 24, borderRadius: 20 };

export const Primary = () => <Button variant="primary">Get started</Button>;

export const Variants = () => (
  <div style={panel}>
    <Button variant="primary">Get started</Button>
    <Button variant="deep">How it works</Button>
    <Button variant="bright">Buy the tablet</Button>
    <Button variant="grape">Start subscription</Button>
    <Button variant="ghost">Watch the demo</Button>
  </div>
);

export const WithIcon = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button variant="primary" icon={<Icon name="arrow" />} iconAfter>Get started</Button>
    <Button variant="ghost" icon={<Icon name="play" />}>Watch the demo</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button variant="primary" size="sm">Small</Button>
    <Button variant="primary" size="md">Medium</Button>
    <Button variant="primary" size="lg">Large</Button>
  </div>
);
