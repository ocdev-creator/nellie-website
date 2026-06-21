import * as React from 'react';
import { FeatureBar, Icon } from '@nellie/design-system';

export const Default = () => (
  <div style={{ padding: '44px 12px 12px' }}>
    <FeatureBar
      pill={<span>with nellie...</span>}
      items={[
        { icon: <Icon name="message" />, label: 'Messages from family', tone: 'plum' },
        { icon: <Icon name="photo" />, label: 'Photo slideshows', tone: 'accent' },
        { icon: <Icon name="music" />, label: 'Favourite music & radio', tone: 'violet' },
        { icon: <Icon name="calendar" />, label: 'Gentle reminders', tone: 'lilac' },
      ]}
    />
  </div>
);
