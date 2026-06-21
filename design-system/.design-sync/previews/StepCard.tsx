import * as React from 'react';
import { StepCard, media } from '@nellie/design-system';

export const Default = () => (
  <StepCard number={1} image={media.grandmaGrandkids} imageAlt="A grandmother with her grandchildren" title="Order the tablet" style={{ maxWidth: 300 }}>
    It arrives set up and ready to use, in its protective case.
  </StepCard>
);

export const Row = () => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    <StepCard number={1} image={media.grandmaGrandkids} imageAlt="A family together" title="Order the tablet" style={{ flex: '1 1 220px', maxWidth: 280 }}>
      It arrives set up and ready to use.
    </StepCard>
    <StepCard number={2} image={media.familyBig} imageAlt="A family staying close" title="Add your family" style={{ flex: '1 1 220px', maxWidth: 280 }}>
      Invite the people who matter to nellie connect.
    </StepCard>
    <StepCard number={3} image={media.insights} imageAlt="Sharing everyday moments" title="Stay close" style={{ flex: '1 1 220px', maxWidth: 280 }}>
      Send photos, messages and gentle reminders.
    </StepCard>
  </div>
);
