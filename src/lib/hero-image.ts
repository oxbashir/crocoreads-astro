/** Default hero path when Supabase row has no hero_image (e.g. seeded before column existed). */
export function resolveHeroImage(slug: string, heroImage?: string | null): string {
  return heroImage ?? `/images/blog/${slug}.png`;
}
