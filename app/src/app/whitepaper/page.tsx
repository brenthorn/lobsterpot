import fs from 'fs';
import path from 'path';

function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML entities
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists - unordered
  const lines = html.split('\n');
  let inList = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for list items
    if (line.match(/^[\-\*] /)) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push('<li>' + line.replace(/^[\-\*] /, '') + '</li>');
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  if (inList) {
    processedLines.push('</ul>');
  }

  html = processedLines.join('\n');

  // Paragraphs - double line break
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<h/g, '<h');
  html = html.replace(/<\/h([1-6])>\s*<\/p>/g, '</h$1>');
  html = html.replace(/<p>\s*<ul>/g, '<ul>');
  html = html.replace(/<\/ul>\s*<\/p>/g, '</ul>');
  html = html.replace(/<p>\s*<pre>/g, '<pre>');
  html = html.replace(/<\/pre>\s*<\/p>/g, '</pre>');

  // Single line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

function getWhitepaper(): string {
  const whitepaperPath = path.join(process.cwd(), '..', 'WHITEPAPER.md');
  const fileContents = fs.readFileSync(whitepaperPath, 'utf8');
  return markdownToHtml(fileContents);
}

export default function WhitepaperPage() {
  const content = getWhitepaper();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/95 backdrop-blur rounded-lg shadow-2xl p-8 md:p-12">
          <div 
            className="whitepaper-content"
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#1e293b'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
      <style jsx global>{`
        .whitepaper-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }
        .whitepaper-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
          color: #1e293b;
        }
        .whitepaper-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #334155;
        }
        .whitepaper-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #475569;
        }
        .whitepaper-content p {
          margin-bottom: 1.25rem;
        }
        .whitepaper-content ul {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        .whitepaper-content li {
          margin-bottom: 0.75rem;
          list-style-type: disc;
        }
        .whitepaper-content strong {
          font-weight: 600;
          color: #0f172a;
        }
        .whitepaper-content em {
          font-style: italic;
        }
        .whitepaper-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .whitepaper-content a:hover {
          color: #1d4ed8;
        }
        .whitepaper-content code {
          background-color: #f1f5f9;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: #475569;
        }
        .whitepaper-content pre {
          background-color: #0f172a;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .whitepaper-content pre code {
          background-color: transparent;
          color: #e2e8f0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
