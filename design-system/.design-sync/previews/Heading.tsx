import * as React from 'react';
import { Heading, Highlight, Kicker } from '@nellie/design-system';

export const Levels = () => (
  <div style={{ display: 'grid', gap: 16 }}>
    <Heading level={1}>A gentle way to <Highlight>stay close</Highlight></Heading>
    <Heading level={2}>The connections that shaped a life <Highlight>begin to fade</Highlight></Heading>
    <Heading level={3}>Photos, messages and reminders, all in one place</Heading>
  </div>
);

export const WithKicker = () => (
  <div>
    <Kicker>the solution</Kicker>
    <Heading level={2} style={{ marginTop: 12 }}>nellie removes the <Highlight>complexity</Highlight></Heading>
  </div>
);

export const Centered = () => (
  <Heading level={2} align="center">Bring your <Highlight>family</Highlight> closer</Heading>
);
