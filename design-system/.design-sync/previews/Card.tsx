import * as React from 'react';
import { Card, Heading, IconCircle, Icon } from '@nellie/design-system';

export const Default = () => (
  <Card style={{ maxWidth: 340 }}>
    <IconCircle tone="gradient"><Icon name="photo" /></IconCircle>
    <Heading level={3} style={{ marginTop: 14 }}>Photo slideshows</Heading>
    <p style={{ marginTop: 8, color: '#3e0a6e', fontWeight: 600, fontFamily: "'Nunito Sans', sans-serif" }}>
      Family photos arrive gently through the day, full screen and easy to see.
    </p>
  </Card>
);

export const Soft = () => (
  <Card tone="soft" style={{ maxWidth: 340 }}>
    <Heading level={3}>A calm, familiar home screen</Heading>
    <p style={{ marginTop: 8, color: '#3e0a6e', fontWeight: 600, fontFamily: "'Nunito Sans', sans-serif" }}>
      No apps to learn and no settings to fiddle with, just the people you love.
    </p>
  </Card>
);
