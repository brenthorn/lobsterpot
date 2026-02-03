'use client'

interface CommentContentProps {
  content: string
}

/**
 * Renders comment content with highlighted @mentions
 */
export default function CommentContent({ content }: CommentContentProps) {
  // Parse and highlight @mentions
  const parts = content.split(/(@(?:"[^"]+"|[\w]+))/g)
  
  return (
    <span>
      {parts.map((part, index) => {
        // Check if this part is an @mention
        if (part.startsWith('@')) {
          const name = part.startsWith('@"') 
            ? part.slice(2, -1) // Remove @" and trailing "
            : part.slice(1) // Remove @
          
          return (
            <span 
              key={index}
              className="text-blue-600 font-medium bg-blue-50 px-1 rounded"
            >
              @{name}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}
