import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'

export default async function WhitepaperPage() {
  // Read the markdown file
  let content = ''
  try {
    const filePath = path.join(process.cwd(), 'public', 'WHITEPAPER.md')
    content = await fs.readFile(filePath, 'utf-8')
  } catch (e) {
    content = 'Failed to load whitepaper content.'
  }

  // Simple markdown to HTML conversion for display
  const sections = content.split(/^## /m).filter(Boolean)
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">Whitepaper</h1>
          <p className="text-neutral-500 mt-1">Version 0.2 - January 2026</p>
        </div>
        <a 
          href="/WHITEPAPER.md" 
          download
          className="btn btn-secondary text-sm"
        >
          Download .md
        </a>
      </div>

      {/* Render the whitepaper content */}
      <article className="prose prose-neutral max-w-none">
        <div 
          className="whitepaper-content"
          dangerouslySetInnerHTML={{ 
            __html: markdownToHtml(content) 
          }} 
        />
      </article>
    </div>
  )
}

function markdownToHtml(markdown: string): string {
  let html = markdown
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-neutral-900 mt-8 mb-3">$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-neutral-900 mt-12 mb-4 pb-2 border-b border-neutral-200">$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-neutral-900 mb-6">$1</h1>')
  
  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm my-4"><code>${escapeHtml(code.trim())}</code></pre>`
  })
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
  
  // Unordered lists
  html = html.replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 my-4">$&</ul>')
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
  
  // Tables (basic support)
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map((c: string) => c.trim())
    if (cells.every((c: string) => /^[-:]+$/.test(c))) {
      return '' // Skip separator rows
    }
    const cellHtml = cells.map((c: string) => `<td class="px-4 py-2 border border-neutral-200">${c}</td>`).join('')
    return `<tr>${cellHtml}</tr>`
  })
  
  // Blockquotes
  html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4">$1</blockquote>')
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-neutral-200" />')
  
  // Paragraphs - wrap remaining text blocks
  html = html.replace(/^(?!<[a-z])((?!<\/)[^\n]+)$/gm, '<p class="text-neutral-700 leading-relaxed my-4">$1</p>')
  
  // Clean up empty paragraphs and double spacing
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '')
  html = html.replace(/\n{3,}/g, '\n\n')
  
  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
