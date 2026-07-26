import { marked } from 'marked';
import type { Heading } from '../types/article';

export function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string;
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const tokens = marked.lexer(content);

  for (const token of tokens) {
    if (token.type === 'heading') {
      const text = token.text.replace(/<[^>]+>/g, '');
      headings.push({
        depth: token.depth,
        slug: slugifyHeading(text),
        text,
      });
    }
  }

  return headings;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
