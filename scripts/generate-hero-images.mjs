import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const blogDir = join(process.cwd(), 'src/content/blog');
const outDir = join(process.cwd(), 'public/images/blog');

const palettes = [
  ['#2563eb', '#dbeafe'],
  ['#0d9488', '#ccfbf1'],
  ['#7c3aed', '#ede9fe'],
  ['#ea580c', '#ffedd5'],
  ['#db2777', '#fce7f3'],
  ['#0891b2', '#cffafe'],
];

function slugToSvg(slug, index) {
  const [primary, bg] = palettes[index % palettes.length];
  const label = slug.replace(/-/g, ' ').slice(0, 40);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="${bg}"/>
  <circle cx="950" cy="120" r="180" fill="${primary}" opacity="0.12"/>
  <circle cx="200" cy="520" r="140" fill="${primary}" opacity="0.08"/>
  <rect x="80" y="80" width="1040" height="470" rx="32" fill="white" opacity="0.65"/>
  <rect x="120" y="140" width="72" height="72" rx="16" fill="${primary}"/>
  <text x="156" y="188" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="28" font-weight="700">CR</text>
  <text x="210" y="185" fill="#1a1a2e" font-family="system-ui,sans-serif" font-size="42" font-weight="700">CrocoReads</text>
  <text x="120" y="280" fill="#64748b" font-family="system-ui,sans-serif" font-size="26" font-weight="500">${label}</text>
  <rect x="120" y="320" width="320" height="8" rx="4" fill="${primary}" opacity="0.35"/>
  <rect x="120" y="350" width="480" height="8" rx="4" fill="${primary}" opacity="0.2"/>
  <rect x="120" y="380" width="400" height="8" rx="4" fill="${primary}" opacity="0.15"/>
</svg>`;
}

const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));

files.forEach((file, index) => {
  const slug = file.replace(/\.md$/, '');
  const svg = slugToSvg(slug, index);
  writeFileSync(join(outDir, `${slug}.svg`), svg, 'utf8');

  const path = join(blogDir, file);
  let content = readFileSync(path, 'utf8');

  if (!content.includes('heroImage:')) {
    content = content.replace(/draft: false\n/, 'draft: false\nheroImage: "/images/blog/' + slug + '.svg"\n');
  } else {
    content = content.replace(/heroImage: "[^"]+\.png"/, `heroImage: "/images/blog/${slug}.svg"`);
  }

  writeFileSync(path, content, 'utf8');
});

console.log(`Generated ${files.length} hero images and updated frontmatter.`);
