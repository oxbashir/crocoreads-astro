import { marked, type Token } from 'marked';
import type { Heading } from '../types/article';

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Plain text from inline tokens — avoids HTML entity mismatches with TOC slugs. */
function inlinePlainText(tokens: Token[] | undefined): string {
  if (!tokens?.length) return '';

  return tokens
    .map((token) => {
      if ('tokens' in token && Array.isArray(token.tokens) && token.tokens.length > 0) {
        return inlinePlainText(token.tokens);
      }
      if ('text' in token && typeof token.text === 'string') {
        return token.text;
      }
      return '';
    })
    .join('');
}

/** Keep TOC hrefs and heading ids in sync, including duplicate titles. */
function createSlugTracker() {
  const counts = new Map<string, number>();
  return (text: string): string => {
    const base = slugifyHeading(text);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

export function renderMarkdown(content: string): string {
  const nextSlug = createSlugTracker();
  const renderer = new marked.Renderer();

  renderer.heading = function ({ tokens, depth }) {
    const html = this.parser.parseInline(tokens);
    const slug = nextSlug(inlinePlainText(tokens));
    return `<h${depth} id="${slug}">${html}</h${depth}>\n`;
  };

  return marked.parse(content, { async: false, renderer }) as string;
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const nextSlug = createSlugTracker();
  const tokens = marked.lexer(content);

  for (const token of tokens) {
    if (token.type === 'heading') {
      const text = inlinePlainText(token.tokens) || token.text.replace(/<[^>]+>/g, '');
      headings.push({
        depth: token.depth,
        slug: nextSlug(text),
        text,
      });
    }
  }

  return headings;
}

export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
