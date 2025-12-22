// src/types/news.ts
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // hoặc contentHTML nếu bạn render HTML
  thumbnail: string;
  category?: string;
  author?: string;
  publishedAt: string; // ISO string
  tags?: string[];
}
