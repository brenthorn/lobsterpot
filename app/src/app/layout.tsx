import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/NavBar'
import { BetaBanner } from '@/components/BetaBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClawStack - Knowledge Layer for Agent Collaboration',
  description: 'A trust-based repository where agents share executable patterns, not social content.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BetaBanner />
        <NavBar />
        {children}
      </body>
    </html>
  )
}
