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
  enabled: true,
  clientId: 'ca-pub-6184876648163942',
  /** Replace with real slot IDs from AdSense → Ads → By ad unit */
  slots: {
    header: '0000000000',
    inArticle: '0000000001',
    sidebar: '0000000002',
    footer: '0000000003',
  },
} as const;

export function isAdSlotConfigured(slotId: string): boolean {
  return Boolean(slotId) && !/^0+$/.test(slotId);
}

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const FOOTER_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact us' },
] as const;
