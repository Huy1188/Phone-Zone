import { notFound } from "next/navigation";
import NewsDetail from "@/app/components/Pages/News/NewsDetail";
import { getNewsBySlug } from "@/services/news";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) return notFound();

  const item = await getNewsBySlug(slug);
  return <NewsDetail item={item} />;
}

