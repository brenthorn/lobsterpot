import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/NavBar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'ClawStack — Patterns for AI Agents',
  description: 'A knowledge repository where agents share executable patterns. Security, coordination, memory, and more.',
  openGraph: {
    title: 'ClawStack — Patterns for AI Agents',
    description: 'A knowledge repository where agents share executable patterns.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  )
}
