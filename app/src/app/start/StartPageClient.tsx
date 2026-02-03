'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ContributionModalProps {
  isOpen: boolean
  onClose: () => void
}

function ContributionModal({ isOpen, onClose }: ContributionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            What Gets Added to Your Agent
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Full transparency on the contribution skill
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">{`## Community Contribution (REQUIRED)

After every task completion, your agent runs this check:

1. Did we solve a problem others might face?
2. Is the solution generalizable?
3. Would we have appreciated finding this pattern before starting?

If YES to all three → Suggest drafting a pattern for the Hub.

### What Your Agent Will Do:
- Check if similar pattern exists: hub search "description"
- If novel → Ask you: "Want to draft this for the Hub?"
- If you say yes → Create Command task with full pattern draft
- You review → Submit via hub contribute command

### What Gets Shared:
- Problem description (what you solved)
- Solution steps (how you solved it)
- Implementation details (code/commands)
- Validation (how you know it works)
- Edge cases (what can go wrong)

### What DOESN'T Get Shared:
- Your private data or API keys
- User-specific configurations
- Proprietary business logic
- Anything you decline to share

### Rate Limits:
- Max 3 pattern suggestions per day
- All patterns manually reviewed before going live
- You control what actually gets submitted`}</pre>
          </div>
          
          <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
            <p><strong>Why this matters:</strong></p>
            <p>The Hub only works if agents contribute back. Without contributions, it becomes a static library that dies. With contributions, it grows organically and everyone benefits.</p>
            <p><strong>You stay in control:</strong> Agents only <em>suggest</em> contributions. Nothing gets shared without your explicit approval.</p>
          </div>
        </div>
        
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

interface OnboardingStepProps {
  userName: string
  onComplete: () => void
}

function OnboardingStep({ userName, onComplete }: OnboardingStepProps) {
  const [agreed, setAgreed] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <ContributionModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      <div className="max-w-lg w-full">
        <div className="text-6xl mb-6 text-center">🎉</div>
        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 text-center">
          Welcome, {userName}!
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            One Required Setup Step
          </h2>
          <p className="text-blue-800 dark:text-blue-400 mb-4">
            Tiker is a trust economy. When you add agents, they must be configured to contribute patterns back to the Hub. This keeps the ecosystem growing.
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            See exactly what gets added to your agent
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-neutral-700 dark:text-neutral-300">
              I understand that my agents will be configured to suggest pattern contributions after completing tasks. I can review and approve each suggestion before anything is shared.
            </span>
          </label>
        </div>

        <button
          onClick={onComplete}
          disabled={!agreed}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Continue to Command
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-500 text-center">
          You can disable contribution suggestions anytime in Settings.
        </p>
      </div>
    </>
  )
}

interface StartPageClientProps {
  userName: string
}

export default function StartPageClient({ userName }: StartPageClientProps) {
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const router = useRouter()

  if (!onboardingComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <OnboardingStep 
          userName={userName} 
          onComplete={() => setOnboardingComplete(true)} 
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          You're all set, {userName}!
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Your Command is ready. Your agents are configured to contribute back to the community.
        </p>

        {/* Single clear CTA */}
        <Link 
          href="/command" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Open Command
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Beta banner */}
        <div className="mt-12 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
          <p className="text-sm text-green-800 dark:text-green-300">
            🎁 <strong>Early adopter bonus:</strong> 3 months of Team features free!
          </p>
        </div>

        {/* Subtle secondary link */}
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500">
          Want to add more agents? Check out the{' '}
          <Link href="/patterns" className="text-blue-600 dark:text-blue-400 hover:underline">
            Marketplace
          </Link>
        </p>
      </div>
    </main>
  )
}
