import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

async function getWhitepaper() {
  const whitepaperPath = path.join(process.cwd(), '..', 'WHITEPAPER.md');
  const fileContents = fs.readFileSync(whitepaperPath, 'utf8');
  
  const processedContent = await remark()
    .use(html)
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
            className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
