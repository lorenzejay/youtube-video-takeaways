import { markdownToHtml } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    async function convertContent() {
      const html = await markdownToHtml(content)
      setHtmlContent(html)
    }
    convertContent()
  }, [content])

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}

export default MarkdownRenderer
