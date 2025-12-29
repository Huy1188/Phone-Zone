
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; 
  thumbnail: string;
  category?: string;
  author?: string;
  publishedAt: string; 
  tags?: string[];
}
