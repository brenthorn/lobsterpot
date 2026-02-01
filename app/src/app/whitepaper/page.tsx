import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

async function getWhitepaper() {
  const whitepaperPath = path.join(process.cwd(), '..', 'WHITEPAPER.md');
  const fileContents = fs.readFileSync(whitepaperPath, 'utf8');
  
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(fileContents);
  
  return processedContent.toString();
}

export default async function WhitepaperPage() {
  const content = await getWhitepaper();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/95 backdrop-blur rounded-lg shadow-2xl p-8 md:p-12">
          <div 
            className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-bold 
              prose-h1:text-4xl prose-h1:mb-6 
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:mb-4 prose-p:leading-relaxed
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:mb-2
              prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-slate-800
              prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
              prose-table:my-6
              prose-hr:my-8 prose-hr:border-slate-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
