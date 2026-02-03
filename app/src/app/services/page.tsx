'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  HARDWARE_PRODUCTS,
  SETUP_SERVICES,
  CONSULTING_SERVICES,
  ServiceOffering,
  SERVICES,
  getPriceDisplay,
  formatPrice,
  getStripePriceId,
} from '@/lib/services'

// =============================================================================
// SHIPPING BADGE
// =============================================================================

function ShippingBadge({ days }: { days: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
      Ships in {days}
    </span>
  )
}

// =============================================================================
// POPULAR BADGE
// =============================================================================

function PopularBadge() {
  return (
    <span className="inline-flex items-center text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
      ⚡ Most Popular
    </span>
  )
}

// =============================================================================
// SERVICE CARD
// =============================================================================

interface ServiceCardProps {
  service: ServiceOffering
  featured?: boolean
}

function ServiceCard({ service, featured }: ServiceCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    service.variants?.find(v => v.default)?.id
  )

  const handlePurchase = async () => {
    if (service.ctaType === 'contact') {
      // Scroll to contact form
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const priceId = getStripePriceId(service, selectedVariant)
      
      const response = await fetch('/api/services/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: service.id,
          price_id: priceId,
          variant: selectedVariant,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const currentPrice = selectedVariant && service.variants
    ? service.variants.find(v => v.id === selectedVariant)?.amount || service.pricing.amount
    : service.pricing.amount

  return (
    <div
      className={`card p-6 flex flex-col transition-all duration-200 hover:shadow-lg ${
        featured ? 'border-2 border-amber-400 dark:border-amber-500 shadow-amber-100 dark:shadow-amber-900/20' : ''
      } ${service.popular ? 'ring-2 ring-amber-400/50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{service.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {service.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {service.shortDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {service.popular && <PopularBadge />}
        {service.shipsIn && <ShippingBadge days={service.shipsIn} />}
      </div>

      {/* Pricing */}
      <div className="mb-4">
        {service.pricing.type === 'contact' ? (
          <span className="text-xl font-semibold text-neutral-600 dark:text-neutral-400">
            Custom pricing
          </span>
        ) : (
          <>
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatPrice(currentPrice)}
            </span>
            {service.pricing.type === 'one_time_with_recurring' && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
                + {formatPrice(service.pricing.recurringAmount || 0)}/mo hosting
              </span>
            )}
            {service.pricing.type === 'one_time' && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
                one-time
              </span>
            )}
          </>
        )}
      </div>

      {/* Variant Selector */}
      {service.variants && service.variants.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Choose size:
          </label>
          <div className="flex gap-2">
            {service.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  selectedVariant === variant.id
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
                }`}
              >
                {variant.label} - {formatPrice(variant.amount)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6 flex-grow">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Related Link */}
      {service.relatedLink && (
        <a
          href={service.relatedLink.anchor}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-flex items-center gap-1"
        >
          {service.relatedLink.text}
        </a>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full btn ${featured || service.popular ? 'btn-primary' : 'btn-secondary'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Redirecting to Stripe...
          </>
        ) : (
          <>
            {service.ctaType === 'contact' ? (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            )}
            {service.ctaText}
          </>
        )}
      </button>
    </div>
  )
}

// =============================================================================
// CONTACT FORM
// =============================================================================

function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/services/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service_type: 'custom-work',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit inquiry')
      }

      setSuccess(true)
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Message Sent!
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn btn-secondary"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Company
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Tell us about your project *
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="What are you trying to build? Any specific integrations or requirements?"
          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn btn-primary"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

// =============================================================================
// SECTION HEADER
// =============================================================================

function SectionHeader({
  title,
  subtitle,
  id,
}: {
  title: string
  subtitle: string
  id?: string
}) {
  return (
    <div id={id} className="mb-6 scroll-mt-8">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
      <p className="text-neutral-500 dark:text-neutral-400 mt-1">
        {subtitle}
      </p>
    </div>
  )
}

// =============================================================================
// MAIN CONTENT
// =============================================================================

function ServicesContent() {
  const searchParams = useSearchParams()
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const successParam = searchParams.get('success')
    const canceledParam = searchParams.get('canceled')
    const serviceParam = searchParams.get('service')

    if (successParam === 'true' && serviceParam) {
      const service = SERVICES[serviceParam]
      setSuccess(
        `🎉 Thank you! Your ${service?.name || 'service'} purchase was successful. We'll be in touch within 24 hours.`
      )
      window.history.replaceState({}, '', '/services')
    } else if (canceledParam === 'true') {
      setError('Checkout was canceled. No charges were made.')
      window.history.replaceState({}, '', '/services')
    }
  }, [searchParams])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Success/Error Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 dark:text-green-300 flex-1">{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-400 hover:text-green-600 dark:hover:text-green-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 dark:text-red-300 flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Services & Hardware
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Everything you need to run your own AI agent infrastructure
          </p>
        </div>
        <Link
          href="/settings"
          className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Settings
        </Link>
      </div>

      {/* Featured: Remote Setup */}
      <section className="mb-12">
        <div className="card p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔧</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                      Remote Setup
                    </h2>
                    <PopularBadge />
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    The fastest way to get started
                  </p>
                </div>
              </div>
              <p className="text-amber-800 dark:text-amber-200 mb-4">
                1-hour remote session. We configure Tiker on your existing VPS or home computer.
                You provide Tailscale or remote access, we do the rest. Done in a day.
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Your hardware
                </li>
                <li className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full Tiker stack
                </li>
                <li className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tunnel setup included
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-3">
              <span className="text-4xl font-bold text-amber-900 dark:text-amber-100">
                $99
              </span>
              <button
                onClick={async () => {
                  const response = await fetch('/api/services/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      service_type: 'remote-setup',
                      price_id: 'price_1SwYhjGTBC9prCAPiMJDXtTF',
                    }),
                  })
                  const data = await response.json()
                  if (data.url) window.location.href = data.url
                }}
                className="btn btn-primary whitespace-nowrap text-lg px-8 py-3"
              >
                Book Setup Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="mb-12">
        <SectionHeader
          title="Hardware Packages"
          subtitle="Pre-configured hardware shipped to your door. Plug in and go."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HARDWARE_PRODUCTS.map((product) => (
            <ServiceCard key={product.id} service={product} />
          ))}
        </div>
      </section>

      {/* SD Card Anchor for internal link */}
      <div id="sd-card" className="scroll-mt-20" />

      {/* Setup Services Section */}
      <section className="mb-12">
        <SectionHeader
          title="Setup Services"
          subtitle="We configure everything. You focus on building."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {SETUP_SERVICES.filter(s => s.id !== 'remote-setup').map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Custom Work / Consulting Section */}
      <section className="mb-12" id="contact-form">
        <SectionHeader
          title="Custom Work"
          subtitle="Enterprise deployments, complex integrations, or something unique."
        />
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ServiceCard service={CONSULTING_SERVICES[0]} />
          </div>
          <ContactForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              What's the difference between Remote Setup and VPS Provisioning?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Remote Setup ($99):</strong> We configure Tiker on hardware you already own or rent — your VPS, old laptop, Raspberry Pi, etc. You handle the hosting.
              <br /><br />
              <strong>VPS Provisioning ($149 + $10/mo):</strong> We spin up a cloud server for you and manage it. Hands-off hosting with monitoring and backups included.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              I already have a Raspberry Pi. What do I need?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Just grab the <a href="#sd-card" className="text-blue-600 dark:text-blue-400 hover:underline">Pre-configured SD Card</a> ($49).
              Swap it into your Pi 4 or 5, boot up, and you're running Tiker. Takes about 5 minutes.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              How long does shipping take?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              All hardware ships within 7 days. We configure and test everything before it leaves.
              USPS Priority Mail for US, DHL Express for international.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Do I need a Tiker Pro subscription?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Pro is recommended for the full feature set (unlimited bots, priority support), but not required.
              These services work with free accounts too.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

// =============================================================================
// PAGE EXPORT
// =============================================================================

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
            <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  )
}
