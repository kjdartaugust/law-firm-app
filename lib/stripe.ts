import Stripe from 'stripe';

/** Stripe is optional — the app falls back to a simulated payment when unset. */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;
