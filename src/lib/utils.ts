import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { remark } from 'remark'
import html from 'remark-html'

import sanitizeHtml from 'sanitize-html'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processedContent = await remark().use(html).process(markdown)
  const rawHtml = processedContent.toString()

  // Sanitize the raw HTML content
  const sanitizedHtml = sanitizeHtml(rawHtml)

  return sanitizedHtml
}
