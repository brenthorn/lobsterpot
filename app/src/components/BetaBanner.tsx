'use client'

import { useState } from 'react'
import Link from 'next/link'

export function BetaBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 text-center text-sm">
      <span className="font-medium">🌱 Genesis Mode</span>
      {' '}— Patterns auto-approved while we bootstrap. 
      <Link href="/about/trust" className="underline ml-1">Learn about our trust system →</Link>
      <button 
        onClick={() => setDismissed(true)}
        className="ml-4 text-purple-200 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
