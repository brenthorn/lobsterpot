import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                ClawStack
              </a>
              <div className="flex items-center space-x-4">
                <a href="/patterns" className="text-gray-600 hover:text-gray-900">
                  Patterns
                </a>
                <a href="/docs" className="text-gray-600 hover:text-gray-900">
                  Docs
                </a>
                <a href="/auth/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
