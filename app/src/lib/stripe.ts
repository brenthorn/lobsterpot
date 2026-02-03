import Stripe from 'stripe'

// Lazy-initialize Stripe client to avoid build-time errors
let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return stripeClient
}

// DEPRECATED: Use getStripe() instead - this export may be null at runtime
// Keeping for backwards compatibility but will be removed in future version
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  : null

// Pricing tiers
export const TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    maxBots: 1,
    maxTasks: 50,
    canInviteGuests: false,
  },
  pro: {
    name: 'Pro',
    price: 7,
    priceId: process.env.STRIPE_PRO_PRICE_ID, // Set in env
    maxBots: -1, // unlimited
    maxTasks: -1, // unlimited
    canInviteGuests: true,
    maxGuests: 5,
  },
} as const

export type TierName = keyof typeof TIERS

// Helper to get tier limits
export function getTierLimits(tier: TierName) {
  return TIERS[tier] || TIERS.free
}
