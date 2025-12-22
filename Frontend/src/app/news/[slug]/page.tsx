import { notFound } from "next/navigation";
import NewsDetail from "@/app/components/Pages/News/NewsDetail";
import { getNewsBySlug } from "@/app/data/newsData";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = getNewsBySlug(slug);
  if (!item) return notFound();

  return <NewsDetail item={item} />;
}
