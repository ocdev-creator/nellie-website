import * as React from 'react';
import { Icon, IconName, IconCircle } from '@nellie/design-system';

const names: IconName[] = ['check', 'arrow', 'message', 'photo', 'music', 'calendar', 'heart', 'play', 'bell', 'phone', 'link', 'star', 'video', 'family', 'gift'];

export const AllIcons = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
    {names.map((n) => (
      <div
        key={n}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
          padding: '14px 6px', background: '#faf2ff', borderRadius: 14, border: '1px solid #ecd3f7',
        }}
      >
        <span style={{ fontSize: 30, color: '#7e37ca', lineHeight: 1 }}><Icon name={n} /></span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#5c1a8c', fontFamily: "'Nunito Sans', sans-serif" }}>{n}</span>
      </div>
    ))}
  </div>
);

export const InCircles = () => (
  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
    <IconCircle tone="plum"><Icon name="message" /></IconCircle>
    <IconCircle tone="accent"><Icon name="photo" /></IconCircle>
    <IconCircle tone="violet"><Icon name="music" /></IconCircle>
    <IconCircle tone="lilac"><Icon name="calendar" /></IconCircle>
  </div>
);
