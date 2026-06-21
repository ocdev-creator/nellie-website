import * as React from 'react';
import { Kicker } from '@nellie/design-system';

export const Default = () => <Kicker>how it works</Kicker>;

export const Examples = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
    <Kicker>the solution</Kicker>
    <Kicker>what's really happening</Kicker>
    <Kicker>simple pricing</Kicker>
  </div>
);
