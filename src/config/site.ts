export const SITE = {
  name: 'CrocoReads',
  tagline: 'Smart reads for curious minds',
  url: 'https://crocoreads.com',
  author: 'Osama',
  authorBio:
    'Software engineer who writes about web development, productivity, and building things on the internet.',
  email: 'crocoreads@gmail.com',
  description:
    'CrocoReads publishes practical guides on web development, productivity tools, and modern tech — clear, actionable articles for builders and lifelong learners.',
  locale: 'en-US',
} as const;

export const ADSENSE = {
  /** Set to true after AdSense approval and add your publisher ID */
  enabled: false,
  clientId: 'ca-pub-XXXXXXXXXXXXXXXX',
  slots: {
    header: '0000000000',
    inArticle: '0000000001',
    sidebar: '0000000002',
    footer: '0000000003',
  },
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const FOOTER_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
] as const;
