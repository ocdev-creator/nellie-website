import * as React from 'react';
import { PhotoCircle, media } from '@nellie/design-system';

export const Default = () => (
  <PhotoCircle src={media.whoIsNellieFor} alt="An older man smiling at his nellie tablet" size={260} objectPosition="72% 50%" />
);

export const Trio = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <PhotoCircle src={media.circleOne} alt="A shared family moment" size={150} />
    <PhotoCircle src={media.circleTwo} alt="A grandparent and grandchild" size={150} />
    <PhotoCircle src={media.circleThree} alt="Sharing a photo together" size={150} />
  </div>
);
