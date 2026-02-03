// Service definitions for Tiker additional offerings

export interface ServiceOffering {
  id: string
  name: string
  description: string
  shortDesc: string
  features: string[]
  pricing: {
    type: 'one_time' | 'recurring'
    amount: number // in cents
    interval?: 'month' | 'year'
    range?: { min: number; max: number } // for variable pricing
  }
  ctaText: string
  ctaType: 'purchase' | 'quote'
  icon: string
  popular?: boolean
  stripePriceId?: string // Set via env vars
}

export const SERVICES: Record<string, ServiceOffering> = {
  setup: {
    id: 'setup',
    name: 'Setup Service',
    description: 'Get your agent infrastructure running in hours, not weeks. Our team handles the complete setup - environment configuration, integrations, initial prompts, and training.',
    shortDesc: 'White-glove agent setup & onboarding',
    features: [
      'Full environment setup',
      'Integration configuration (Discord, email, etc.)',
      'Initial prompt engineering',
      '2-hour onboarding call',
      '30 days of support',
    ],
    pricing: {
      type: 'one_time',
      amount: 19900, // $199
      range: { min: 19900, max: 99900 },
    },
    ctaText: 'Get Started',
    ctaType: 'purchase',
    icon: '🚀',
    popular: true,
    stripePriceId: process.env.STRIPE_SETUP_PRICE_ID,
  },
  consulting: {
    id: 'consulting',
    name: 'Consulting',
    description: 'Expert guidance on agent architecture, automation strategy, and optimization. Perfect for complex deployments or scaling existing systems.',
    shortDesc: 'Hourly expert consultation',
    features: [
      'Architecture review',
      'Performance optimization',
      'Custom integrations',
      'Prompt engineering',
      'Security audit',
    ],
    pricing: {
      type: 'one_time',
      amount: 15000, // $150/hr
      range: { min: 15000, max: 50000 },
    },
    ctaText: 'Request Quote',
    ctaType: 'quote',
    icon: '💡',
    stripePriceId: process.env.STRIPE_CONSULTING_PRICE_ID,
  },
  vps: {
    id: 'vps',
    name: 'VPS Hosting',
    description: 'Managed virtual private servers optimized for agent workloads. Always-on infrastructure with monitoring and automatic updates.',
    shortDesc: 'Managed agent hosting',
    features: [
      '99.9% uptime SLA',
      'Automatic backups',
      'Monitoring & alerts',
      'SSH access',
      'Priority support',
    ],
    pricing: {
      type: 'recurring',
      amount: 1000, // $10/mo
      interval: 'month',
      range: { min: 1000, max: 5000 },
    },
    ctaText: 'Subscribe',
    ctaType: 'purchase',
    icon: '☁️',
    stripePriceId: process.env.STRIPE_VPS_PRICE_ID,
  },
  hardware: {
    id: 'hardware',
    name: 'Hardware',
    description: 'Pre-configured hardware for on-premise agent deployments. Raspberry Pi clusters, mini PCs, and enterprise solutions.',
    shortDesc: 'Pre-configured agent hardware',
    features: [
      'Pre-installed Tiker stack',
      'Network configuration',
      'Remote management enabled',
      'Hardware warranty',
      'Setup documentation',
    ],
    pricing: {
      type: 'one_time',
      amount: 10000, // $100 base
      range: { min: 10000, max: 200000 },
    },
    ctaText: 'Request Quote',
    ctaType: 'quote',
    icon: '🖥️',
  },
}

export type ServiceType = keyof typeof SERVICES

export function getService(id: string): ServiceOffering | undefined {
  return SERVICES[id]
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function getPriceDisplay(service: ServiceOffering): string {
  const { pricing } = service
  
  if (pricing.range && pricing.range.min !== pricing.range.max) {
    return `${formatPrice(pricing.range.min)} - ${formatPrice(pricing.range.max)}`
  }
  
  const base = formatPrice(pricing.amount)
  
  if (pricing.type === 'recurring' && pricing.interval) {
    return `${base}/${pricing.interval === 'month' ? 'mo' : 'yr'}`
  }
  
  if (service.id === 'consulting') {
    return `${base}/hr`
  }
  
  return base
}
