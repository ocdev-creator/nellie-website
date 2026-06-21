import * as React from 'react';
import { IconCircle, Icon } from '@nellie/design-system';

export const Tones = () => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
    <IconCircle tone="gradient"><Icon name="message" /></IconCircle>
    <IconCircle tone="accent"><Icon name="photo" /></IconCircle>
    <IconCircle tone="violet"><Icon name="music" /></IconCircle>
    <IconCircle tone="plum"><Icon name="bell" /></IconCircle>
    <IconCircle tone="lilac"><Icon name="calendar" /></IconCircle>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
    <IconCircle size="sm"><Icon name="heart" /></IconCircle>
    <IconCircle size="md"><Icon name="heart" /></IconCircle>
    <IconCircle size="lg"><Icon name="heart" /></IconCircle>
  </div>
);
