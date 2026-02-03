'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SERVICES, ServiceOffering, getPriceDisplay, formatPrice } from '@/lib/services'

function ServiceCard({ service }: { service: ServiceOffering }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/services/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          service_type: service.id,
          // For variable pricing, could pass amount here
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      if (data.url) {
        window.location.href = data.url
      } else if (data.message) {
        // Quote request success
        alert(data.message)
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const isQuote = service.ctaType === 'quote'

  return (
    <div className={`card p-6 flex flex-col ${service.popular ? 'border-2 border-neutral-900 dark:border-neutral-100' : ''}`}>
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
        {service.popular && (
          <span className="text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 rounded">
            Popular
          </span>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {getPriceDisplay(service)}
        </span>
        {service.pricing.type === 'one_time' && service.id !== 'consulting' && (
          <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">one-time</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-grow">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

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
        className={`w-full btn ${service.popular ? 'btn-primary' : 'btn-secondary'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {isQuote ? 'Submitting...' : 'Redirecting to Stripe...'}
          </>
        ) : (
          <>
            {isQuote ? (
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

function ServicesContent() {
  const searchParams = useSearchParams()
  const services = Object.values(SERVICES)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const successParam = searchParams.get('success')
    const canceledParam = searchParams.get('canceled')
    const serviceParam = searchParams.get('service')
    
    if (successParam === 'true' && serviceParam) {
      const service = SERVICES[serviceParam]
      setSuccess(`🎉 Thank you! Your ${service?.name || 'service'} purchase was successful. We'll be in touch soon.`)
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Services
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Professional services to accelerate your agent infrastructure
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

      {/* Pro Subscription Banner */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚡</span>
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                Tiker Pro
              </h2>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Unlimited bots, unlimited tasks, priority support. The foundation for everything else.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              $7<span className="text-sm font-normal text-amber-600 dark:text-amber-400">/mo</span>
            </span>
            <Link 
              href="/settings" 
              className="btn btn-primary whitespace-nowrap"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              How does setup work?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              After purchase, we'll schedule a call to understand your needs. Then our team handles 
              everything: server setup, integrations, initial configuration, and testing. You get a 
              fully working system and training on how to use it.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              What's included in consulting?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Consulting is billed hourly and can cover anything: architecture design, prompt 
              engineering, performance optimization, custom integrations, or general strategy. 
              Request a quote and we'll scope the work together.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Do I need Pro to use services?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Pro subscription is recommended but not required for one-time services like setup. 
              For ongoing services like VPS hosting, Pro unlocks the full feature set you'll want.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mt-12 card p-6 text-center">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Need something custom?
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Enterprise deployments, custom integrations, or just not sure where to start? Let's talk.
        </p>
        <a 
          href="mailto:services@tiker.com" 
          className="btn btn-secondary inline-flex"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Us
        </a>
      </section>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          </div>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  )
}
