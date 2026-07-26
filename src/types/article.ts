export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author_id: string | null;
  author_name: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  hero_image?: string | null;
  pub_date: string;
  updated_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'author';
  created_at: string;
}

export type ArticleInput = Pick<
  Article,
  | 'slug'
  | 'title'
  | 'description'
  | 'content'
  | 'author_name'
  | 'tags'
  | 'draft'
  | 'featured'
  | 'hero_image'
  | 'pub_date'
>;

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}
