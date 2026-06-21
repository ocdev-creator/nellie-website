import * as React from 'react';
import { LogoLockup } from '@nellie/design-system';

export const Default = () => <LogoLockup suffix="connect" size={40} />;

export const Wordmarks = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
    <LogoLockup size={40} />
    <LogoLockup suffix="connect" size={40} />
  </div>
);

export const OnDark = () => (
  <div style={{ background: 'linear-gradient(105deg,#3d076b,#8735cb)', padding: '28px 32px', borderRadius: 16 }}>
    <LogoLockup suffix="connect" inverse size={40} />
  </div>
);
