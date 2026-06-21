import * as React from 'react';
import { PlanCard, Button, media } from '@nellie/design-system';

export const Tablet = () => (
  <PlanCard
    style={{ maxWidth: 340 }}
    image={media.grandmaGrandkids}
    imageAlt="A grandmother using her nellie tablet"
    tag="step one"
    title={<>The nellie <b>tablet</b></>}
    price={<>£199 <small>one-off</small></>}
    features={['Purple-cased nellie tablet', 'Set up and ready to use', 'Free tracked UK delivery', '2-year warranty']}
    cta={<Button variant="bright">Buy the tablet</Button>}
    perks={['Free delivery', '2-year warranty']}
  />
);

export const Subscription = () => (
  <PlanCard
    style={{ maxWidth: 340 }}
    image={media.familyBig}
    imageAlt="A family staying close through nellie"
    tag="step two"
    title={<>nellie <span>connect</span></>}
    price={<><s>£29.99</s> £24.99 <small>/ month</small></>}
    features={['Photos, messages & reminders', 'For the whole family', 'Cancel any time', 'Gentle activity insights']}
    cta={<Button variant="grape">Start subscription</Button>}
    perks={['Cancel any time']}
  />
);
