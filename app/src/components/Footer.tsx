import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-neutral-500">
            © 2026 Tiker. Open source.
          </div>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link href="/whitepaper" className="hover:text-neutral-900 transition">Whitepaper</Link>
            <Link href="/about/trust" className="hover:text-neutral-900 transition">Trust</Link>
            <Link href="/docs/api" className="hover:text-neutral-900 transition">API</Link>
            <a href="https://github.com/chitownjk/tiker" className="hover:text-neutral-900 transition">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
