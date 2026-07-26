import { readFileSync, writeFileSync, readdirSync, copyFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const blogDir = join(process.cwd(), 'src/content/blog');
const imgDir = join(process.cwd(), 'public/images/blog');
const assetsDirs = [
  join(process.cwd(), 'assets'),
  'C:/Users/Osama/.cursor/projects/d-WorkSpace-Cursor-Blog/assets',
];

mkdirSync(imgDir, { recursive: true });

const slugs = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

let copied = 0;
let updated = 0;

for (const slug of slugs) {
  const mdPath = join(blogDir, `${slug}.md`);
  let content = readFileSync(mdPath, 'utf8');
  const imgPath = `/images/blog/${slug}.png`;

  const frontmatterEnd = content.indexOf('\n---', 4);
  const frontmatter = frontmatterEnd > 0 ? content.slice(0, frontmatterEnd) : '';

  if (frontmatter.includes('heroImage:')) {
    content = content.replace(/heroImage: "[^"]*"/, `heroImage: "${imgPath}"`);
  } else if (content.startsWith('---')) {
    content = content.replace(
      /^(---\n[\s\S]*?)(\n---\n)/,
      (_, fm, close) => `${fm}\nheroImage: "${imgPath}"${close}`,
    );
  }

  writeFileSync(mdPath, content, 'utf8');
  updated++;

  const dest = join(imgDir, `${slug}.png`);
  for (const dir of assetsDirs) {
    const src = join(dir, `${slug}.png`);
    if (existsSync(src)) {
      copyFileSync(src, dest);
      copied++;
      break;
    }
  }
}

for (const file of readdirSync(imgDir)) {
  if (file.endsWith('.svg')) unlinkSync(join(imgDir, file));
}

console.log(`Updated ${updated} articles. Copied ${copied}/${slugs.length} hero images.`);

const missing = slugs.filter((s) => !existsSync(join(imgDir, `${s}.png`)));
if (missing.length) {
  console.log('Missing images:', missing.join(', '));
}
