import { api } from "@/lib/api";
import { NewsItem } from "@/types/news";

export const getNewsList = async () => {
  return api<NewsItem[]>("/news", { cache: "no-store" });
};

export const getNewsBySlug = async (slug: string) => {
  return api<NewsItem>(`/news/${slug}`, { cache: "no-store" });
};
